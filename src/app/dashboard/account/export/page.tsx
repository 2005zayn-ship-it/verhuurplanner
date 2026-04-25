"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Calendar, Booking } from "@/lib/types";

interface ExportFilters {
  van: string;
  tot: string;
  periode_type: "plaatsvindt" | "ingevoerd";
  kalenders: string[];
  import_boekingen: "toevoegen" | "niet";
  statussen: string[];
  versie: "simpel" | "uitgebreid";
  getallen: "punt" | "komma";
}

const DEFAULT_FILTERS: ExportFilters = {
  van: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
  tot: new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
  periode_type: "plaatsvindt",
  kalenders: [],
  import_boekingen: "toevoegen",
  statussen: ["bezet", "optie", "geblokkeerd"],
  versie: "simpel",
  getallen: "komma",
};

export default function ExportPage() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<ExportFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cals } = await supabase
        .from("calendars")
        .select("id, naam, kleur, woning_naam, user_id, public_token, widget_config, ical_import_urls, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      const calList = (cals as Calendar[]) ?? [];
      setCalendars(calList);
      setFilters((prev) => ({ ...prev, kalenders: calList.map((c) => c.id) }));
      setLoading(false);
    }
    load();
  }, []);

  function set<K extends keyof ExportFilters>(field: K, value: ExportFilters[K]) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function toggleStatus(s: string) {
    setFilters((prev) => ({
      ...prev,
      statussen: prev.statussen.includes(s)
        ? prev.statussen.filter((x) => x !== s)
        : [...prev.statussen, s],
    }));
  }

  function toggleKalender(id: string) {
    setFilters((prev) => ({
      ...prev,
      kalenders: prev.kalenders.includes(id)
        ? prev.kalenders.filter((x) => x !== id)
        : [...prev.kalenders, id],
    }));
  }

  async function fetchBookings(): Promise<Booking[]> {
    const supabase = createClient();
    if (filters.kalenders.length === 0) return [];

    let q = supabase
      .from("bookings")
      .select("*")
      .in("calendar_id", filters.kalenders)
      .in("status", filters.statussen);

    if (filters.periode_type === "plaatsvindt") {
      q = q.gte("start_datum", filters.van).lte("eind_datum", filters.tot);
    } else {
      q = q.gte("created_at", filters.van).lte("created_at", filters.tot + "T23:59:59");
    }

    if (filters.import_boekingen === "niet") {
      q = q.neq("bron", "import");
    }

    const { data } = await q.order("start_datum", { ascending: true });
    return (data as Booking[]) ?? [];
  }

  function boekingenNaarCSV(boekingen: Booking[]): string {
    const sep = ",";
    const dec = filters.getallen === "komma" ? "," : ".";

    const calMap = Object.fromEntries(calendars.map((c) => [c.id, c.naam]));

    const headers = filters.versie === "simpel"
      ? ["Kalender", "Gast", "Start", "Eind", "Status", "Bron"]
      : ["Kalender", "Gast", "Start", "Eind", "Status", "Bron", "Notities", "Aangemaakt op"];

    const rows = boekingen.map((b) => {
      const base = [
        calMap[b.calendar_id] ?? b.calendar_id,
        b.gast_naam ?? "",
        b.start_datum,
        b.eind_datum,
        b.status,
        b.bron ?? "",
      ];
      if (filters.versie === "uitgebreid") {
        base.push(b.notities ?? "");
        base.push(b.created_at.split("T")[0]);
      }
      // Escape commas and format decimals
      return base.map((v) => {
        const str = String(v).replace(/\./g, dec);
        return str.includes(sep) ? `"${str}"` : str;
      });
    });

    return [headers.join(sep), ...rows.map((r) => r.join(sep))].join("\n");
  }

  async function handleCSV() {
    setExporting(true);
    try {
      const boekingen = await fetchBookings();
      const csv = boekingenNaarCSV(boekingen);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boekingen-${filters.van}-${filters.tot}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export mislukt. Probeer opnieuw.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
        <div className="h-5 bg-warm-100 rounded w-48 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-9 bg-warm-50 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-warm-900">Gegevens downloaden</h1>
        <p className="text-warm-500 text-sm mt-1">Exporteer je boekingen naar CSV of Excel.</p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-6">

        {/* Periode */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Periode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">Van</label>
              <input type="date" className={inputCls} value={filters.van} onChange={(e) => set("van", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">Tot</label>
              <input type="date" className={inputCls} value={filters.tot} onChange={(e) => set("tot", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            {(["plaatsvindt", "ingevoerd"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                <input
                  type="radio"
                  className="text-accent"
                  checked={filters.periode_type === v}
                  onChange={() => set("periode_type", v)}
                />
                {v === "plaatsvindt" ? "Periode dat de boeking plaatsvindt" : "Periode dat de boeking is ingevoerd"}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Kalenders */}
        {calendars.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-warm-800 mb-3">Kalenders</h2>
            <div className="space-y-2">
              {calendars.map((cal) => (
                <label key={cal.id} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-warm-300 text-accent"
                    checked={filters.kalenders.includes(cal.id)}
                    onChange={() => toggleKalender(cal.id)}
                  />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cal.kleur }} />
                  {cal.naam}
                </label>
              ))}
            </div>
          </div>
        )}

        <hr className="border-warm-100" />

        {/* Import boekingen */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Geïmporteerde boekingen</h2>
          <div className="space-y-2">
            {(["toevoegen", "niet"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                <input
                  type="radio"
                  className="text-accent"
                  checked={filters.import_boekingen === v}
                  onChange={() => set("import_boekingen", v)}
                />
                {v === "toevoegen" ? "Toevoegen" : "Niet toevoegen"}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Boekingsstatus */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Boekingsstatus</h2>
          <div className="flex gap-4">
            {["bezet", "optie", "geblokkeerd"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer capitalize">
                <input
                  type="checkbox"
                  className="rounded border-warm-300 text-accent"
                  checked={filters.statussen.includes(s)}
                  onChange={() => toggleStatus(s)}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Versie */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Export versie</h2>
          <div className="space-y-2">
            {(["simpel", "uitgebreid"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                <input
                  type="radio"
                  className="text-accent"
                  checked={filters.versie === v}
                  onChange={() => set("versie", v)}
                />
                {v === "simpel" ? "Simpele versie" : "Uitgebreide versie"}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Getallen */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Getallen</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
              <input type="radio" className="text-accent" checked={filters.getallen === "punt"} onChange={() => set("getallen", "punt")} />
              Met punt (bijv. 100.50)
            </label>
            <label className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
              <input type="radio" className="text-accent" checked={filters.getallen === "komma"} onChange={() => set("getallen", "komma")} />
              Met komma (bijv. 100,50)
            </label>
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Knoppen */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleCSV}
            disabled={exporting || filters.kalenders.length === 0}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            {exporting ? "Exporteren..." : "CSV downloaden"}
          </button>
          <button
            disabled
            className="flex items-center gap-2 border border-warm-200 text-warm-500 font-medium px-5 py-2.5 rounded-xl text-sm cursor-not-allowed opacity-60"
            title="Binnenkort beschikbaar"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Excel downloaden
            <span className="text-xs bg-warm-100 text-warm-500 px-1.5 py-0.5 rounded-full">Binnenkort</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white transition-colors";
