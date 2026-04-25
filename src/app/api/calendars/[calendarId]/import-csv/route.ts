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
  const lower = headers.map((h) => h.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_"));
  for (const alias of aliases) {
    const idx = lower.indexOf(alias.toLowerCase().replace(/[^a-z0-9_]/g, "_"));
    if (idx !== -1) return idx;
  }
  return -1;
}

function col(cols: string[], idx: number): string {
  return idx !== -1 ? (cols[idx]?.trim() ?? "") : "";
}

function colOrNull(cols: string[], idx: number): string | null {
  const v = col(cols, idx);
  return v || null;
}

function parsePrice(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.,]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function parseIntVal(val: string): number | null {
  if (!val) return null;
  const n = globalThis.parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function mapStatus(status: string): BookingStatus {
  const s = status.toLowerCase().replace(/\*/g, "").trim();
  if (
    s.includes("niet beschikbaar") ||
    s.includes("onderhoud") ||
    s.includes("blocked") ||
    s.includes("maintenance") ||
    s.includes("unavailable")
  ) return "geblokkeerd";
  if (
    s.includes("gereserveerd") ||
    s.includes("option") ||
    s.includes("optie") ||
    s.includes("tentative") ||
    s.includes("pending")
  ) return "optie";
  return "bezet";
}

function mapBron(statusStr: string, sourceStr: string): BookingBron {
  const combined = `${statusStr} ${sourceStr}`.toLowerCase();
  if (combined.includes("vipio")) return "vipio";
  if (combined.includes("airbnb")) return "airbnb";
  if (combined.includes("booking.com") || combined.includes("booking_com") || combined.includes("bookingcom")) return "booking_com";
  if (combined.includes("naturhuisje") || combined.includes("nature")) return "naturhuisje";
  if (combined.includes("micazu")) return "micazu";
  return "import";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const { calendarId } = await params;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data: calendar, error: calError } = await supabase
    .from("calendars")
    .select("id")
    .eq("id", calendarId)
    .eq("user_id", user.id)
    .single();

  if (calError || !calendar) return NextResponse.json({ error: "Kalender niet gevonden" }, { status: 404 });

  let text: string;
  try {
    const formData = await req.formData();
    const file = formData.get("csv") as File | null;
    if (!file) return NextResponse.json({ error: "Geen bestand meegestuurd" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Bestand te groot (max 5 MB)" }, { status: 400 });
    text = await file.text();
  } catch {
    return NextResponse.json({ error: "Ongeldig bestand" }, { status: 400 });
  }

  const lines = text.split("\n").map((l) => l.replace(/\r$/, "")).filter((l) => l.trim());
  if (lines.length < 2) return NextResponse.json({ error: "CSV is leeg of bevat geen data-rijen" }, { status: 400 });

  const headers = parseCsvLine(lines[0]);

  // ── Datum kolommen ──
  const colStart = findColumn(headers, ["arrival", "arrival_date", "aankomst", "check_in", "start_date", "startdatum", "checkin"]);
  const colEnd   = findColumn(headers, ["departure", "departure_date", "vertrek", "check_out", "end_date", "einddatum", "checkout"]);

  if (colStart === -1 || colEnd === -1) {
    return NextResponse.json(
      { error: "Aankomst- of vertrekdatumkolom niet gevonden. Controleer of dit een geldig huurkalender.nl CSV-bestand is." },
      { status: 400 }
    );
  }

  // ── Status & import-flag ──
  const colStatus   = findColumn(headers, ["booking_status", "status", "boeking_status"]);
  const colImport   = findColumn(headers, ["booking_import", "boeking_import", "is_ical", "ical_import"]);

  // ── Gastnaam ──
  const colGuestFirst = findColumn(headers, ["first_name", "firstname", "voornaam", "prenom"]);
  const colGuestLast  = findColumn(headers, ["last_name", "lastname", "achternaam", "surname", "nom"]);
  const colGuestFull  = findColumn(headers, ["guest_name", "full_name", "gast_naam", "name", "naam"]);

  // ── Contact ──
  const colEmail     = findColumn(headers, ["email", "email_address", "e_mail", "gast_email", "guest_email", "mail"]);
  const colPhone     = findColumn(headers, ["phone", "telephone", "tel", "phone_number", "telefoon", "gast_telefoon", "mobile", "mobiel"]);
  const colAdres     = findColumn(headers, ["address", "adres", "street", "straat", "street_address"]);
  const colPostcode  = findColumn(headers, ["postcode", "zip", "postal_code", "zipcode"]);
  const colGemeente  = findColumn(headers, ["city", "gemeente", "town", "stad", "place"]);
  const colLand      = findColumn(headers, ["country", "land", "nationality", "nationaliteit", "pays"]);
  const colTaal      = findColumn(headers, ["language", "taal", "lang", "locale"]);

  // ── Aantallen ──
  const colAdulten   = findColumn(headers, ["adults", "volwassenen", "aantal_volwassenen", "persons", "personen", "adult_count", "pax"]);
  const colKinderen  = findColumn(headers, ["children", "kinderen", "aantal_kinderen", "kids", "child_count"]);

  // ── Tijden ──
  const colCheckInTijd  = findColumn(headers, ["checkin_time", "check_in_time", "aankomst_tijd", "arrival_time", "time_arrival"]);
  const colCheckUitTijd = findColumn(headers, ["checkout_time", "check_out_time", "vertrek_tijd", "departure_time", "time_departure"]);

  // ── Prijs ──
  const colPrijsTotaal = findColumn(headers, [
    "total", "total_price", "prijs_totaal", "amount", "bedrag", "rental_price",
    "total_amount", "totaal", "price", "prijs", "huurprijs", "rental_amount",
    "invoice_amount", "factuurbedrag",
  ]);
  const colPrijsNacht  = findColumn(headers, ["price_per_night", "prijs_per_nacht", "nightly_rate", "nachtprijs"]);

  // ── Notities ──
  const colNotes      = findColumn(headers, ["notes", "internal_notes", "notities", "remarks", "admin_notes", "opmerkingen", "note", "memo"]);
  const colPriveNotes = findColumn(headers, ["private_notes", "prive_notities", "internal_note", "staff_notes"]);

  // ── Bron ──
  const colSource = findColumn(headers, ["source", "channel", "platform", "bron", "booking_source", "origin"]);

  // ── Extern boekingnummer ──
  const colBoekNrExt = findColumn(headers, [
    "booking_number", "booking_id", "boeking_nummer", "reservation_number",
    "reservation_id", "ref", "reference", "order_id", "id",
  ]);

  const admin = await createAdminClient();
  let imported = 0;
  let skipped = 0;

  type BookingInsert = {
    calendar_id: string;
    start_datum: string;
    eind_datum: string;
    gast_naam: string | null;
    gast_email: string | null;
    gast_telefoon: string | null;
    gast_adres: string | null;
    gast_postcode: string | null;
    gast_gemeente: string | null;
    gast_land: string | null;
    taal: string | null;
    aantal_volwassenen: number | null;
    aantal_kinderen: number | null;
    check_in_tijd: string | null;
    check_uit_tijd: string | null;
    status: BookingStatus;
    notities: string | null;
    prive_notities: string | null;
    bron: BookingBron;
    prijs_totaal: number | null;
    facturatie_prijs: number | null;
    boeking_nummer_extern: string | null;
  };

  const bookingsToInsert: BookingInsert[] = [];

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);

    // iCal-duplicaten overslaan
    if (colImport !== -1 && cols[colImport]?.trim() === "1") {
      skipped++;
      continue;
    }

    const startDate = col(cols, colStart).split(" ")[0]; // strip time if present
    const endDate   = col(cols, colEnd).split(" ")[0];

    if (!startDate?.match(/^\d{4}-\d{2}-\d{2}$/) || !endDate?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      skipped++;
      continue;
    }

    if (endDate < startDate) {
      skipped++;
      continue;
    }

    const statusStr = col(cols, colStatus);
    const sourceStr = col(cols, colSource);

    // Gastnaam
    let guestName: string | null = null;
    if (colGuestFull !== -1 && cols[colGuestFull]?.trim()) {
      guestName = cols[colGuestFull].trim();
    } else if (colGuestFirst !== -1 || colGuestLast !== -1) {
      const parts = [
        colGuestFirst !== -1 ? cols[colGuestFirst]?.trim() : "",
        colGuestLast !== -1  ? cols[colGuestLast]?.trim()  : "",
      ].filter(Boolean);
      guestName = parts.join(" ") || null;
    }

    bookingsToInsert.push({
      calendar_id:           calendarId,
      start_datum:           startDate,
      eind_datum:            endDate,
      gast_naam:             guestName,
      gast_email:            colOrNull(cols, colEmail),
      gast_telefoon:         colOrNull(cols, colPhone),
      gast_adres:            colOrNull(cols, colAdres),
      gast_postcode:         colOrNull(cols, colPostcode),
      gast_gemeente:         colOrNull(cols, colGemeente),
      gast_land:             colOrNull(cols, colLand),
      taal:                  colOrNull(cols, colTaal),
      aantal_volwassenen:    parseIntVal(col(cols, colAdulten)),
      aantal_kinderen:       parseIntVal(col(cols, colKinderen)),
      check_in_tijd:         colOrNull(cols, colCheckInTijd),
      check_uit_tijd:        colOrNull(cols, colCheckUitTijd),
      status:                mapStatus(statusStr),
      notities:              colOrNull(cols, colNotes),
      prive_notities:        colOrNull(cols, colPriveNotes),
      bron:                  mapBron(statusStr, sourceStr),
      prijs_totaal:          parsePrice(col(cols, colPrijsTotaal)),
      facturatie_prijs:      parsePrice(col(cols, colPrijsNacht)),
      boeking_nummer_extern: colOrNull(cols, colBoekNrExt),
    });
    imported++;
  }

  if (bookingsToInsert.length === 0) return NextResponse.json({ imported: 0, skipped });

  for (let i = 0; i < bookingsToInsert.length; i += 100) {
    const batch = bookingsToInsert.slice(i, i + 100);
    const { error: insertError } = await admin.from("bookings").insert(batch);
    if (insertError) {
      return NextResponse.json({ error: `Fout bij opslaan: ${insertError.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ imported, skipped });
}
