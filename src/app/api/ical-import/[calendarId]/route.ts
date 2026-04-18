import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

interface IcalImportUrl {
  url: string;
  naam: string;
}

/**
 * Parse a DATE value like "20260101" -> "2026-01-01"
 * or a DATETIME value like "20260101T120000Z" -> "2026-01-01"
 */
function parseIcalDate(raw: string): string | null {
  const cleaned = raw.trim().split("T")[0]; // strip time component
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

/**
 * Subtract one day from a YYYY-MM-DD string.
 * iCal DTEND is exclusive for DATE values, so we subtract 1 day to get eind_datum.
 */
function subtractOneDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

interface ParsedEvent {
  start_datum: string;
  eind_datum: string;
  summary: string;
}

function parseIcalText(icalText: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];

  // Unfold continued lines (lines that start with whitespace are continuations)
  const unfolded = icalText.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");

  // Split into VEVENT blocks
  const veventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let match: RegExpExecArray | null;

  while ((match = veventRegex.exec(unfolded)) !== null) {
    const block = match[1];

    // Extract DTSTART — handles VALUE=DATE and DATETIME formats
    const dtStartMatch = block.match(/DTSTART(?:[^:]*)?:([^\r\n]+)/);
    // Extract DTEND — handles VALUE=DATE and DATETIME formats
    const dtEndMatch = block.match(/DTEND(?:[^:]*)?:([^\r\n]+)/);
    // Extract SUMMARY
    const summaryMatch = block.match(/SUMMARY:([^\r\n]+)/);

    if (!dtStartMatch || !dtEndMatch) continue;

    const startDate = parseIcalDate(dtStartMatch[1]);
    const endDateRaw = parseIcalDate(dtEndMatch[1]);
    if (!startDate || !endDateRaw) continue;

    // iCal DTEND is exclusive — subtract 1 day for our inclusive eind_datum
    const endDate = subtractOneDay(endDateRaw);

    // Skip if end before start (can happen with single-day all-day events in some calendars)
    if (endDate < startDate) continue;

    const summary = (summaryMatch?.[1] ?? "Geblokkeerd").trim().slice(0, 50);

    events.push({ start_datum: startDate, eind_datum: endDate, summary });
  }

  return events;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;

  // Auth: user must own this calendar
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Verify ownership
  const { data: calendar, error: calError } = await supabase
    .from("calendars")
    .select("id, ical_import_urls")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (calError || !calendar) {
    return NextResponse.json({ error: "Kalender niet gevonden" }, { status: 404 });
  }

  const importUrls: IcalImportUrl[] = (calendar.ical_import_urls as IcalImportUrl[] | null) ?? [];

  if (importUrls.length === 0) {
    return NextResponse.json({ synced: 0, errors: [] });
  }

  const admin = await createAdminClient();
  const errors: string[] = [];
  let totalSynced = 0;

  // Delete all existing imported bookings for this calendar
  const { error: deleteError } = await admin
    .from("bookings")
    .delete()
    .eq("calendar_id", calendarId)
    .like("gast_naam", "[import]%");

  if (deleteError) {
    return NextResponse.json(
      { error: "Fout bij verwijderen oude geïmporteerde boekingen" },
      { status: 500 }
    );
  }

  // Fetch and parse each iCal URL
  for (const importUrl of importUrls) {
    try {
      const response = await fetch(importUrl.url, {
        headers: { "User-Agent": "Verhuurplanner/1.0 (+https://www.verhuurplanner.be)" },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        errors.push(`${importUrl.naam}: HTTP ${response.status}`);
        continue;
      }

      const icalText = await response.text();
      const events = parseIcalText(icalText);

      if (events.length === 0) {
        continue;
      }

      const bookingsToInsert = events.map(event => ({
        calendar_id: calendarId,
        start_datum: event.start_datum,
        eind_datum: event.eind_datum,
        gast_naam: `[import] ${event.summary}`,
        status: "geblokkeerd" as const,
        notities: `Geïmporteerd van ${importUrl.naam}`,
        bron: "import" as const,
      }));

      const { error: insertError } = await admin
        .from("bookings")
        .insert(bookingsToInsert);

      if (insertError) {
        errors.push(`${importUrl.naam}: fout bij opslaan (${insertError.message})`);
      } else {
        totalSynced += events.length;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Onbekende fout";
      errors.push(`${importUrl.naam}: ${message}`);
    }
  }

  return NextResponse.json({ synced: totalSynced, errors });
}
