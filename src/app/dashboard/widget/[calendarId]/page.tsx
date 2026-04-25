import { redirect } from "next/navigation";

export default async function WidgetCalendarPage({
  params,
}: {
  params: Promise<{ calendarId: string }>;
}) {
  const { calendarId } = await params;
  redirect(`/dashboard/widget/${calendarId}/boekingsformulier`);
}
