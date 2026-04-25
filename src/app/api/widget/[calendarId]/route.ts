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
    .select("widget_config")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  return NextResponse.json({ widget_config: data.widget_config ?? {} });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { section, config } = body as { section: string; config: Record<string, unknown> };

  if (!section || !config) {
    return NextResponse.json({ error: "section en config zijn verplicht" }, { status: 400 });
  }

  // Huidige config ophalen
  const { data: current } = await supabase
    .from("calendars")
    .select("widget_config")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (!current) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const updatedConfig = {
    ...(current.widget_config ?? {}),
    [section]: config,
  };

  const { error } = await supabase
    .from("calendars")
    .update({ widget_config: updatedConfig })
    .eq("id", calendarId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, widget_config: updatedConfig });
}
