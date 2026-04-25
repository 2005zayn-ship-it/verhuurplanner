"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Calendar, Booking } from "@/lib/types";

interface RapportageFilters {
  van: string;
  tot: string;
  prijs_type: "vast" | "percentage";
  prijs_waarde: string;
  belasting_per: "boeking" | "overnachting" | "persoon";
  max_nachten: string;
  import_meenemen: "ja" | "nee";
  statussen: string[];
  kalenders: string[];
}

interface RapportageRij {
  kalender_naam: string;
  periode: string;
  boekingen: number;
  nachten: number;
  belasting: number;
}

const DEFAULT_FILTERS: RapportageFilters = {
  van: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
  tot: new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0],
  prijs_type: "vast",
  prijs_waarde: "2.50",
  belasting_per: "overnachting",
  max_nachten: "",
  import_meenemen: "nee",
  statussen: ["bezet"],
  kalenders: [],
};

function nachten(start: string, eind: string): number {
  const a = new Date(start);
  const b = new Date(eind);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export default function RapportagePage() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [berekening, setBerekening] = useState(false);
  const [resultaten, setResultaten] = useState<RapportageRij[] | null>(null);
  const [totaal, setTotaal] = useState(0);
  const [filters, setFilters] = useState<RapportageFilters>(DEFAULT_FILTERS);

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

  function set<K extends keyof RapportageFilters>(field: K, value: RapportageFilters[K]) {
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

  async function handleBerekening() {
    if (filters.kalenders.length === 0) return;
    setBerekening(true);
    setResultaten(null);

    try {
      const supabase = createClient();
      let q = supabase
        .from("bookings")
        .select("*")
        .in("calendar_id", filters.kalenders)
        .in("status", filters.statussen)
        .gte("start_datum", filters.van)
        .lte("eind_datum", filters.tot);

      if (filters.import_meenemen === "nee") {
        q = q.neq("bron", "import");
      }

      const { data } = await q;
      const boekingen = (data as Booking[]) ?? [];

      const calMap = Object.fromEntries(calendars.map((c) => [c.id, c.naam]));
      const perKalender = new Map<string, Booking[]>();
      boekingen.forEach((b) => {
        const list = perKalender.get(b.calendar_id) ?? [];
        list.push(b);
        perKalender.set(b.calendar_id, list);
      });

      const maxNachten = filters.max_nachten ? parseInt(filters.max_nachten) : Infinity;
      const prijsWaarde = parseFloat(filters.prijs_waarde.replace(",", ".")) || 0;

      let totaalBelasting = 0;
      const rijen: RapportageRij[] = [];

      for (const [calId, bks] of perKalender) {
        let belastingKalender = 0;
        let totalNachten = 0;

        for (const b of bks) {
          let n = nachten(b.start_datum, b.eind_datum);
          if (maxNachten < Infinity) n = Math.min(n, maxNachten);
          totalNachten += n;

          let bedrag = 0;
          if (filters.belasting_per === "overnachting") {
            bedrag = n * prijsWaarde;
          } else if (filters.belasting_per === "boeking") {
            bedrag = prijsWaarde;
          } else {
            // persoon — we have no guest count, estimate 1
            bedrag = n * prijsWaarde;
          }
          belastingKalender += bedrag;
        }

        totaalBelasting += belastingKalender;
        rijen.push({
          kalender_naam: calMap[calId] ?? calId,
          periode: `${filters.van} t/m ${filters.tot}`,
          boekingen: bks.length,
          nachten: totalNachten,
          belasting: belastingKalender,
        });
      }

      setTotaal(totaalBelasting);
      setResultaten(rijen);
    } catch {
      setResultaten([]);
    } finally {
      setBerekening(false);
    }
  }

  function formatBedrag(n: number) {
    return `€ ${n.toFixed(2).replace(".", ",")}`;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
        <div className="h-5 bg-warm-100 rounded w-48 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-9 bg-warm-50 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-warm-900">Rapportage</h1>
        <p className="text-warm-500 text-sm mt-1">Bereken de toeristenbelasting voor je boekingen.</p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-6">

        {/* Periode */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Periode</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">Van</label>
              <input type="date" className={inputCls} value={filters.van} onChange={(e) => set("van", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">Tot</label>
              <input type="date" className={inputCls} value={filters.tot} onChange={(e) => set("tot", e.target.value)} />
            </div>
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Prijs berekening */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Prijs berekening</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-warm-700 cursor-pointer">
              <input type="radio" className="text-accent" checked={filters.prijs_type === "vast"} onChange={() => set("prijs_type", "vast")} />
              <span>Vaste prijs per eenheid</span>
              {filters.prijs_type === "vast" && (
                <div className="flex items-center gap-1">
                  <span className="text-warm-500">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-24 px-2 py-1 border border-warm-200 rounded-lg text-sm text-center"
                    value={filters.prijs_waarde}
                    onChange={(e) => set("prijs_waarde", e.target.value)}
                  />
                </div>
              )}
            </label>
            <label className="flex items-center gap-3 text-sm text-warm-700 cursor-pointer">
              <input type="radio" className="text-accent" checked={filters.prijs_type === "percentage"} onChange={() => set("prijs_type", "percentage")} />
              <span>Percentage van de boeking</span>
              {filters.prijs_type === "percentage" && (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-20 px-2 py-1 border border-warm-200 rounded-lg text-sm text-center"
                    value={filters.prijs_waarde}
                    onChange={(e) => set("prijs_waarde", e.target.value)}
                  />
                  <span className="text-warm-500">%</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Belasting per */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Belasting per</h2>
          <div className="space-y-2">
            {(["boeking", "overnachting", "persoon"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer capitalize">
                <input type="radio" className="text-accent" checked={filters.belasting_per === v} onChange={() => set("belasting_per", v)} />
                Per {v}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Max nachten */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-1">Maximaal belastbare nachten</h2>
          <p className="text-xs text-warm-400 mb-3">Laat leeg voor geen maximum.</p>
          <input
            type="number"
            min="0"
            className="w-32 px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm"
            value={filters.max_nachten}
            onChange={(e) => set("max_nachten", e.target.value)}
            placeholder="Geen max"
          />
        </div>

        <hr className="border-warm-100" />

        {/* Import */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Geïmporteerde boekingen</h2>
          <div className="flex gap-4">
            {(["ja", "nee"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                <input type="radio" className="text-accent" checked={filters.import_meenemen === v} onChange={() => set("import_meenemen", v)} />
                {v === "ja" ? "Meenemen" : "Niet meenemen"}
              </label>
            ))}
          </div>
        </div>

        <hr className="border-warm-100" />

        {/* Statussen */}
        <div>
          <h2 className="text-sm font-semibold text-warm-800 mb-3">Boekingsstatus</h2>
          <div className="flex gap-4">
            {["bezet", "optie", "geblokkeerd"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                <input type="checkbox" className="rounded border-warm-300 text-accent" checked={filters.statussen.includes(s)} onChange={() => toggleStatus(s)} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
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
                  <input type="checkbox" className="rounded border-warm-300 text-accent" checked={filters.kalenders.includes(cal.id)} onChange={() => toggleKalender(cal.id)} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cal.kleur }} />
                  {cal.naam}
                </label>
              ))}
            </div>
          </div>
        )}

        <hr className="border-warm-100" />

        <button
          onClick={handleBerekening}
          disabled={berekening || filters.kalenders.length === 0}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {berekening ? "Bezig..." : "Berekening uitvoeren"}
        </button>
      </div>

      {/* Resultaten */}
      {resultaten !== null && (
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-warm-900">Resultaten</h2>
            <span className="text-sm font-semibold text-warm-700">
              Totaal: <span className="text-accent">{formatBedrag(totaal)}</span>
            </span>
          </div>

          {resultaten.length === 0 ? (
            <p className="text-warm-400 text-sm py-4 text-center">Geen boekingen gevonden voor deze periode en filters.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-warm-100">
              <table className="w-full text-sm">
                <thead className="bg-warm-50">
                  <tr>
                    {["Kalender", "Periode", "Boekingen", "Nachten", "Toeristenbelasting"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-50">
                  {resultaten.map((r, i) => (
                    <tr key={i} className="hover:bg-warm-50 transition-colors">
                      <td className="px-4 py-3 text-warm-800 font-medium">{r.kalender_naam}</td>
                      <td className="px-4 py-3 text-warm-600">{r.periode}</td>
                      <td className="px-4 py-3 text-warm-700">{r.boekingen}</td>
                      <td className="px-4 py-3 text-warm-700">{r.nachten}</td>
                      <td className="px-4 py-3 font-semibold text-warm-900">{formatBedrag(r.belasting)}</td>
                    </tr>
                  ))}
                  {resultaten.length > 1 && (
                    <tr className="bg-warm-50 font-semibold">
                      <td className="px-4 py-3 text-warm-900" colSpan={4}>Totaal</td>
                      <td className="px-4 py-3 text-accent">{formatBedrag(totaal)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white transition-colors";
