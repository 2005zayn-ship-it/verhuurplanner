"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isWithinInterval,
  parseISO,
  addMonths,
  subMonths,
  isBefore,
  isToday,
  isPast,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  getISOWeek,
  differenceInDays,
} from "date-fns";
import { nl } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Booking, BookingStatus } from "@/lib/types";

interface IcalImport {
  url: string;
  naam: string;
}

interface Props {
  calendar: Calendar;
  initialBookings: Booking[];
  initialIcalImports: IcalImport[];
  allCalendars: { id: string; naam: string; kleur: string }[];
}

const BRON_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Onbekend" },
  { value: "eigen_website", label: "Eigen website" },
  { value: "vakantiewoningen_be", label: "Vakantiewoningen-in-België" },
  { value: "rechtstreeks", label: "Rechtstreeks (telefoon / mail)" },
  { value: "vipio", label: "Vipio" },
  { value: "booking_com", label: "Booking.com" },
  { value: "airbnb", label: "Airbnb / VRBO" },
  { value: "naturhuisje", label: "Natuurhuisje" },
  { value: "micazu", label: "Micazu" },
  { value: "andere", label: "Andere" },
];

const BRON_LABELS: Record<string, string> = {
  eigen_website: "Eigen website",
  vakantiewoningen_be: "Vakantiewoningen-in-België",
  rechtstreeks: "Rechtstreeks",
  vipio: "Vipio",
  booking_com: "Booking.com",
  airbnb: "Airbnb / VRBO",
  naturhuisje: "Natuurhuisje",
  micazu: "Micazu",
  import: "iCal import",
  andere: "Andere",
};

const BRON_COLORS: Record<string, string> = {
  eigen_website: "bg-accent text-white",
  vakantiewoningen_be: "bg-green-500 text-white",
  rechtstreeks: "bg-warm-600 text-white",
  vipio: "bg-purple-500 text-white",
  booking_com: "bg-blue-500 text-white",
  airbnb: "bg-red-500 text-white",
  naturhuisje: "bg-emerald-500 text-white",
  micazu: "bg-orange-500 text-white",
  import: "bg-warm-300 text-warm-800",
  andere: "bg-warm-200 text-warm-700",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  bezet: "Bezet",
  optie: "Optie",
  geblokkeerd: "Geblokkeerd",
};

// Inline style colors for diagonal split rendering
const STATUS_HEX: Record<BookingStatus, string> = {
  bezet: "#f07e6f",
  optie: "#f59e0b",
  geblokkeerd: "#9ca3af",
};

const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  bezet: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  optie: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  geblokkeerd: { bg: "bg-warm-100", text: "text-warm-500", dot: "bg-warm-400" },
};

const TAAL_OPTIONS = [
  { value: "NL", label: "Nederlands" },
  { value: "FR", label: "Frans" },
  { value: "DE", label: "Duits" },
  { value: "EN", label: "Engels" },
];

const AANTALMAANDEN_OPTIONS = [1, 2, 3, 4, 5, 6, 12];

// Full formData shape — all fields in one place
interface FormData {
  gastNaam: string;
  status: BookingStatus;
  notities: string;
  notitiesVerborgen: boolean;
  priveNotities: string;
  bron: string;
  facturatiePrijs: string;
  prijsTotaal: string;
  gastEmail: string;
  gastTelefoon: string;
  gastAdres: string;
  gastPostcode: string;
  gastGemeente: string;
  gastLand: string;
  taal: string;
  aantalVolwassenen: string;
  aantalKinderen: string;
  checkInTijd: string;
  checkUitTijd: string;
  boekingNummerExtern: string;
}

const EMPTY_FORM: FormData = {
  gastNaam: "",
  status: "bezet",
  notities: "",
  notitiesVerborgen: false,
  priveNotities: "",
  bron: "",
  facturatiePrijs: "",
  prijsTotaal: "",
  gastEmail: "",
  gastTelefoon: "",
  gastAdres: "",
  gastPostcode: "",
  gastGemeente: "",
  gastLand: "",
  taal: "",
  aantalVolwassenen: "",
  aantalKinderen: "",
  checkInTijd: "",
  checkUitTijd: "",
  boekingNummerExtern: "",
};

function bookingToFormData(b: Booking): FormData {
  return {
    gastNaam: b.gast_naam || "",
    status: b.status,
    notities: b.notities || "",
    notitiesVerborgen: false, // no DB field yet — defaults to false
    priveNotities: b.prive_notities || "",
    bron: b.bron || "",
    facturatiePrijs: b.facturatie_prijs?.toString() || "",
    prijsTotaal: b.prijs_totaal?.toString() || "",
    gastEmail: b.gast_email || "",
    gastTelefoon: b.gast_telefoon || "",
    gastAdres: b.gast_adres || "",
    gastPostcode: b.gast_postcode || "",
    gastGemeente: b.gast_gemeente || "",
    gastLand: b.gast_land || "",
    taal: b.taal || "",
    aantalVolwassenen: b.aantal_volwassenen?.toString() || "",
    aantalKinderen: b.aantal_kinderen?.toString() || "",
    checkInTijd: b.check_in_tijd || "",
    checkUitTijd: b.check_uit_tijd || "",
    boekingNummerExtern: b.boeking_nummer_extern || "",
  };
}

