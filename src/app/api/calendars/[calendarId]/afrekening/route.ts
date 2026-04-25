import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam, facturatie_instellingen")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (!calendar) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  return NextResponse.json({ instellingen: calendar.facturatie_instellingen ?? {} });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (!calendar) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const body = await req.json();

  const { error } = await supabase
    .from("calendars")
    .update({ facturatie_instellingen: body })
    .eq("id", calendarId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam, facturatie_instellingen")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (!calendar) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const { van, tot, statussen } = await req.json();

  let query = supabase
    .from("bookings")
    .select("id, start_datum, eind_datum, gast_naam, status, notities, bron, facturatie_prijs, created_at")
    .eq("calendar_id", calendarId)
    .gte("start_datum", van)
    .lte("start_datum", tot)
    .order("start_datum", { ascending: true });

  if (statussen && statussen.length > 0) {
    query = query.in("status", statussen);
  }

  const { data: bookings, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("naam, email, facturatie_profiel")
    .eq("id", user.id)
    .single();

  let standaard_prijs_nacht: number | null = null;
  const { data: tarieven } = await supabase
    .from("calendar_tarieven")
    .select("prijs_nacht, is_standaard")
    .eq("calendar_id", calendarId)
    .eq("is_standaard", true)
    .single();

  if (tarieven) standaard_prijs_nacht = tarieven.prijs_nacht;

  const instellingen = (calendar.facturatie_instellingen ?? {}) as Record<string, unknown>;
  const handmatige_prijs =
    instellingen.huurprijs_type === "vast"
      ? (instellingen.huurprijs_nacht as number | null) ?? null
      : standaard_prijs_nacht;

  const regels = (bookings ?? []).map((b) => {
    const start = new Date(b.start_datum);
    const eind = new Date(b.eind_datum);
    const nachten = Math.round((eind.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const prijs_nacht = (b.facturatie_prijs as number | null) ?? handmatige_prijs;
    const totaal = prijs_nacht != null ? prijs_nacht * nachten : null;

    return {
      id: b.id,
      start_datum: b.start_datum,
      eind_datum: b.eind_datum,
      gast_naam: b.gast_naam,
      status: b.status,
      bron: b.bron,
      nachten,
      prijs_nacht,
      totaal,
    };
  });

  const totaal_huurinkomsten = regels.reduce((sum, r) => sum + (r.totaal ?? 0), 0);
  const commissie_type = (instellingen.commissie_type as string) ?? "percentage";
  const commissie_waarde = (instellingen.commissie_waarde as number) ?? 0;
  const commissie_bedrag =
    commissie_type === "percentage"
      ? (totaal_huurinkomsten * commissie_waarde) / 100
      : commissie_waarde * regels.length;
  const eigenaar_ontvangt = totaal_huurinkomsten - commissie_bedrag;

  return NextResponse.json({
    calendar: { naam: calendar.naam, woning_naam: calendar.woning_naam },
    beheerder: {
      naam: (profile?.facturatie_profiel as Record<string, unknown>)?.bedrijfsnaam ?? profile?.naam ?? "",
      ...(profile?.facturatie_profiel as object ?? {}),
    },
    eigenaar: {
      naam: instellingen.eigenaar_naam ?? "",
      email: instellingen.eigenaar_email ?? "",
      adres: instellingen.eigenaar_adres ?? "",
    },
    periode: { van, tot },
    regels,
    samenvatting: {
      totaal_huurinkomsten,
      commissie_type,
      commissie_waarde,
      commissie_bedrag,
      eigenaar_ontvangt,
    },
  });
}
