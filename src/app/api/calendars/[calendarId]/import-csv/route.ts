import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { BookingBron, BookingStatus } from "@/lib/types";

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      i++;
      let field = "";
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++;
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field);
      if (line[i] === ",") i++;
    } else {
      const end = line.indexOf(",", i);
      if (end === -1) {
        fields.push(line.slice(i));
        break;
      }
      fields.push(line.slice(i, end));
      i = end + 1;
    }
  }
  return fields;
}

function findColumn(headers: string[], aliases: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = lower.indexOf(alias.toLowerCase());
    if (idx !== -1) return idx;
  }
  return -1;
}

function mapStatus(status: string): BookingStatus {
  const s = status.toLowerCase().replace(/\*/g, "").trim();
  if (
    s.includes("niet beschikbaar") ||
    s.includes("onderhoud") ||
    s.includes("blocked") ||
    s.includes("maintenance") ||
    s.includes("unavailable")
  ) {
    return "geblokkeerd";
  }
  if (
    s.includes("gereserveerd") ||
    s.includes("option") ||
    s.includes("optie") ||
    s.includes("tentative") ||
    s.includes("pending")
  ) {
    return "optie";
  }
  return "bezet";
}

function mapBron(statusStr: string, sourceStr: string): BookingBron {
  const combined = `${statusStr} ${sourceStr}`.toLowerCase();
  if (combined.includes("vipio")) return "vipio";
  if (combined.includes("airbnb")) return "airbnb";
  if (
    combined.includes("booking.com") ||
    combined.includes("booking_com") ||
    combined.includes("bookingcom")
  )
    return "booking_com";
  if (combined.includes("naturhuisje") || combined.includes("nature"))
    return "naturhuisje";
  if (combined.includes("micazu")) return "micazu";
  return "import";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: calendar, error: calError } = await supabase
    .from("calendars")
    .select("id")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (calError || !calendar) {
    return NextResponse.json({ error: "Kalender niet gevonden" }, { status: 404 });
  }

  let text: string;
  try {
    const formData = await req.formData();
    const file = formData.get("csv") as File | null;
    if (!file)
      return NextResponse.json({ error: "Geen bestand meegestuurd" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: "Bestand te groot (max 5 MB)" }, { status: 400 });
    text = await file.text();
  } catch {
    return NextResponse.json({ error: "Ongeldig bestand" }, { status: 400 });
  }

  const lines = text
    .split("\n")
    .map((l) => l.replace(/\r$/, ""))
    .filter((l) => l.trim());

  if (lines.length < 2) {
    return NextResponse.json(
      { error: "CSV is leeg of bevat geen data-rijen" },
      { status: 400 }
    );
  }

  const headers = parseCsvLine(lines[0]);

  const colStart = findColumn(headers, [
    "arrival",
    "arrival_date",
    "aankomst",
    "check_in",
    "start_date",
    "startdatum",
  ]);
  const colEnd = findColumn(headers, [
    "departure",
    "departure_date",
    "vertrek",
    "check_out",
    "end_date",
    "einddatum",
  ]);
  const colStatus = findColumn(headers, [
    "booking_status",
    "status",
    "boeking_status",
  ]);
  const colImport = findColumn(headers, [
    "booking_import",
    "boeking_import",
  ]);
  const colGuestFirst = findColumn(headers, [
    "first_name",
    "firstname",
    "voornaam",
  ]);
  const colGuestLast = findColumn(headers, [
    "last_name",
    "lastname",
    "achternaam",
    "surname",
  ]);
  const colGuestFull = findColumn(headers, [
    "guest_name",
    "full_name",
    "gast_naam",
  ]);
  const colNotes = findColumn(headers, [
    "notes",
    "internal_notes",
    "notities",
    "remarks",
    "admin_notes",
    "opmerkingen",
  ]);
  const colSource = findColumn(headers, [
    "source",
    "channel",
    "platform",
    "bron",
    "booking_source",
  ]);

  if (colStart === -1 || colEnd === -1) {
    return NextResponse.json(
      {
        error:
          "Aankomst- of vertrekdatumkolom niet gevonden. Controleer of dit een geldig huurkalender.nl CSV-bestand is.",
      },
      { status: 400 }
    );
  }

  const admin = await createAdminClient();
  let imported = 0;
  let skipped = 0;

  const bookingsToInsert: Array<{
    calendar_id: string;
    start_datum: string;
    eind_datum: string;
    gast_naam: string | null;
    status: BookingStatus;
    notities: string | null;
    bron: BookingBron;
  }> = [];

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);

    // Skip iCal-duplicaten
    if (colImport !== -1 && cols[colImport]?.trim() === "1") {
      skipped++;
      continue;
    }

    const startDate = cols[colStart]?.trim();
    const endDate = cols[colEnd]?.trim();

    if (
      !startDate?.match(/^\d{4}-\d{2}-\d{2}$/) ||
      !endDate?.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      skipped++;
      continue;
    }

    if (endDate < startDate) {
      skipped++;
      continue;
    }

    const statusStr = colStatus !== -1 ? (cols[colStatus]?.trim() ?? "") : "";
    const sourceStr = colSource !== -1 ? (cols[colSource]?.trim() ?? "") : "";

    let guestName: string | null = null;
    if (colGuestFull !== -1 && cols[colGuestFull]?.trim()) {
      guestName = cols[colGuestFull].trim();
    } else if (colGuestFirst !== -1 || colGuestLast !== -1) {
      const parts = [
        colGuestFirst !== -1 ? cols[colGuestFirst]?.trim() : "",
        colGuestLast !== -1 ? cols[colGuestLast]?.trim() : "",
      ].filter(Boolean);
      guestName = parts.join(" ") || null;
    }

    const notities =
      colNotes !== -1 ? cols[colNotes]?.trim() || null : null;

    bookingsToInsert.push({
      calendar_id: calendarId,
      start_datum: startDate,
      eind_datum: endDate,
      gast_naam: guestName,
      status: mapStatus(statusStr),
      notities,
      bron: mapBron(statusStr, sourceStr),
    });
    imported++;
  }

  if (bookingsToInsert.length === 0) {
    return NextResponse.json({ imported: 0, skipped });
  }

  for (let i = 0; i < bookingsToInsert.length; i += 100) {
    const batch = bookingsToInsert.slice(i, i + 100);
    const { error: insertError } = await admin.from("bookings").insert(batch);
    if (insertError) {
      return NextResponse.json(
        { error: `Fout bij opslaan: ${insertError.message}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ imported, skipped });
}