export default function KalenderClient({ calendar, initialBookings, initialIcalImports, allCalendars }: Props) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [startDate, setStartDate] = useState(() => startOfMonth(new Date()));
  const [aantalMaanden, setAantalMaanden] = useState(3);
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"kalender" | "embed" | "ical">("kalender");
  const [copied, setCopied] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);
  const [copiedBeschikbaarheid, setCopiedBeschikbaarheid] = useState(false);
  const [zoekQuery, setZoekQuery] = useState("");
  const [zoekOpen, setZoekOpen] = useState(false);
  const [toonMeerReservaties, setToonMeerReservaties] = useState(false);
  const [jaaroverzichtOpen, setJaaroverzichtOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    booking: Booking;
    top: number;
    left: number;
    above: boolean;
  } | null>(null);
  const tooltipHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // iCal import state
  const [icalImports, setIcalImports] = useState<IcalImport[]>(initialIcalImports);
  const [importNaam, setImportNaam] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isSavingImport, setIsSavingImport] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; errors: string[] } | null>(null);

  // Cleanup timeouts
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedIcalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedBeschikbaarheidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (copiedIcalTimerRef.current) clearTimeout(copiedIcalTimerRef.current);
      if (copiedBeschikbaarheidTimerRef.current) clearTimeout(copiedBeschikbaarheidTimerRef.current);
      if (tooltipHideTimer.current) clearTimeout(tooltipHideTimer.current);
    };
  }, []);

  const embedCode = `<script src="https://www.verhuurplanner.be/embed/${calendar.public_token}.js" async></script>\n<div id="verhuurplanner-${calendar.public_token}"></div>`;
  const icalUrl = `https://www.verhuurplanner.be/api/ical/${calendar.public_token}.ics`;
  const beschikbaarheidUrl = `https://www.verhuurplanner.be/beschikbaarheid/${calendar.public_token}`;

  // --- Helper: get booking(s) for a day ---
  function getBookingsForDay(dateStr: string): Booking[] {
    return bookings.filter(b => dateStr >= b.start_datum && dateStr <= b.eind_datum);
  }

  // --- Day cell style calculation ---
  function getDayCellStyle(
    dateStr: string,
    arrivalBooking: Booking | null,
    departureBooking: Booking | null,
    fullBooking: Booking | null
  ): React.CSSProperties {
    if (fullBooking && !arrivalBooking && !departureBooking) {
      return { backgroundColor: STATUS_HEX[fullBooking.status] };
    }
    if (arrivalBooking && departureBooking) {
      const depColor = STATUS_HEX[departureBooking.status];
      const arrColor = STATUS_HEX[arrivalBooking.status];
      return { background: `linear-gradient(to top left, ${depColor} 50%, ${arrColor} 50%)` };
    }
    if (arrivalBooking) {
      const color = STATUS_HEX[arrivalBooking.status];
      return { background: `linear-gradient(to top left, ${color} 50%, transparent 50%)` };
    }
    if (departureBooking) {
      const color = STATUS_HEX[departureBooking.status];
      return { background: `linear-gradient(to top left, transparent 50%, ${color} 50%)` };
    }
    return {};
  }

  // --- Open edit modal for a booking ---
  function openEditModal(b: Booking) {
    setEditingBooking(b);
    setFormData(bookingToFormData(b));
    setContactInfoOpen(false);
    setModal("edit");
  }

  // --- Booking interaction ---
  function handleDayClick(date: Date, e?: React.MouseEvent) {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayBookings = getBookingsForDay(dateStr);

    if (dayBookings.length > 0) {
      // If tooltip is open for this booking, open the edit modal
      openEditModal(dayBookings[0]);
      return;
    }

    if (!selecting) {
      setSelectStart(date);
      setSelectEnd(date);
      setSelecting(true);
    } else {
      const start = selectStart!;
      const actualStart = isBefore(date, start) ? date : start;
      const actualEnd = isBefore(date, start) ? start : date;
      setSelectStart(actualStart);
      setSelectEnd(actualEnd);
      setSelecting(false);
      setFormData(EMPTY_FORM);
      setModal("new");
    }
  }

  function handleDayHover(date: Date) {
    setHoverDate(date);
    if (selecting && selectStart) {
      setSelectEnd(isBefore(date, selectStart) ? selectStart : date);
    }
  }

  function isInSelection(date: Date): boolean {
    if (!selectStart || !selectEnd) return false;
    return isWithinInterval(date, { start: selectStart, end: selectEnd });
  }

  // --- Tooltip handlers ---
  function showTooltip(booking: Booking, cellEl: HTMLElement) {
    if (selecting) return;
    if (tooltipHideTimer.current) {
      clearTimeout(tooltipHideTimer.current);
      tooltipHideTimer.current = null;
    }
    const rect = cellEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < 160;
    setHoveredTooltip({
      booking,
      top: above ? rect.top - 8 : rect.bottom + 8,
      left: rect.left + rect.width / 2,
      above,
    });
  }

  function hideTooltipDelayed() {
    if (tooltipHideTimer.current) clearTimeout(tooltipHideTimer.current);
    tooltipHideTimer.current = setTimeout(() => setHoveredTooltip(null), 200);
  }

  async function handleDeleteFromTooltip(b: Booking) {
    if (!window.confirm(`Reservatie van ${b.gast_naam || "onbekende gast"} verwijderen?`)) return;
    const supabase = createClient();
    await supabase.from("bookings").delete().eq("id", b.id);
    setBookings(prev => prev.filter(x => x.id !== b.id));
    setHoveredTooltip(null);
  }

  // --- CRUD ---
  async function handleSaveNew() {
    if (!selectStart || !selectEnd) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        calendar_id: calendar.id,
        start_datum: format(selectStart, "yyyy-MM-dd"),
        eind_datum: format(selectEnd, "yyyy-MM-dd"),
        gast_naam: formData.gastNaam || null,
        gast_email: formData.gastEmail || null,
        gast_telefoon: formData.gastTelefoon || null,
        gast_adres: formData.gastAdres || null,
        gast_postcode: formData.gastPostcode || null,
        gast_gemeente: formData.gastGemeente || null,
        gast_land: formData.gastLand || null,
        taal: formData.taal || null,
        aantal_volwassenen: formData.aantalVolwassenen ? Number(formData.aantalVolwassenen) : null,
        aantal_kinderen: formData.aantalKinderen ? Number(formData.aantalKinderen) : null,
        check_in_tijd: formData.checkInTijd || null,
        check_uit_tijd: formData.checkUitTijd || null,
        status: formData.status,
        notities: formData.notities || null,
        prive_notities: formData.priveNotities || null,
        bron: formData.bron || null,
        prijs_totaal: formData.prijsTotaal ? Number(formData.prijsTotaal) : null,
        facturatie_prijs: formData.facturatiePrijs ? Number(formData.facturatiePrijs) : null,
        boeking_nummer_extern: formData.boekingNummerExtern || null,
      })
      .select()
      .single();
    if (!error && data) setBookings(prev => [...prev, data]);
    setSaving(false);
    setModal(null);
    setSelectStart(null);
    setSelectEnd(null);
  }

  async function handleSaveEdit() {
    if (!editingBooking) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({
        gast_naam: formData.gastNaam || null,
        gast_email: formData.gastEmail || null,
        gast_telefoon: formData.gastTelefoon || null,
        gast_adres: formData.gastAdres || null,
        gast_postcode: formData.gastPostcode || null,
        gast_gemeente: formData.gastGemeente || null,
        gast_land: formData.gastLand || null,
        taal: formData.taal || null,
        aantal_volwassenen: formData.aantalVolwassenen ? Number(formData.aantalVolwassenen) : null,
        aantal_kinderen: formData.aantalKinderen ? Number(formData.aantalKinderen) : null,
        check_in_tijd: formData.checkInTijd || null,
        check_uit_tijd: formData.checkUitTijd || null,
        status: formData.status,
        notities: formData.notities || null,
        prive_notities: formData.priveNotities || null,
        bron: formData.bron || null,
        prijs_totaal: formData.prijsTotaal ? Number(formData.prijsTotaal) : null,
        facturatie_prijs: formData.facturatiePrijs ? Number(formData.facturatiePrijs) : null,
        boeking_nummer_extern: formData.boekingNummerExtern || null,
      })
      .eq("id", editingBooking.id);
    if (!error) {
      setBookings(prev =>
        prev.map(b =>
          b.id === editingBooking.id
            ? {
                ...b,
                gast_naam: formData.gastNaam || null,
                gast_email: formData.gastEmail || null,
                gast_telefoon: formData.gastTelefoon || null,
                gast_adres: formData.gastAdres || null,
                gast_postcode: formData.gastPostcode || null,
                gast_gemeente: formData.gastGemeente || null,
                gast_land: formData.gastLand || null,
                taal: formData.taal || null,
                aantal_volwassenen: formData.aantalVolwassenen ? Number(formData.aantalVolwassenen) : null,
                aantal_kinderen: formData.aantalKinderen ? Number(formData.aantalKinderen) : null,
                check_in_tijd: formData.checkInTijd || null,
                check_uit_tijd: formData.checkUitTijd || null,
                status: formData.status,
                notities: formData.notities || null,
                prive_notities: formData.priveNotities || null,
                bron: (formData.bron || null) as import("@/lib/types").BookingBron,
                prijs_totaal: formData.prijsTotaal ? Number(formData.prijsTotaal) : null,
                facturatie_prijs: formData.facturatiePrijs ? Number(formData.facturatiePrijs) : null,
                boeking_nummer_extern: formData.boekingNummerExtern || null,
              }
            : b
        )
      );
    }
    setSaving(false);
    setModal(null);
    setEditingBooking(null);
  }

  async function handleDelete() {
    if (!editingBooking) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("bookings").delete().eq("id", editingBooking.id);
    setBookings(prev => prev.filter(b => b.id !== editingBooking.id));
    setSaving(false);
    setModal(null);
    setEditingBooking(null);
  }

  function cancelModal() {
    setModal(null);
    setEditingBooking(null);
    setSelectStart(null);
    setSelectEnd(null);
    setSelecting(false);
    setContactInfoOpen(false);
  }

  // --- Copy helpers ---
  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  function copyIcal() {
    navigator.clipboard.writeText(icalUrl);
    setCopiedIcal(true);
    if (copiedIcalTimerRef.current) clearTimeout(copiedIcalTimerRef.current);
    copiedIcalTimerRef.current = setTimeout(() => setCopiedIcal(false), 2000);
  }

  function copyBeschikbaarheid() {
    navigator.clipboard.writeText(beschikbaarheidUrl);
    setCopiedBeschikbaarheid(true);
    if (copiedBeschikbaarheidTimerRef.current) clearTimeout(copiedBeschikbaarheidTimerRef.current);
    copiedBeschikbaarheidTimerRef.current = setTimeout(() => setCopiedBeschikbaarheid(false), 2000);
  }

  // --- iCal import ---
  async function handleAddImport() {
    if (!importNaam.trim() || !importUrl.trim()) return;
    setIsSavingImport(true);
    const newImports = [...icalImports, { naam: importNaam.trim(), url: importUrl.trim() }];
    const supabase = createClient();
    const { error } = await supabase.from("calendars").update({ ical_import_urls: newImports }).eq("id", calendar.id);
    if (!error) {
      setIcalImports(newImports);
      setImportNaam("");
      setImportUrl("");
      setSyncResult(null);
    }
    setIsSavingImport(false);
  }

  async function handleDeleteImport(index: number) {
    const newImports = icalImports.filter((_, i) => i !== index);
    const supabase = createClient();
    const { error } = await supabase.from("calendars").update({ ical_import_urls: newImports }).eq("id", calendar.id);
    if (!error) {
      setIcalImports(newImports);
      setSyncResult(null);
    }
  }

  async function handleSync() {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/ical-import/${calendar.id}`, { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
      if (data.synced > 0) {
        const supabase = createClient();
        const { data: refreshed } = await supabase
          .from("bookings")
          .select("*")
          .eq("calendar_id", calendar.id)
          .order("start_datum", { ascending: true });
        if (refreshed) setBookings(refreshed);
      }
    } catch {
      setSyncResult({ synced: 0, errors: ["Verbindingsfout. Probeer het opnieuw."] });
    }
    setIsSyncing(false);
  }

  // --- Search / filter ---
  const zoekResultaten = useMemo(() => {
    if (!zoekQuery.trim()) return [];
    const q = zoekQuery.toLowerCase();
    return bookings.filter(b => b.gast_naam?.toLowerCase().includes(q));
  }, [zoekQuery, bookings]);

  // --- Upcoming bookings ---
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const komende = useMemo(() =>
    bookings
      .filter(b => b.eind_datum >= todayStr)
      .sort((a, b) => a.start_datum.localeCompare(b.start_datum)),
    [bookings, todayStr]
  );

  // --- Month range for display ---
  const months = useMemo(() => {
    return Array.from({ length: aantalMaanden }, (_, i) => addMonths(startDate, i));
  }, [startDate, aantalMaanden]);

  // --- Jaaroverzicht months ---
  const jaarMaanden = useMemo(() => {
    const jan = startOfMonth(new Date(new Date().getFullYear(), 0, 1));
    return Array.from({ length: 12 }, (_, i) => addMonths(jan, i));
  }, []);

  // --- Nights calculation helpers ---
  function calcNachten(startStr: string, eindStr: string): number {
    return Math.round(
      (new Date(eindStr).getTime() - new Date(startStr).getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // --- Render a single month block ---
  function renderMonth(month: Date) {
    const mStart = startOfMonth(month);
    const mEnd = endOfMonth(month);
    const weeks = eachWeekOfInterval(
      { start: mStart, end: mEnd },
      { weekStartsOn: 1 }
    );

    const monthLabel = format(month, "MMMM", { locale: nl });
    const yearLabel = format(month, "yyyy");
    const monthNumber = format(month, "MM");

    return (
      <div key={month.toISOString()} className="flex-1 min-w-0 bg-white border border-warm-100 rounded-2xl overflow-hidden">
        {/* Month header */}
        <div className="relative px-3 pt-3 pb-2 border-b border-warm-100 bg-warm-50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-warm-900 capitalize">{monthLabel}</span>
            <span className="text-xs text-warm-400">{yearLabel}</span>
          </div>
          <span className="absolute top-1 right-3 text-4xl font-black text-warm-100 select-none leading-none pointer-events-none">
            {monthNumber}
          </span>
        </div>

        {/* Day headers + week number column */}
        <div className="px-2 pt-2">
          <div className="grid grid-cols-[24px_repeat(7,1fr)] gap-x-0.5 mb-1">
            <div className="text-center text-[10px] text-warm-300 font-medium py-0.5">W</div>
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-warm-400 py-0.5">{d}</div>
            ))}
          </div>

          {/* Weeks */}
          <div className="space-y-0.5 pb-2">
            {weeks.map(weekStart => {
              const weekDays = eachDayOfInterval({
                start: weekStart,
                end: endOfWeek(weekStart, { weekStartsOn: 1 }),
              });
              const weekNum = getISOWeek(weekStart);

              return (
                <div key={weekStart.toISOString()} className="grid grid-cols-[24px_repeat(7,1fr)] gap-x-0.5">
                  {/* Week number */}
                  <div className="flex items-center justify-center text-[10px] text-warm-300 font-medium select-none">
                    {weekNum}
                  </div>

                  {/* Days */}
                  {weekDays.map(day => {
                    const isCurrentMonth = day.getMonth() === month.getMonth();
                    const dateStr = format(day, "yyyy-MM-dd");
                    const dayBookings = getBookingsForDay(dateStr);

                    const fullBookings = dayBookings.filter(
                      b => dateStr > b.start_datum && dateStr < b.eind_datum
                    );
                    const arrivalBookings = dayBookings.filter(b => dateStr === b.start_datum && dateStr !== b.eind_datum);
                    const departureBookings = dayBookings.filter(b => dateStr === b.eind_datum && dateStr !== b.start_datum);
                    const sameDayBookings = dayBookings.filter(b => dateStr === b.start_datum && dateStr === b.eind_datum);

                    const fullBooking = fullBookings[0] ?? sameDayBookings[0] ?? null;
                    const arrivalBooking = arrivalBookings[0] ?? null;
                    const departureBooking = departureBookings[0] ?? null;
                    const hasAnyBooking = dayBookings.length > 0;

                    // Pick the booking to associate with hover/click (prefer full, then arrival, then departure)
                    const primaryBooking = fullBooking ?? arrivalBooking ?? departureBooking ?? null;

                    const inSel = isInSelection(day);
                    const isTod = isToday(day);
                    const isPastDay = isPast(day) && !isToday(day);

                    const isHighlighted =
                      zoekQuery.trim().length > 0 &&
                      zoekResultaten.some(
                        b => dateStr >= b.start_datum && dateStr <= b.eind_datum
                      );

                    const cellStyle = isCurrentMonth
                      ? getDayCellStyle(dateStr, arrivalBooking, departureBooking, fullBooking)
                      : {};

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => isCurrentMonth && handleDayClick(day)}
                        onMouseEnter={e => {
                          handleDayHover(day);
                          if (isCurrentMonth && primaryBooking && !selecting) {
                            showTooltip(primaryBooking, e.currentTarget as HTMLElement);
                          }
                        }}
                        onMouseLeave={() => {
                          setHoverDate(null);
                          hideTooltipDelayed();
                        }}
                        className={[
                          "relative flex items-center justify-center rounded-md text-[11px] font-medium transition-all select-none",
                          "aspect-square",
                          isCurrentMonth ? "cursor-pointer" : "cursor-default",
                          !isCurrentMonth ? "text-warm-200 opacity-30" : "",
                          isCurrentMonth && !hasAnyBooking && !inSel ? "hover:bg-warm-50 text-warm-700" : "",
                          isCurrentMonth && !hasAnyBooking && inSel ? "bg-accent/15 text-accent" : "",
                          isCurrentMonth && hasAnyBooking && !arrivalBooking && !departureBooking ? "text-white" : "",
                          isCurrentMonth && hasAnyBooking && (arrivalBooking || departureBooking) ? "text-warm-800" : "",
                          isPastDay && isCurrentMonth ? "opacity-50" : "",
                          isHighlighted ? "ring-2 ring-accent ring-offset-1 rounded-md" : "",
                        ].filter(Boolean).join(" ")}
                        style={isCurrentMonth ? cellStyle : {}}
                      >
                        <span className={isTod && isCurrentMonth ? "relative z-10" : ""}>
                          {format(day, "d")}
                        </span>

                        {isTod && isCurrentMonth && (
                          <span
                            className="absolute inset-0.5 rounded-md border-2 border-accent pointer-events-none"
                            style={{ zIndex: 1 }}
                          />
                        )}

                        {isCurrentMonth && dayBookings.some(b => b.gast_naam && dateStr === b.start_datum) && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-70 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-warm-400 mb-5">
        <Link href="/dashboard" className="hover:text-warm-700 transition-colors">Dashboard</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-warm-700 font-medium">{calendar.naam}</span>
      </div>

      {/* Title + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${calendar.kleur}20` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={calendar.kleur} strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-warm-900">{calendar.naam}</h1>
            {calendar.woning_naam && <p className="text-xs text-warm-400">{calendar.woning_naam}</p>}
          </div>
        </div>
        <div className="flex bg-warm-50 rounded-xl p-1 gap-1 shrink-0">
          <button onClick={() => setActiveTab("kalender")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "kalender" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            Kalender
          </button>
          <button onClick={() => setActiveTab("embed")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "embed" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            Embed code
          </button>
          <button onClick={() => setActiveTab("ical")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "ical" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            Delen &amp; synchroniseren
          </button>
        </div>
      </div>

      {activeTab === "kalender" && (
        <>
          {/* Controls row 1 */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-warm-500 font-medium whitespace-nowrap">Kalender:</label>
              <select
                value={calendar.id}
                onChange={e => router.push(`/dashboard/kalender/${e.target.value}`)}
                className="border border-warm-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white text-warm-800 font-medium"
              >
                {allCalendars.map(c => (
                  <option key={c.id} value={c.id}>{c.naam}</option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setJaaroverzichtOpen(true)}
              className="flex items-center gap-1.5 border border-warm-200 text-warm-700 hover:bg-warm-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 9h18M8 2v4M16 2v4" />
              </svg>
              Jaaroverzicht
            </button>
          </div>

          {/* Controls row 2 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-warm-500 font-medium whitespace-nowrap">Aantal maanden:</label>
              <select
                value={aantalMaanden}
                onChange={e => setAantalMaanden(Number(e.target.value))}
                className="border border-warm-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white text-warm-800"
              >
                {AANTALMAANDEN_OPTIONS.map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? "maand" : "maanden"}</option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setZoekOpen(v => !v)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${zoekOpen ? "bg-accent-light border-accent text-accent" : "border-warm-200 text-warm-700 hover:bg-warm-50"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Zoek een huurder
            </button>
            <button
              onClick={() => {
                setSelecting(false);
                setSelectStart(new Date());
                setSelectEnd(new Date());
                setFormData(EMPTY_FORM);
                setModal("new");
              }}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Boeking toevoegen
            </button>
          </div>

          {/* Zoek bar */}
          {zoekOpen && (
            <div className="mb-4 bg-white border border-warm-200 rounded-xl p-3 shadow-sm">
              <input
                type="text"
                value={zoekQuery}
                onChange={e => setZoekQuery(e.target.value)}
                placeholder="Zoek op naam huurder..."
                className="w-full border border-warm-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                autoFocus
              />
              {zoekQuery.trim() && (
                <div className="mt-2 space-y-1">
                  {zoekResultaten.length === 0 ? (
                    <p className="text-sm text-warm-400 px-1">Geen huurders gevonden.</p>
                  ) : (
                    zoekResultaten.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          openEditModal(b);
                          setZoekOpen(false);
                          setZoekQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-warm-50 text-left transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_HEX[b.status] }} />
                        <span className="font-medium text-sm text-warm-800">{b.gast_naam}</span>
                        <span className="text-xs text-warm-400 ml-auto">
                          {format(parseISO(b.start_datum), "d MMM", { locale: nl })} t/m {format(parseISO(b.eind_datum), "d MMM yyyy", { locale: nl })}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selection hint */}
          {selecting && (
            <p className="text-sm text-accent bg-accent-light rounded-xl px-4 py-2 mb-4 text-center font-medium">
              Klik op de einddatum van de reservatie
            </p>
          )}

          {/* Navigation row */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setStartDate(d => subMonths(d, 12))}
              className="flex items-center gap-1 border border-warm-200 text-warm-600 hover:bg-warm-50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              12mnd
            </button>
            <button
              onClick={() => setStartDate(d => subMonths(d, 1))}
              className="flex items-center gap-1 border border-warm-200 text-warm-600 hover:bg-warm-50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              1mnd
            </button>
            <button
              onClick={() => setStartDate(startOfMonth(new Date()))}
              className="border border-warm-200 text-warm-700 hover:bg-warm-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              nu
            </button>
            <button
              onClick={() => setStartDate(d => addMonths(d, 1))}
              className="flex items-center gap-1 border border-warm-200 text-warm-600 hover:bg-warm-50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              1mnd
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <button
              onClick={() => setStartDate(d => addMonths(d, 12))}
              className="flex items-center gap-1 border border-warm-200 text-warm-600 hover:bg-warm-50 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              12mnd
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Multi-month calendar grid */}
          <div
            className={`grid gap-3 mb-4 ${
              aantalMaanden === 1
                ? "grid-cols-1 max-w-xs"
                : aantalMaanden === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : aantalMaanden === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : aantalMaanden === 4
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                : aantalMaanden === 5
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-5"
                : aantalMaanden === 6
                ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
                : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {months.map(m => renderMonth(m))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-warm-500 mb-6 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: STATUS_HEX.bezet }} />
              Bezet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: STATUS_HEX.optie }} />
              Optie
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: STATUS_HEX.geblokkeerd }} />
              Geblokkeerd
            </span>
            <span className="text-warm-400 ml-auto hidden sm:block">Klik op een datum om een reservatie toe te voegen</span>
          </div>

          {/* Upcoming bookings */}
          <div className="bg-white rounded-2xl border border-warm-100 shadow-sm">
            <div className="px-6 py-4 border-b border-warm-100">
              <h3 className="text-sm font-semibold text-warm-700">Komende reservaties</h3>
            </div>
            <div className="px-6 py-4">
              {komende.length === 0 ? (
                <p className="text-sm text-warm-400">Nog geen reservaties gepland.</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {(toonMeerReservaties ? komende : komende.slice(0, 10)).map(b => (
                      <div key={b.id} className="flex items-center gap-3 py-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_HEX[b.status] }} />
                        <span className="text-sm text-warm-700 font-medium min-w-[150px]">
                          {format(parseISO(b.start_datum), "d MMM", { locale: nl })} t/m {format(parseISO(b.eind_datum), "d MMM yyyy", { locale: nl })}
                        </span>
                        {b.gast_naam && <span className="text-sm text-warm-500 truncate">{b.gast_naam}</span>}
                        {b.bron && b.bron !== "import" && (
                          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${BRON_COLORS[b.bron] ?? "bg-warm-100 text-warm-600"}`}>
                            {BRON_LABELS[b.bron] ?? b.bron}
                          </span>
                        )}
                        <button
                          onClick={() => openEditModal(b)}
                          className={`${b.bron && b.bron !== "import" ? "" : "ml-auto"} text-xs text-warm-400 hover:text-accent transition-colors shrink-0`}
                        >
                          Bewerken
                        </button>
                      </div>
                    ))}
                  </div>
                  {komende.length > 10 && (
                    <button
                      onClick={() => setToonMeerReservaties(v => !v)}
                      className="mt-3 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                      {toonMeerReservaties ? "Minder tonen" : `Meer tonen (${komende.length - 10} overige)`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Herkomst statistieken */}
          {(() => {
            const echteBoekingen = bookings.filter(b => b.status !== "geblokkeerd");
            if (echteBoekingen.length === 0) return null;
            const totaal = echteBoekingen.length;
            const perBron: Record<string, number> = {};
            for (const b of echteBoekingen) {
              const key = b.bron ?? "onbekend";
              perBron[key] = (perBron[key] ?? 0) + 1;
            }
            const sorted = Object.entries(perBron).sort((a, b) => b[1] - a[1]);
            return (
              <div className="bg-white rounded-2xl border border-warm-100 shadow-sm mt-3 px-6 py-4">
                <h3 className="text-sm font-semibold text-warm-700 mb-3">Herkomst boekingen</h3>
                <div className="space-y-2.5">
                  {sorted.map(([bron, aantal]) => {
                    const pct = Math.round((aantal / totaal) * 100);
                    const label = bron === "onbekend" ? "Onbekend" : (BRON_LABELS[bron] ?? bron);
                    const barColor =
                      bron === "eigen_website" ? "bg-accent" :
                      bron === "vakantiewoningen_be" ? "bg-green-500" :
                      bron === "rechtstreeks" ? "bg-warm-500" :
                      bron === "import" ? "bg-warm-300" : "bg-warm-200";
                    return (
                      <div key={bron}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-warm-700 font-medium">{label}</span>
                          <span className="text-warm-400">{aantal} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {activeTab === "embed" && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-warm-900 mb-2">Embed op je website</h2>
          <p className="text-warm-500 text-sm mb-6">
            Kopieer de onderstaande code en plak deze op je website waar je de kalender wil tonen.
            Bezoekers zien enkel bezet/vrij, geen gastgegevens.
          </p>
          <div className="bg-warm-900 rounded-xl p-4 mb-4 relative">
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed">
              {embedCode}
            </pre>
            <button
              onClick={copyEmbed}
              className="absolute top-3 right-3 bg-warm-700 hover:bg-warm-600 text-warm-200 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Gekopieerd</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Kopiëren</>
              )}
            </button>
          </div>
          <div className="bg-accent-light border border-warm-200 rounded-xl p-4 text-sm text-warm-700">
            <strong>Hoe installeren?</strong> Plak de code in je website-editor, net voor de sluitende &lt;/body&gt;-tag.
            Werkt op WordPress, Wix, Squarespace en elke andere website.
          </div>
        </div>
      )}

      {activeTab === "ical" && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 space-y-8">

          <div>
            <h2 className="text-lg font-semibold text-warm-900 mb-1">Beschikbaarheid delen</h2>
            <p className="text-warm-500 text-sm mb-4">
              Deel deze link met gasten of eigenaren om je beschikbaarheid te tonen.
            </p>
            <div className="bg-warm-900 rounded-xl p-4 mb-3 relative">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed pr-24">
                {beschikbaarheidUrl}
              </pre>
              <button
                onClick={copyBeschikbaarheid}
                className="absolute top-3 right-3 bg-warm-700 hover:bg-warm-600 text-warm-200 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedBeschikbaarheid ? (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Gekopieerd</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Kopiëren</>
                )}
              </button>
            </div>
            <a
              href={beschikbaarheidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              Pagina bekijken
            </a>
          </div>

          <div className="border-t border-warm-100" />

          <div>
            <h2 className="text-lg font-semibold text-warm-900 mb-1">iCal exporteren</h2>
            <p className="text-warm-500 text-sm mb-4">
              Gebruik deze link om jouw kalender te synchroniseren met Google Agenda, Outlook, Apple Kalender of andere boekingssystemen. Elke wijziging in je kalender wordt automatisch doorgegeven.
            </p>
            <div className="bg-warm-900 rounded-xl p-4 mb-4 relative">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed pr-24">
                {icalUrl}
              </pre>
              <button
                onClick={copyIcal}
                className="absolute top-3 right-3 bg-warm-700 hover:bg-warm-600 text-warm-200 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedIcal ? (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Gekopieerd</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Kopiëren</>
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Google Agenda", hint: "Andere agenda's > Via URL" },
                { name: "Outlook", hint: "Agenda toevoegen > Via internet" },
                { name: "Apple Kalender", hint: "Archief > Abonneren..." },
              ].map(({ name, hint }) => (
                <div key={name} className="bg-warm-50 border border-warm-100 rounded-xl p-3 text-xs text-warm-600">
                  <p className="font-semibold text-warm-800 mb-0.5">{name}</p>
                  <p className="text-warm-400">{hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-warm-100" />

          <div>
            <h2 className="text-lg font-semibold text-warm-900 mb-1">Externe kalenders importeren</h2>
            <p className="text-warm-500 text-sm mb-5">
              Voeg iCal-links toe van Airbnb, Booking.com of andere platforms. Geïmporteerde periodes worden als geblokkeerd gemarkeerd in je kalender.
            </p>

            {icalImports.length > 0 && (
              <div className="space-y-2 mb-5">
                {icalImports.map((imp, index) => (
                  <div key={index} className="flex items-center gap-3 bg-warm-50 border border-warm-100 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-800 truncate">{imp.naam}</p>
                      <p className="text-xs text-warm-400 truncate">{imp.url}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteImport(index)}
                      className="shrink-0 text-warm-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                      aria-label={`${imp.naam} verwijderen`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              <p className="w-full text-xs text-warm-400 mb-1">Snel toevoegen:</p>
              {[
                { naam: "Airbnb", kleur: "bg-[#FF5A5F]/10 text-[#FF5A5F] border-[#FF5A5F]/20 hover:bg-[#FF5A5F]/20" },
                { naam: "Booking.com", kleur: "bg-[#003580]/10 text-[#003580] border-[#003580]/20 hover:bg-[#003580]/20" },
                { naam: "Tripadvisor", kleur: "bg-[#34E0A1]/20 text-green-700 border-green-200 hover:bg-[#34E0A1]/30" },
                { naam: "Micazu", kleur: "bg-[#0077C8]/10 text-[#0077C8] border-[#0077C8]/20 hover:bg-[#0077C8]/20" },
                { naam: "vakantiewoningen-in-belgie.be", kleur: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" },
              ].map(p => (
                <button key={p.naam} onClick={() => setImportNaam(p.naam)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${p.kleur}`}>
                  {p.naam}
                </button>
              ))}
            </div>

            <div className="bg-warm-50 border border-warm-100 rounded-xl p-4 mb-5">
              <p className="text-sm font-medium text-warm-700 mb-3">URL toevoegen</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={importNaam}
                  onChange={e => setImportNaam(e.target.value)}
                  placeholder="Naam (bijv. Airbnb)"
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                />
                <input
                  type="url"
                  value={importUrl}
                  onChange={e => setImportUrl(e.target.value)}
                  placeholder="https://www.airbnb.be/calendar/ical/..."
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                />
              </div>
              <button
                onClick={handleAddImport}
                disabled={isSavingImport || !importNaam.trim() || !importUrl.trim()}
                className="bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingImport ? "Opslaan..." : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Toevoegen</>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={handleSync}
                disabled={isSyncing || icalImports.length === 0}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Synchroniseren...</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>Nu synchroniseren</>
                )}
              </button>
              {syncResult && (
                <div className={`text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 ${syncResult.errors.length > 0 ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
                  {syncResult.errors.length === 0 ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>{syncResult.synced} {syncResult.synced === 1 ? "boeking" : "boekingen"} gesynchroniseerd</>
                  ) : (
                    <span>{syncResult.synced > 0 && `${syncResult.synced} gesynchroniseerd. `}Fouten: {syncResult.errors.join(", ")}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-warm-100" />

          <div>
            <h2 className="text-lg font-semibold text-warm-900 mb-1">Boekingen importeren vanuit CSV</h2>
            <p className="text-warm-500 text-sm mb-4">
              Gebruik je huurkalender.nl? Importeer je bestaande boekingen in één klik via het CSV-exportbestand.
            </p>
            <Link
              href={`/dashboard/kalender/${calendar.id}/importeer`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Boekingen importeren
            </Link>
          </div>
        </div>
      )}

      {/* ============================================================
          TOOLTIP — floating on hover over booked day cell
          ============================================================ */}
      {hoveredTooltip && (
        <div
          className="fixed z-[60] pointer-events-auto"
          style={{
            top: hoveredTooltip.above
              ? `${hoveredTooltip.top}px`
              : `${hoveredTooltip.top}px`,
            left: `${hoveredTooltip.left}px`,
            transform: hoveredTooltip.above
              ? "translate(-50%, -100%)"
              : "translate(-50%, 0)",
          }}
          onMouseEnter={() => {
            if (tooltipHideTimer.current) {
              clearTimeout(tooltipHideTimer.current);
              tooltipHideTimer.current = null;
            }
          }}
          onMouseLeave={hideTooltipDelayed}
        >
          <div className="bg-white rounded-xl shadow-xl border border-warm-100 p-3 min-w-[200px] max-w-[260px]">
            {/* Guest name */}
            <p className="font-semibold text-sm text-warm-900 mb-0.5 truncate">
              {hoveredTooltip.booking.gast_naam || "Geen naam"}
            </p>
            {/* Date range */}
            <p className="text-xs text-warm-400 mb-2">
              {format(parseISO(hoveredTooltip.booking.start_datum), "EEE dd-MM", { locale: nl })} / {format(parseISO(hoveredTooltip.booking.eind_datum), "EEE dd-MM", { locale: nl })}
            </p>
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${STATUS_COLORS[hoveredTooltip.booking.status].bg} ${STATUS_COLORS[hoveredTooltip.booking.status].text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[hoveredTooltip.booking.status].dot}`} />
              {STATUS_LABELS[hoveredTooltip.booking.status]}
            </span>
            {/* Actions */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleDeleteFromTooltip(hoveredTooltip.booking)}
                className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Verwijder
              </button>
              <button
                onClick={() => {
                  openEditModal(hoveredTooltip.booking);
                  setHoveredTooltip(null);
                }}
                className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-warm-200 text-warm-700 hover:bg-warm-50 transition-colors"
              >
                Bekijk
              </button>
              <button
                onClick={() => {
                  openEditModal(hoveredTooltip.booking);
                  setHoveredTooltip(null);
                }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                Wijzig
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: nieuwe reservatie (extended)
          ============================================================ */}
      {modal === "new" && selectStart && selectEnd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6" onClick={cancelModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-warm-100">
              <div>
                <h3 className="text-lg font-bold text-warm-900">Reservatie toevoegen</h3>
                <p className="text-sm text-warm-400 mt-0.5">
                  {format(selectStart, "d MMMM", { locale: nl })} t/m {format(selectEnd, "d MMMM yyyy", { locale: nl })}
                  {" · "}
                  {Math.round((selectEnd.getTime() - selectStart.getTime()) / (1000 * 60 * 60 * 24))} nachten
                </p>
              </div>
              <button onClick={cancelModal} className="w-8 h-8 rounded-lg hover:bg-warm-100 flex items-center justify-center text-warm-400 transition-colors shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-warm-100">
              {/* Left column */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide">Boeking</p>

                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Gastnaam</label>
                  <input
                    type="text"
                    value={formData.gastNaam}
                    onChange={e => setFormData(f => ({ ...f, gastNaam: e.target.value }))}
                    placeholder="Jan Janssen"
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    autoFocus
                  />
                </div>

                {/* Check-in/uit tijden */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Aankomst</label>
                    <input
                      type="time"
                      value={formData.checkInTijd}
                      onChange={e => setFormData(f => ({ ...f, checkInTijd: e.target.value }))}
                      className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Vertrek</label>
                    <input
                      type="time"
                      value={formData.checkUitTijd}
                      onChange={e => setFormData(f => ({ ...f, checkUitTijd: e.target.value }))}
                      className="w-full border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {(Object.keys(STATUS_LABELS) as BookingStatus[]).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, status: s }))}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.status === s
                            ? `${STATUS_COLORS[s].bg} ${STATUS_COLORS[s].text}`
                            : "bg-warm-50 text-warm-500 hover:bg-warm-100"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bron */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Herkomst</label>
                  <select
                    value={formData.bron}
                    onChange={e => setFormData(f => ({ ...f, bron: e.target.value }))}
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                  >
                    {BRON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Prijzen */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Totaalprijs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.prijsTotaal}
                        onChange={e => setFormData(f => ({ ...f, prijsTotaal: e.target.value }))}
                        placeholder="—"
                        className="w-full border border-warm-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Prijs/nacht</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.facturatiePrijs}
                        onChange={e => setFormData(f => ({ ...f, facturatiePrijs: e.target.value }))}
                        placeholder="—"
                        className="w-full border border-warm-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notities */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Aantekeningen</label>
                  <textarea
                    value={formData.notities}
                    onChange={e => setFormData(f => ({ ...f, notities: e.target.value }))}
                    rows={2}
                    placeholder="Zichtbaar voor de gast..."
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.notitiesVerborgen}
                      onChange={e => setFormData(f => ({ ...f, notitiesVerborgen: e.target.checked }))}
                      className="w-4 h-4 rounded border-warm-300 accent-accent"
                    />
                    <span className="text-xs text-warm-500 group-hover:text-warm-700 transition-colors">Aantekeningen verborgen in de PDF</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Privé aantekeningen</label>
                  <textarea
                    value={formData.priveNotities}
                    onChange={e => setFormData(f => ({ ...f, priveNotities: e.target.value }))}
                    rows={2}
                    placeholder="Enkel voor jou, niet voor de gast..."
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
                  />
                </div>
              </div>

              {/* Right column — Contactgegevens */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide">Contactgegevens</p>

                {/* Taal */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Taal</label>
                  <select
                    value={formData.taal}
                    onChange={e => setFormData(f => ({ ...f, taal: e.target.value }))}
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                  >
                    <option value="">Niet opgegeven</option>
                    {TAAL_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={formData.gastEmail}
                    onChange={e => setFormData(f => ({ ...f, gastEmail: e.target.value }))}
                    placeholder="jan@voorbeeld.be"
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>

                {/* Telefoon */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Telefoon</label>
                  <input
                    type="tel"
                    value={formData.gastTelefoon}
                    onChange={e => setFormData(f => ({ ...f, gastTelefoon: e.target.value }))}
                    placeholder="+32 470 00 00 00"
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>

                {/* Personen */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Volwassenen</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.aantalVolwassenen}
                      onChange={e => setFormData(f => ({ ...f, aantalVolwassenen: e.target.value }))}
                      placeholder="—"
                      className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Kinderen</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.aantalKinderen}
                      onChange={e => setFormData(f => ({ ...f, aantalKinderen: e.target.value }))}
                      placeholder="—"
                      className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                </div>

                {/* Adresgegevens toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setContactInfoOpen(v => !v)}
                    className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                  >
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`transition-transform ${contactInfoOpen ? "rotate-90" : ""}`}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    Meer contactinfo
                  </button>
                  {contactInfoOpen && (
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        value={formData.gastAdres}
                        onChange={e => setFormData(f => ({ ...f, gastAdres: e.target.value }))}
                        placeholder="Adres"
                        className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.gastPostcode}
                          onChange={e => setFormData(f => ({ ...f, gastPostcode: e.target.value }))}
                          placeholder="Postcode"
                          className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                        />
                        <input
                          type="text"
                          value={formData.gastGemeente}
                          onChange={e => setFormData(f => ({ ...f, gastGemeente: e.target.value }))}
                          placeholder="Gemeente"
                          className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.gastLand}
                        onChange={e => setFormData(f => ({ ...f, gastLand: e.target.value }))}
                        placeholder="Land"
                        className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-warm-100">
              <button onClick={cancelModal} className="flex-1 py-2.5 border border-warm-200 text-warm-700 font-medium rounded-xl text-sm hover:bg-warm-50 transition-colors">
                Annuleren
              </button>
              <button onClick={handleSaveNew} disabled={saving} className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: reservatie bewerken (huurkalender.nl style, two-column)
          ============================================================ */}
      {modal === "edit" && editingBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6" onClick={cancelModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-warm-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-warm-900">
                    Boeking #{formData.boekingNummerExtern || editingBooking.id.slice(0, 8).toUpperCase()}
                  </h3>
                  {editingBooking.bron && editingBooking.bron !== "import" && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BRON_COLORS[editingBooking.bron] ?? "bg-warm-100 text-warm-600"}`}>
                      {BRON_LABELS[editingBooking.bron] ?? editingBooking.bron}
                    </span>
                  )}
                </div>
                <p className="text-sm text-warm-400">{calendar.naam}</p>
              </div>
              <button onClick={cancelModal} className="w-8 h-8 rounded-lg hover:bg-warm-100 flex items-center justify-center text-warm-400 transition-colors shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-warm-100">
              {/* ---- LEFT COLUMN ---- */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide">Boeking</p>

                {/* Gast naam */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Gastnaam</label>
                  <input
                    type="text"
                    value={formData.gastNaam}
                    onChange={e => setFormData(f => ({ ...f, gastNaam: e.target.value }))}
                    placeholder="Jan Janssen"
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    autoFocus
                  />
                </div>

                {/* Aankomst & vertrek datums + tijden */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Aankomst</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-warm-700 bg-warm-50 border border-warm-200 rounded-xl px-3 py-2.5 flex-1 font-medium">
                      {format(parseISO(editingBooking.start_datum), "EEE d MMMM yyyy", { locale: nl })}
                    </span>
                    <input
                      type="time"
                      value={formData.checkInTijd}
                      onChange={e => setFormData(f => ({ ...f, checkInTijd: e.target.value }))}
                      className="w-28 border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                  {formData.checkInTijd === "12:00" && (
                    <p className="text-xs text-warm-400 mt-1">halve dag</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Vertrek</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-warm-700 bg-warm-50 border border-warm-200 rounded-xl px-3 py-2.5 flex-1 font-medium">
                      {format(parseISO(editingBooking.eind_datum), "EEE d MMMM yyyy", { locale: nl })}
                    </span>
                    <input
                      type="time"
                      value={formData.checkUitTijd}
                      onChange={e => setFormData(f => ({ ...f, checkUitTijd: e.target.value }))}
                      className="w-28 border border-warm-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                </div>

                {/* Nachten */}
                <div className="flex items-center justify-between py-2 border-t border-b border-warm-100">
                  <span className="text-sm text-warm-500">Aantal nachten</span>
                  <span className="text-sm font-semibold text-warm-800">
                    {calcNachten(editingBooking.start_datum, editingBooking.eind_datum)}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {(Object.keys(STATUS_LABELS) as BookingStatus[]).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, status: s }))}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          formData.status === s
                            ? `${STATUS_COLORS[s].bg} ${STATUS_COLORS[s].text}`
                            : "bg-warm-50 text-warm-500 hover:bg-warm-100"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bron dropdown */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Herkomst</label>
                  <select
                    value={formData.bron}
                    onChange={e => setFormData(f => ({ ...f, bron: e.target.value }))}
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                  >
                    {BRON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Prijzen */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Totaalprijs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.prijsTotaal}
                        onChange={e => setFormData(f => ({ ...f, prijsTotaal: e.target.value }))}
                        placeholder="—"
                        className="w-full border border-warm-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Prijs/nacht</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.facturatiePrijs}
                        onChange={e => setFormData(f => ({ ...f, facturatiePrijs: e.target.value }))}
                        placeholder="—"
                        className="w-full border border-warm-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notities */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Aantekeningen</label>
                  <textarea
                    value={formData.notities}
                    onChange={e => setFormData(f => ({ ...f, notities: e.target.value }))}
                    rows={3}
                    placeholder="Zichtbaar op de boekingsbevestiging voor de gast..."
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.notitiesVerborgen}
                      onChange={e => setFormData(f => ({ ...f, notitiesVerborgen: e.target.checked }))}
                      className="w-4 h-4 rounded border-warm-300 accent-accent"
                    />
                    <span className="text-xs text-warm-500 group-hover:text-warm-700 transition-colors">Aantekeningen verborgen in de PDF</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Privé aantekeningen</label>
                  <textarea
                    value={formData.priveNotities}
                    onChange={e => setFormData(f => ({ ...f, priveNotities: e.target.value }))}
                    rows={2}
                    placeholder="Enkel zichtbaar voor jou, niet voor de gast..."
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
                  />
                </div>
              </div>

              {/* ---- RIGHT COLUMN — Contactgegevens ---- */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide">Contactgegevens</p>

                {/* Gast naam (read-only label) */}
                {formData.gastNaam && (
                  <p className="text-base font-semibold text-warm-900">{formData.gastNaam}</p>
                )}

                {/* Taal */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Taal</label>
                  <select
                    value={formData.taal}
                    onChange={e => setFormData(f => ({ ...f, taal: e.target.value }))}
                    className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none bg-white"
                  >
                    <option value="">Niet opgegeven</option>
                    {TAAL_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Bekijk vorige boekingen */}
                {editingBooking.gast_email && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelModal();
                      setZoekQuery(editingBooking.gast_email || "");
                      setZoekOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-warm-200 text-warm-700 hover:bg-warm-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Bekijk vorige boekingen
                  </button>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">E-mail</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={formData.gastEmail}
                      onChange={e => setFormData(f => ({ ...f, gastEmail: e.target.value }))}
                      placeholder="jan@voorbeeld.be"
                      className="flex-1 border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                    {formData.gastEmail && (
                      <a
                        href={`mailto:${formData.gastEmail}`}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-warm-200 text-accent hover:bg-accent-light transition-colors shrink-0"
                        title="Stuur e-mail"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Telefoon */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Telefoon</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={formData.gastTelefoon}
                      onChange={e => setFormData(f => ({ ...f, gastTelefoon: e.target.value }))}
                      placeholder="+32 470 00 00 00"
                      className="flex-1 border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                    {formData.gastTelefoon && (
                      <a
                        href={`tel:${formData.gastTelefoon}`}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-warm-200 text-accent hover:bg-accent-light transition-colors shrink-0"
                        title="Bel op"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.58 4.4 2 2 0 0 1 3.55 2.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.85-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Personen */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Volwassenen</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.aantalVolwassenen}
                      onChange={e => setFormData(f => ({ ...f, aantalVolwassenen: e.target.value }))}
                      placeholder="—"
                      className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">Kinderen</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.aantalKinderen}
                      onChange={e => setFormData(f => ({ ...f, aantalKinderen: e.target.value }))}
                      placeholder="—"
                      className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                    />
                  </div>
                </div>

                {/* Adres toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setContactInfoOpen(v => !v)}
                    className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                  >
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`transition-transform ${contactInfoOpen ? "rotate-90" : ""}`}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    Meer contactinfo
                  </button>
                  {contactInfoOpen && (
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        value={formData.gastAdres}
                        onChange={e => setFormData(f => ({ ...f, gastAdres: e.target.value }))}
                        placeholder="Adres"
                        className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.gastPostcode}
                          onChange={e => setFormData(f => ({ ...f, gastPostcode: e.target.value }))}
                          placeholder="Postcode"
                          className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                        />
                        <input
                          type="text"
                          value={formData.gastGemeente}
                          onChange={e => setFormData(f => ({ ...f, gastGemeente: e.target.value }))}
                          placeholder="Gemeente"
                          className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.gastLand}
                        onChange={e => setFormData(f => ({ ...f, gastLand: e.target.value }))}
                        placeholder="Land"
                        className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-warm-100">
              <button onClick={handleDelete} disabled={saving} className="py-2.5 px-4 border border-red-200 text-red-600 font-medium rounded-xl text-sm hover:bg-red-50 transition-colors disabled:opacity-60">
                Verwijderen
              </button>
              <button onClick={cancelModal} className="flex-1 py-2.5 border border-warm-200 text-warm-700 font-medium rounded-xl text-sm hover:bg-warm-50 transition-colors">
                Annuleren
              </button>
              <button onClick={handleSaveEdit} disabled={saving} className="flex-1 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jaaroverzicht modal */}
      {jaaroverzichtOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto" onClick={() => setJaaroverzichtOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 print:hidden">
              <h2 className="text-xl font-bold text-warm-900">Jaaroverzicht {new Date().getFullYear()}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Afdrukken
                </button>
                <button
                  onClick={() => setJaaroverzichtOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-warm-100 flex items-center justify-center text-warm-500 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {jaarMaanden.map(m => renderMonth(m))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
