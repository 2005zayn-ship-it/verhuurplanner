import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import KalenderClient from "./KalenderClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kalender",
  robots: { index: false, follow: false },
};

export default async function KalenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: calendar } = await supabase
    .from("calendars")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!calendar) notFound();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, calendar_id, start_datum, eind_datum, gast_naam, gast_email, gast_telefoon, gast_adres, gast_postcode, gast_gemeente, gast_land, taal, aantal_volwassenen, aantal_kinderen, check_in_tijd, check_uit_tijd, status, notities, prive_notities, bron, prijs_totaal, facturatie_prijs, boeking_nummer_extern, created_at")
    .eq("calendar_id", id)
    .order("start_datum", { ascending: true });

  const { data: allCalendars } = await supabase
    .from("calendars")
    .select("id, naam, kleur")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <KalenderClient
      calendar={calendar}
      initialBookings={bookings || []}
      initialIcalImports={calendar.ical_import_urls ?? []}
      allCalendars={allCalendars ?? []}
    />
  );
}
