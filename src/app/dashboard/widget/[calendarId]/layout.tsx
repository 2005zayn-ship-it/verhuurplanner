import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WidgetLayoutClient from "./WidgetLayoutClient";

export const dynamic = "force-dynamic";

export default async function WidgetLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ calendarId: string }>;
}) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: calendars } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (!calendars || calendars.length === 0) redirect("/dashboard/kalender/nieuw");

  const currentCalendar = calendars.find((c) => c.id === calendarId);
  if (!currentCalendar) notFound();

  return (
    <WidgetLayoutClient
      calendars={calendars}
      currentCalendarId={calendarId}
    >
      {children}
    </WidgetLayoutClient>
  );
}
