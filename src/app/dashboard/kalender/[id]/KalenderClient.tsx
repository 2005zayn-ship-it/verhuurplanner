"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isWithinInterval, parseISO, addMonths, subMonths, isBefore, isAfter } from "date-fns";
import { nl } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Booking, BookingStatus } from "@/lib/types";

interface Props {
  calendar: Calendar;
  initialBookings: Booking[];
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  bezet: "Bezet",
  optie: "Optie",
  geblokkeerd: "Geblokkeerd",
};

const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  bezet: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  optie: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  geblokkeerd: { bg: "bg-warm-100", text: "text-warm-500", dot: "bg-warm-400" },
};

export default function KalenderClient({ calendar, initialBookings }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({ gastNaam: "", status: "bezet" as BookingStatus, notities: "" });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"kalender" | "embed" | "ical">("kalender");
  const [copied, setCopied] = useState(false);
  const [copiedIcal, setCopiedIcal] = useState(false);

  const embedCode = `<script src="https://www.verhuurplanner.be/embed/${calendar.public_token}.js" async></script>
<div id="verhuurplanner-${calendar.public_token}"></div>`;

  const icalUrl = `https://www.verhuurplanner.be/api/ical/${calendar.public_token}.ics`;

  function getBookingsForDay(date: Date): Booking[] {
    const dateStr = format(date, "yyyy-MM-dd");
    return bookings.filter(b => dateStr >= b.start_datum && dateStr <= b.eind_datum);
  }

  function handleDayClick(date: Date) {
    const dayBookings = getBookingsForDay(date);
    if (dayBookings.length > 0) {
      setEditingBooking(dayBookings[0]);
      setFormData({ gastNaam: dayBookings[0].gast_naam || "", status: dayBookings[0].status, notities: dayBookings[0].notities || "" });
      setModal("edit");
      return;
    }
    if (!selecting) {
      setSelectStart(date);
      setSelectEnd(date);
      setSelecting(true);
    } else {
      const start = selectStart!;
      const end = isBefore(date, start) ? start : date;
      const actualStart = isBefore(date, start) ? date : start;
      setSelectStart(actualStart);
      setSelectEnd(end);
      setSelecting(false);
      setFormData({ gastNaam: "", status: "bezet", notities: "" });
      setModal("new");
    }
  }

  function handleDayHover(date: Date) {
    if (selecting && selectStart) {
      setSelectEnd(isBefore(date, selectStart) ? selectStart : date);
    }
  }

  function isInSelection(date: Date): boolean {
    if (!selectStart || !selectEnd) return false;
    return isWithinInterval(date, { start: selectStart, end: selectEnd });
  }

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
        status: formData.status,
        notities: formData.notities || null,
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
      .update({ gast_naam: formData.gastNaam || null, status: formData.status, notities: formData.notities || null })
      .eq("id", editingBooking.id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === editingBooking.id
        ? { ...b, gast_naam: formData.gastNaam || null, status: formData.status, notities: formData.notities || null }
        : b
      ));
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
  }

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyIcal() {
    navigator.clipboard.writeText(icalUrl);
    setCopiedIcal(true);
    setTimeout(() => setCopiedIcal(false), 2000);
  }

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7; // Monday-based

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-warm-500 mb-6">
        <Link href="/dashboard" className="hover:text-warm-900 transition-colors">Dashboard</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        <span className="text-warm-900 font-medium">{calendar.naam}</span>
      </div>

      {/* Title + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${calendar.kleur}20` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={calendar.kleur} strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-warm-900">{calendar.naam}</h1>
            {calendar.woning_naam && <p className="text-sm text-warm-400">{calendar.woning_naam}</p>}
          </div>
        </div>
        <div className="flex bg-warm-50 rounded-xl p-1 gap-1">
          <button onClick={() => setActiveTab("kalender")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "kalender" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            Kalender
          </button>
          <button onClick={() => setActiveTab("embed")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "embed" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            Embed code
          </button>
          <button onClick={() => setActiveTab("ical")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "ical" ? "bg-white text-warm-900 shadow-sm" : "text-warm-500 hover:text-warm-700"}`}>
            iCal URL
          </button>
        </div>
      </div>

      {activeTab === "kalender" && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-warm-100">
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="w-9 h-9 rounded-xl hover:bg-warm-50 flex items-center justify-center text-warm-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <h2 className="font-semibold text-warm-900 capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: nl })}
            </h2>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="w-9 h-9 rounded-xl hover:bg-warm-50 flex items-center justify-center text-warm-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          <div className="p-4 sm:p-6">
            {selecting && (
              <p className="text-sm text-accent bg-accent-light rounded-xl px-4 py-2.5 mb-4 text-center font-medium">
                Klik op de einddatum van de reservatie
              </p>
            )}

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map(d => (
                <div key={d} className="text-center text-xs font-medium text-warm-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {[...Array(startPad)].map((_, i) => <div key={`pad-${i}`} />)}
              {days.map(day => {
                const dayBookings = getBookingsForDay(day);
                const booking = dayBookings[0];
                const inSel = isInSelection(day);
                const isStart = selectStart && format(day, "yyyy-MM-dd") === format(selectStart, "yyyy-MM-dd");

                let cellClass = "relative py-2 sm:py-3 rounded-xl text-center text-sm cursor-pointer select-none transition-colors ";
                if (booking) {
                  cellClass += `${STATUS_COLORS[booking.status].bg} ${STATUS_COLORS[booking.status].text} font-medium`;
                } else if (inSel) {
                  cellClass += "bg-accent/15 text-accent font-medium";
                } else {
                  cellClass += "text-warm-700 hover:bg-warm-50";
                }

                return (
                  <div
                    key={day.toISOString()}
                    className={cellClass}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => handleDayHover(day)}
                  >
                    {format(day, "d")}
                    {booking?.gast_naam && (
                      <div className="absolute bottom-0.5 left-0 right-0 flex justify-center">
                        <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-warm-50 text-xs text-warm-500">
              {(Object.entries(STATUS_LABELS) as [BookingStatus, string][]).map(([s, label]) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded ${STATUS_COLORS[s].bg} inline-block`} />
                  {label}
                </span>
              ))}
              <span className="text-warm-400 ml-auto hidden sm:block">Klik op een datum om een reservatie toe te voegen</span>
            </div>
          </div>

          {/* Upcoming bookings list */}
          <div className="border-t border-warm-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-warm-700 mb-3">Komende reservaties</h3>
            {bookings.filter(b => b.eind_datum >= format(new Date(), "yyyy-MM-dd")).length === 0 ? (
              <p className="text-sm text-warm-400">Nog geen reservaties.</p>
            ) : (
              <div className="space-y-2">
                {bookings
                  .filter(b => b.eind_datum >= format(new Date(), "yyyy-MM-dd"))
                  .sort((a, b) => a.start_datum.localeCompare(b.start_datum))
                  .slice(0, 5)
                  .map(b => (
                    <div key={b.id} className="flex items-center gap-3 py-2">
                      <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[b.status].dot} shrink-0`} />
                      <span className="text-sm text-warm-700 font-medium min-w-[140px]">
                        {format(parseISO(b.start_datum), "d MMM", { locale: nl })} — {format(parseISO(b.eind_datum), "d MMM yyyy", { locale: nl })}
                      </span>
                      {b.gast_naam && <span className="text-sm text-warm-500">{b.gast_naam}</span>}
                      <button
                        onClick={() => { setEditingBooking(b); setFormData({ gastNaam: b.gast_naam || "", status: b.status, notities: b.notities || "" }); setModal("edit"); }}
                        className="ml-auto text-xs text-warm-400 hover:text-accent transition-colors"
                      >
                        Bewerken
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "embed" && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-warm-900 mb-2">Embed op je website</h2>
          <p className="text-warm-500 text-sm mb-6">
            Kopieer de onderstaande code en plak deze op je website waar je de kalender wil tonen.
            Bezoekers zien enkel bezet/vrij — geen gastgegevens.
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

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <strong>Hoe installeren?</strong> Plak de code in je website-editor, net voor de sluitende &lt;/body&gt;-tag.
            Werkt op WordPress, Wix, Squarespace en elke andere website.
          </div>

        </div>
      )}

      {activeTab === "ical" && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-warm-900 mb-2">iCal URL</h2>
          <p className="text-warm-500 text-sm mb-6">
            Gebruik deze link om jouw kalender te synchroniseren met Google Agenda, Outlook, Apple Kalender of andere boekingssystemen. Elke wijziging in je kalender wordt automatisch doorgegeven.
          </p>

          <div className="bg-warm-900 rounded-xl p-4 mb-4 relative">
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed">
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
      )}

      {/* Modal: nieuwe reservatie */}
      {modal === "new" && selectStart && selectEnd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={cancelModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-warm-900 mb-1">Reservatie toevoegen</h3>
            <p className="text-sm text-warm-500 mb-5">
              {format(selectStart, "d MMMM", { locale: nl })} — {format(selectEnd, "d MMMM yyyy", { locale: nl })}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Gastnaam (optioneel)</label>
                <input
                  type="text"
                  value={formData.gastNaam}
                  onChange={e => setFormData(f => ({ ...f, gastNaam: e.target.value }))}
                  placeholder="Jan Janssen"
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  autoFocus
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Notities (optioneel)</label>
                <textarea
                  value={formData.notities}
                  onChange={e => setFormData(f => ({ ...f, notities: e.target.value }))}
                  rows={2}
                  placeholder="Aankomsttijd, sleutelafspraak..."
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
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

      {/* Modal: reservatie bewerken */}
      {modal === "edit" && editingBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={cancelModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-warm-900 mb-1">Reservatie bewerken</h3>
            <p className="text-sm text-warm-500 mb-5">
              {format(parseISO(editingBooking.start_datum), "d MMMM", { locale: nl })} — {format(parseISO(editingBooking.eind_datum), "d MMMM yyyy", { locale: nl })}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Gastnaam</label>
                <input
                  type="text"
                  value={formData.gastNaam}
                  onChange={e => setFormData(f => ({ ...f, gastNaam: e.target.value }))}
                  placeholder="Jan Janssen"
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  autoFocus
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Notities</label>
                <textarea
                  value={formData.notities}
                  onChange={e => setFormData(f => ({ ...f, notities: e.target.value }))}
                  rows={2}
                  placeholder="Aankomsttijd, sleutelafspraak..."
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
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
    </div>
  );
}
