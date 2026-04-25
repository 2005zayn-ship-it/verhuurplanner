"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface AfrekeningInstellingen {
  eigenaar_naam?: string;
  eigenaar_email?: string;
  eigenaar_adres?: string;
  commissie_type?: "percentage" | "vast";
  commissie_waarde?: number;
  huurprijs_type?: "tarieven" | "vast";
  huurprijs_nacht?: number | null;
}

interface AfrekeningRegel {
  id: string;
  start_datum: string;
  eind_datum: string;
  gast_naam: string | null;
  status: string;
  bron: string | null;
  nachten: number;
  prijs_nacht: number | null;
  totaal: number | null;
}

interface AfrekeningData {
  calendar: { naam: string; woning_naam: string | null };
  beheerder: Record<string, string>;
  eigenaar: { naam: string; email: string; adres: string };
  periode: { van: string; tot: string };
  regels: AfrekeningRegel[];
  samenvatting: {
    totaal_huurinkomsten: number;
    commissie_type: string;
    commissie_waarde: number;
    commissie_bedrag: number;
    eigenaar_ontvangt: number;
  };
}

const EMPTY_INSTELLINGEN: AfrekeningInstellingen = {
  eigenaar_naam: "",
  eigenaar_email: "",
  eigenaar_adres: "",
  commissie_type: "percentage",
  commissie_waarde: 15,
  huurprijs_type: "vast",
  huurprijs_nacht: null,
};

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
}

function euro(n: number | null) {
  if (n == null) return "—";
  return `€ ${n.toFixed(2).replace(".", ",")}`;
}

function statusLabel(s: string) {
  if (s === "bezet") return "Bezet";
  if (s === "optie") return "Optie";
  return "Geblokkeerd";
}

