import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import ImporteerClient from "./ImporteerClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boekingen importeren",
  robots: { index: false, follow: false },
};

export default async function ImporteerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id, naam")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!calendar) notFound();

  return <ImporteerClient calendarId={id} calendarNaam={calendar.naam} />;
}
