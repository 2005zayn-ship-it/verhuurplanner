import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function toIcalDate(dateStr: string): string {
  // YYYY-MM-DD -> YYYYMMDD
  return dateStr.replace(/-/g, "");
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function escapeIcal(str: string): string {
  return str.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const cleanToken = token.replace(/\.ics$/, "");

  const admin = await createAdminClient();

  // Fetch calendar by public_token
  const { data: calendar, error: calError } = await admin
    .from("calendars")
    .select("id, naam, woning_naam")
    .eq("public_token", cleanToken)
    .single();

  if (calError || !calendar) {
    return new NextResponse("Kalender niet gevonden", { status: 404 });
  }

  // Fetch all bookings for this calendar
  const { data: bookings, error: bookError } = await admin
    .from("bookings")
    .select("id, start_datum, eind_datum, status, gast_naam")
    .eq("calendar_id", calendar.id)
    .order("start_datum");

  if (bookError) {
    return new NextResponse("Fout bij ophalen reservaties", { status: 500 });
  }

  const calName = escapeIcal(
    calendar.woning_naam || calendar.naam || "Verhuurkalender"
  );

  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  const statusLabels: Record<string, string> = {
    bezet: "Bezet",
    optie: "Optie",
    geblokkeerd: "Geblokkeerd",
  };

  const events = (bookings || [])
    .map((b) => {
      const label = statusLabels[b.status] ?? "Bezet";
      const dtstart = toIcalDate(b.start_datum);
      // DTEND is exclusive for DATE values in iCal
      const dtend = addDays(b.eind_datum, 1);
      const uid = `${b.id}@verhuurplanner.be`;

      return [
        "BEGIN:VEVENT",
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${label}`,
        `UID:${uid}`,
        `DTSTAMP:${now}Z`,
        `STATUS:${b.status === "optie" ? "TENTATIVE" : "CONFIRMED"}`,
        "TRANSP:OPAQUE",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Verhuurplanner//BE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${calName}`,
    "X-WR-CALDESC:Verhuurkalender via verhuurplanner.be",
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(ical, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${cleanToken}.ics"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
