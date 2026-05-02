"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { nl } from "date-fns/locale";

interface PublicBooking {
  start_datum: string;
  eind_datum: string;
  status: "bezet" | "optie" | "geblokkeerd";
}

interface Props {
  kalenderNaam: string;
  woningNaam: string | null;
  kleur: string;
  bookings: PublicBooking[];
}

const STATUS_BG: Record<"bezet" | "optie" | "geblokkeerd", string> = {
  bezet: "#fde5e2",
  optie: "#fef3c7",
  geblokkeerd: "",
};
const STATUS_COLOR: Record<"bezet" | "optie" | "geblokkeerd", string> = {
  bezet: "#b94a3a",
  optie: "#92400e",
  geblokkeerd: "",
};

export default function EmbedClient({ kalenderNaam, woningNaam, kleur, bookings }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  function getStatusForDay(date: Date): "bezet" | "optie" | "geblokkeerd" | null {
    const dateStr = format(date, "yyyy-MM-dd");
    const match = bookings.find(b => dateStr >= b.start_datum && dateStr <= b.eind_datum);
    return match?.status ?? null;
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7;

  return (
    <div className="font-sans p-4 max-w-sm mx-auto">
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-warm-100 flex items-center justify-between" style={{ borderTopColor: kleur, borderTopWidth: "3px" }}>
          <div>
            <div className="font-semibold text-warm-900 text-sm">{kalenderNaam}</div>
            {woningNaam && <div className="text-xs text-warm-400">{woningNaam}</div>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="w-7 h-7 rounded-lg hover:bg-warm-50 flex items-center justify-center text-warm-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-xs font-medium text-warm-700 w-28 text-center capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: nl })}
            </span>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="w-7 h-7 rounded-lg hover:bg-warm-50 flex items-center justify-center text-warm-400 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-3">
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map(d => (
              <div key={d} className="text-center text-xs text-warm-300 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {[...Array(startPad)].map((_, i) => <div key={`p${i}`} />)}
            {days.map(day => {
              const status = getStatusForDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className="text-center py-1.5 rounded-lg text-xs font-medium"
                  style={status && STATUS_BG[status] ? { backgroundColor: STATUS_BG[status], color: STATUS_COLOR[status] } : { color: "var(--warm-600, #5c5040)" }}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-3 mt-3 pt-3 border-t border-warm-50 text-xs text-warm-400 justify-center">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block" style={{ backgroundColor: "#fde5e2" }} />Bezet</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block" style={{ backgroundColor: "#fef3c7" }} />Optie</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded inline-block bg-warm-50 border border-warm-100" />Vrij</span>
          </div>
        </div>

        {/* Branding */}
        <div className="border-t border-warm-50 px-4 py-2 text-center">
          <a href="https://www.verhuurplanner.be" target="_blank" rel="noopener noreferrer" className="text-xs text-warm-300 hover:text-accent transition-colors">
            verhuurplanner.be
          </a>
        </div>
      </div>
    </div>
  );
}
