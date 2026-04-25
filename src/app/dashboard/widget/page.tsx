import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WidgetPage({
  searchParams,
}: {
  searchParams: Promise<{ goto?: string }>;
}) {
  const { goto } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: calendars } = await supabase
    .from("calendars")
    .select("id, naam")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1);

  const tab = goto || "boekingsformulier";

  if (!calendars || calendars.length === 0) {
    redirect("/dashboard/kalender/nieuw");
  }

  redirect(`/dashboard/widget/${calendars[0].id}/${tab}`);
}
