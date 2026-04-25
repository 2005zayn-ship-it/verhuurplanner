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
    .from("calendar_tarieven")
    .select("*")
    .eq("calendar_id", calendarId)
    .order("volgorde", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tarieven: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Controleer eigendom
  const { data: cal } = await supabase
    .from("calendars")
    .select("id")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();
  if (!cal) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const body = await req.json();
  const { data, error } = await supabase
    .from("calendar_tarieven")
    .insert({ ...body, calendar_id: calendarId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tarief: data });
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
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id is verplicht" }, { status: 400 });

  const { data, error } = await supabase
    .from("calendar_tarieven")
    .update(updates)
    .eq("id", id)
    .eq("calendar_id", calendarId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tarief: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is verplicht" }, { status: 400 });

  const { error } = await supabase
    .from("calendar_tarieven")
    .delete()
    .eq("id", id)
    .eq("calendar_id", calendarId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
