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
    .select("*")
    .eq("calendar_id", id)
    .order("start_datum", { ascending: true });

  return <KalenderClient calendar={calendar} initialBookings={bookings || []} />;
}
