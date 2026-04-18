import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from "date-fns";
import { nl } from "date-fns/locale";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createAdminClient();
  const { data: calendar } = await supabase
    .from("calendars")
    .select("naam, woning_naam")
    .eq("public_token", token)
    .single();

  if (!calendar) {
    return { title: "Kalender niet gevonden" };
  }

  const title = `${calendar.woning_naam || calendar.naam} — Beschikbaarheid`;
  return {
    title,
    description: `Bekijk de beschikbaarheid van ${calendar.woning_naam || calendar.naam}. Controleer welke periodes vrij zijn en plan je verblijf.`,
    robots: { index: false, follow: false },
  };
}

interface PublicBooking {
  start_datum: string;
  eind_datum: string;
  status: "bezet" | "optie" | "geblokkeerd";
}

function getStatusForDay(date: Date, bookings: PublicBooking[]): "bezet" | "optie" | "geblokkeerd" | null {
  const dateStr = format(date, "yyyy-MM-dd");
  const match = bookings.find(b => dateStr >= b.start_datum && dateStr <= b.eind_datum);
  return match?.status ?? null;
}

const STATUS_STYLE: Record<"bezet" | "optie" | "geblokkeerd", string> = {
  bezet: "bg-red-100 text-red-700",
  optie: "bg-amber-100 text-amber-700",
  geblokkeerd: "bg-warm-100 text-warm-500",
};

function MonthGrid({ month, bookings }: { month: Date; bookings: PublicBooking[] }) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7;

  return (
    <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-warm-100">
        <h2 className="font-semibold text-warm-900 capitalize text-center">
          {format(month, "MMMM yyyy", { locale: nl })}
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map(d => (
            <div key={d} className="text-center text-xs font-medium text-warm-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {[...Array(startPad)].map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const status = getStatusForDay(day, bookings);
            return (
              <div
                key={day.toISOString()}
                className={`text-center py-2 rounded-lg text-sm font-medium ${
                  status ? STATUS_STYLE[status] : "text-warm-700"
                }`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function BeschikbaarheidPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createAdminClient();

  const { data: calendar } = await supabase
    .from("calendars")
    .select("id, naam, woning_naam, kleur")
    .eq("public_token", token)
    .single();

  if (!calendar) notFound();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("start_datum, eind_datum, status")
    .eq("calendar_id", calendar.id);

  const publicBookings: PublicBooking[] = (bookings || []).map(b => ({
    start_datum: b.start_datum,
    eind_datum: b.eind_datum,
    status: b.status as "bezet" | "optie" | "geblokkeerd",
  }));

  const today = new Date();
  const months = [today, addMonths(today, 1), addMonths(today, 2)];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <header className="bg-white border-b border-warm-100">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${calendar.kleur}20` }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={calendar.kleur} strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-warm-900 truncate">
              {calendar.woning_naam || calendar.naam}
            </h1>
            {calendar.woning_naam && (
              <p className="text-sm text-warm-400 truncate">{calendar.naam}</p>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-warm-600">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
            Bezet
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 inline-block" />
            Optie
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-warm-100 border border-warm-200 inline-block" />
            Geblokkeerd
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-white border border-warm-200 inline-block" />
            Vrij
          </span>
        </div>

        {/* Three-month grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {months.map(month => (
            <MonthGrid key={month.toISOString()} month={month} bookings={publicBookings} />
          ))}
        </div>

        <p className="text-xs text-warm-400 text-center mt-6">
          Beschikbaarheid bijgewerkt op {format(today, "d MMMM yyyy", { locale: nl })}.
          Neem contact op met de verhuurder voor de meest recente informatie.
        </p>
      </main>

      {/* Branding footer */}
      <footer className="border-t border-warm-100 bg-white mt-8">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <a
            href="https://www.verhuurplanner.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-warm-400 hover:text-accent transition-colors"
          >
            Kalender beheerd via verhuurplanner.be
          </a>
        </div>
      </footer>
    </div>
  );
}
