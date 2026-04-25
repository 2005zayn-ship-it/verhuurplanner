import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam, kleur, public_token, widget_config, ical_import_urls, created_at")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ calendar: data });
}