export default function AfrekeningClient({
  calendarId,
  calendarNaam,
}: {
  calendarId: string;
  calendarNaam: string;
}) {
  const [tab, setTab] = useState<"instellingen" | "genereer">("instellingen");
  const [instellingen, setInstellingen] = useState<AfrekeningInstellingen>(EMPTY_INSTELLINGEN);
  const [loadingI, setLoadingI] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [van, setVan] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [tot, setTot] = useState(() => {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, "0")}-${String(last.getDate()).padStart(2, "0")}`;
  });
  const [statussen, setStatussen] = useState<string[]>(["bezet"]);
  const [loading, setLoading] = useState(false);
  const [afrekening, setAfrekening] = useState<AfrekeningData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/calendars/${calendarId}/afrekening`)
      .then((r) => r.json())
      .then((d) => setInstellingen({ ...EMPTY_INSTELLINGEN, ...d.instellingen }))
      .finally(() => setLoadingI(false));
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [calendarId]);

  function updateInstelling<K extends keyof AfrekeningInstellingen>(
    key: K,
    value: AfrekeningInstellingen[K]
  ) {
    const next = { ...instellingen, [key]: value };
    setInstellingen(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      await fetch(`/api/calendars/${calendarId}/afrekening`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  async function genereer() {
    setLoading(true);
    setError(null);
    setAfrekening(null);
    try {
      const res = await fetch(`/api/calendars/${calendarId}/afrekening`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ van, tot, statussen }),
      });
      const d = await res.json();
      if (!res.ok) setError(d.error ?? "Fout bij genereren");
      else setAfrekening(d);
    } catch {
      setError("Verbindingsfout.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingI) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/kalender/${calendarId}`}
          className="text-sm text-warm-400 hover:text-accent transition-colors flex items-center gap-1.5 mb-4"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Terug naar {calendarNaam}
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Afrekening</h1>
        <p className="text-warm-500 text-sm mt-1">
          Stel de commissie in en genereer een overzicht voor de eigenaar.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-warm-100 rounded-xl p-1 w-fit">
        {(["instellingen", "genereer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-white text-warm-900 shadow-sm"
                : "text-warm-500 hover:text-warm-700"
            }`}
          >
            {t === "instellingen" ? "Instellingen" : "Afrekening genereren"}
          </button>
        ))}
      </div>

      {tab === "instellingen" && (
        <div className="space-y-6">
          <div className="flex justify-end text-sm h-5">
            {saved && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Bewaard
              </span>
            )}
            {saving && <span className="text-warm-400">Bewaren...</span>}
          </div>

          <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-warm-900">Eigenaargegevens</h2>
            <p className="text-xs text-warm-400 -mt-1">
              Gegevens van de eigenaar aan wie je de afrekening bezorgt.
            </p>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Naam eigenaar</label>
              <input
                type="text"
                value={instellingen.eigenaar_naam ?? ""}
                onChange={(e) => updateInstelling("eigenaar_naam", e.target.value)}
                placeholder="bijv. Familie Dupont"
                className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">E-mail eigenaar</label>
                <input
                  type="email"
                  value={instellingen.eigenaar_email ?? ""}
                  onChange={(e) => updateInstelling("eigenaar_email", e.target.value)}
                  placeholder="eigenaar@gmail.com"
                  className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Adres eigenaar</label>
                <input
                  type="text"
                  value={instellingen.eigenaar_adres ?? ""}
                  onChange={(e) => updateInstelling("eigenaar_adres", e.target.value)}
                  placeholder="Dorpstraat 5, 9000 Gent"
                  className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-warm-900">Commissie</h2>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">Type commissie</label>
              <div className="flex gap-4">
                {([["percentage", "Percentage van huurinkomsten"], ["vast", "Vast bedrag per boeking"]] as const).map(
                  ([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={instellingen.commissie_type === val}
                        onChange={() => updateInstelling("commissie_type", val)}
                        className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                      />
                      <span className="text-sm text-warm-800">{label}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-warm-700 mb-1">
                {instellingen.commissie_type === "percentage" ? "Commissie %" : "Bedrag per boeking (€)"}
              </label>
              <div className="relative">
                {instellingen.commissie_type === "percentage" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">%</span>
                )}
                {instellingen.commissie_type === "vast" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                )}
                <input
                  type="number"
                  min={0}
                  step={instellingen.commissie_type === "percentage" ? 0.1 : 1}
                  value={instellingen.commissie_waarde ?? ""}
                  onChange={(e) =>
                    updateInstelling("commissie_waarde", e.target.value === "" ? 0 : Number(e.target.value))
                  }
                  className={`w-full border border-warm-200 rounded-lg py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none ${
                    instellingen.commissie_type === "percentage" ? "px-3 pr-8" : "pl-7 pr-3"
                  }`}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-warm-900">Huurprijs voor berekening</h2>
            <p className="text-xs text-warm-400 -mt-1">
              Welke prijs gebruik je als basis voor de huurinkomsten in de afrekening?
            </p>
            <div className="flex gap-4">
              {([["tarieven", "Tarieven uit widget"], ["vast", "Vaste prijs per nacht"]] as const).map(
                ([val, label]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={instellingen.huurprijs_type === val}
                      onChange={() => updateInstelling("huurprijs_type", val)}
                      className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                    />
                    <span className="text-sm text-warm-800">{label}</span>
                  </label>
                )
              )}
            </div>
            {instellingen.huurprijs_type === "vast" && (
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-warm-700 mb-1">Prijs per nacht (€)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={instellingen.huurprijs_nacht ?? ""}
                    onChange={(e) =>
                      updateInstelling(
                        "huurprijs_nacht",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                    placeholder="—"
                    className="w-full border border-warm-200 rounded-lg pl-7 pr-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {tab === "genereer" && (
        <div className="space-y-6">
          {!afrekening ? (
            <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-semibold text-warm-900">Periode kiezen</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Van</label>
                  <input
                    type="date"
                    value={van}
                    onChange={(e) => setVan(e.target.value)}
                    className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Tot en met</label>
                  <input
                    type="date"
                    value={tot}
                    onChange={(e) => setTot(e.target.value)}
                    className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">Welke boekingen opnemen?</label>
                <div className="flex gap-4 flex-wrap">
                  {(["bezet", "optie", "geblokkeerd"] as const).map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statussen.includes(s)}
                        onChange={(e) => {
                          if (e.target.checked) setStatussen((prev) => [...prev, s]);
                          else setStatussen((prev) => prev.filter((x) => x !== s));
                        }}
                        className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent"
                      />
                      <span className="text-sm text-warm-800 capitalize">{statusLabel(s)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={genereer}
                disabled={loading || statussen.length === 0}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {loading && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" strokeLinecap="round" />
                  </svg>
                )}
                {loading ? "Bezig..." : "Afrekening genereren"}
              </button>
            </section>
          ) : (
            <Afrekening data={afrekening} onReset={() => setAfrekening(null)} />
          )}
        </div>
      )}
    </div>
  );
}

function Afrekening({ data, onReset }: { data: AfrekeningData; onReset: () => void }) {
  const { calendar, beheerder, eigenaar, periode, regels, samenvatting } = data;
  const heeftPrijzen = regels.some((r) => r.totaal != null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 print:hidden">
        <button
          onClick={onReset}
          className="text-sm text-warm-500 hover:text-warm-900 transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Andere periode kiezen
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-warm-200 text-warm-700 hover:bg-warm-50 font-medium px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Afdrukken / PDF
        </button>
      </div>

      {/* Printable document */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 print:shadow-none print:border-0 print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-warm-100">
          <div>
            <p className="font-bold text-warm-900 text-lg">{beheerder.bedrijfsnaam || beheerder.naam || "—"}</p>
            {beheerder.btw_nummer && <p className="text-xs text-warm-500">BTW: {beheerder.btw_nummer}</p>}
            {beheerder.adres && (
              <p className="text-sm text-warm-600 mt-1">
                {beheerder.adres}
                {beheerder.postcode || beheerder.gemeente
                  ? `, ${[beheerder.postcode, beheerder.gemeente].filter(Boolean).join(" ")}`
                  : ""}
              </p>
            )}
            {beheerder.telefoon && <p className="text-xs text-warm-500 mt-0.5">{beheerder.telefoon}</p>}
            {beheerder.facturatie_email && <p className="text-xs text-warm-500">{beheerder.facturatie_email}</p>}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-accent mb-1">Afrekening</p>
            <p className="text-sm text-warm-600">
              {calendar.woning_naam || calendar.naam}
            </p>
            <p className="text-xs text-warm-400 mt-1">
              {fmt(periode.van)} — {fmt(periode.tot)}
            </p>
          </div>
        </div>

        {/* Eigenaar */}
        {(eigenaar.naam || eigenaar.adres) && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">Aan</p>
            <p className="font-medium text-warm-900">{eigenaar.naam}</p>
            {eigenaar.adres && <p className="text-sm text-warm-600">{eigenaar.adres}</p>}
            {eigenaar.email && <p className="text-xs text-warm-500">{eigenaar.email}</p>}
          </div>
        )}

        {/* Boekingen tabel */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-3">Boekingen</p>
          {regels.length === 0 ? (
            <p className="text-sm text-warm-500 py-4 text-center bg-warm-50 rounded-xl">
              Geen boekingen gevonden in deze periode.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-100">
                  <th className="text-left py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Aankomst</th>
                  <th className="text-left py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Vertrek</th>
                  <th className="text-left py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Gast</th>
                  <th className="text-right py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Nachten</th>
                  {heeftPrijzen && (
                    <>
                      <th className="text-right py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Per nacht</th>
                      <th className="text-right py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Totaal</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {regels.map((r) => (
                  <tr key={r.id} className="border-b border-warm-50">
                    <td className="py-2.5 text-warm-700">{fmt(r.start_datum)}</td>
                    <td className="py-2.5 text-warm-700">{fmt(r.eind_datum)}</td>
                    <td className="py-2.5 text-warm-600">{r.gast_naam || <span className="text-warm-300">—</span>}</td>
                    <td className="py-2.5 text-right text-warm-700">{r.nachten}</td>
                    {heeftPrijzen && (
                      <>
                        <td className="py-2.5 text-right text-warm-600">{euro(r.prijs_nacht)}</td>
                        <td className="py-2.5 text-right font-medium text-warm-900">{euro(r.totaal)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Samenvatting */}
        {heeftPrijzen && regels.length > 0 && (
          <div className="ml-auto max-w-xs space-y-2 pt-4 border-t border-warm-100">
            <div className="flex justify-between text-sm">
              <span className="text-warm-600">Totaal huurinkomsten</span>
              <span className="font-medium text-warm-900">{euro(samenvatting.totaal_huurinkomsten)}</span>
            </div>
            {samenvatting.commissie_waarde > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-warm-600">
                  Commissie{" "}
                  {samenvatting.commissie_type === "percentage"
                    ? `(${samenvatting.commissie_waarde}%)`
                    : `(${euro(samenvatting.commissie_waarde)}/boeking × ${regels.length})`}
                </span>
                <span className="font-medium text-warm-900">- {euro(samenvatting.commissie_bedrag)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-warm-200">
              <span className="text-warm-900">Eigenaar ontvangt</span>
              <span className="text-accent">{euro(samenvatting.eigenaar_ontvangt)}</span>
            </div>
          </div>
        )}

        {/* IBAN */}
        {(beheerder.iban || beheerder.bic) && (
          <div className="mt-8 pt-6 border-t border-warm-100 text-xs text-warm-400">
            {beheerder.iban && <p>Rekeningnummer: {beheerder.iban}</p>}
            {beheerder.bic && <p>BIC: {beheerder.bic}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
