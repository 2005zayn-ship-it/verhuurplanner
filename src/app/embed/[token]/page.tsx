import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { Booking } from "@/lib/types";
import EmbedClient from "./EmbedClient";

export const revalidate = 60; // refresh every minute

export default async function EmbedPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createAdminClient();

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam, kleur")
    .eq("public_token", token)
    .single();

  if (!calendar) notFound();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("start_datum, eind_datum, status")
    .eq("calendar_id", calendar.id);

  return (
    <EmbedClient
      kalenderNaam={calendar.naam}
      woningNaam={calendar.woning_naam}
      kleur={calendar.kleur}
      bookings={(bookings || []).map(b => ({ start_datum: b.start_datum, eind_datum: b.eind_datum, status: b.status }))}
    />
  );
}
