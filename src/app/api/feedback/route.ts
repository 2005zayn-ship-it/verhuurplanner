import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("naam, email")
    .eq("id", user.id)
    .single();

  const body = await req.json();
  const { type, bericht } = body;

  if (!type || !bericht?.trim()) {
    return NextResponse.json({ error: "Type en bericht zijn verplicht" }, { status: 400 });
  }

  const VALID_TYPES = ["suggestie", "bug", "vraag", "compliment"];
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  }

  const admin = await createAdminClient();
  const { error } = await admin.from("feedback").insert({
    type,
    bericht: bericht.trim().slice(0, 2000),
    naam: profile?.naam ?? null,
    email: profile?.email ?? user.email,
    user_id: user.id,
  });

  if (error) return NextResponse.json({ error: "Opslaan mislukt" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
