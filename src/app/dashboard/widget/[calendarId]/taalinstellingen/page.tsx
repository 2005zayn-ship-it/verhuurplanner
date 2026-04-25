"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { TaalConfig } from "@/lib/types";

const TALEN = [
  { code: "NL", label: "Nederlands", vlag: "🇧🇪" },
  { code: "FR", label: "Frans", vlag: "🇫🇷" },
  { code: "DE", label: "Duits", vlag: "🇩🇪" },
  { code: "EN", label: "Engels", vlag: "🇬🇧" },
];

const DEFAULT_TAAL: TaalConfig = {
  actieve_talen: ["NL"],
  kalender_namen: {},
};

export default function TaalinstellingenPage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [config, setConfig] = useState<TaalConfig>(DEFAULT_TAAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/widget/${calendarId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.widget_config?.talen) {
          setConfig({ ...DEFAULT_TAAL, ...d.widget_config.talen });
        }
      })
      .finally(() => setLoading(false));
  }, [calendarId]);

  const save = useCallback(
    async (updated: TaalConfig) => {
      setSaving(true);
      await fetch(`/api/widget/${calendarId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "talen", config: updated }),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [calendarId]
  );

  function toggleTaal(code: string) {
    const isActive = config.actieve_talen.includes(code);
    // NL is always required
    if (isActive && code === "NL") return;
    const updated: TaalConfig = {
      ...config,
      actieve_talen: isActive
        ? config.actieve_talen.filter((t) => t !== code)
        : [...config.actieve_talen, code],
    };
    setConfig(updated);
    save(updated);
  }

  function updateNaam(code: string, naam: string) {
    const updated: TaalConfig = {
      ...config,
      kalender_namen: { ...config.kalender_namen, [code]: naam },
    };
    setConfig(updated);
    save(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Taalinstellingen</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Kies in welke talen de widget beschikbaar is.
          </p>
        </div>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Bewaard
          </span>
        )}
        {saving && <span className="text-sm text-warm-400">Bezig met bewaren...</span>}
      </div>

      {/* Actieve talen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Actieve talen
        </h2>
        <p className="text-sm text-warm-500 mb-4">
          Gasten kunnen de widget bekijken in de geselecteerde talen. Nederlands is altijd verplicht.
        </p>
        <div className="space-y-3">
          {TALEN.map((taal) => {
            const isActive = config.actieve_talen.includes(taal.code);
            const isForced = taal.code === "NL";
            return (
              <label
                key={taal.code}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  isActive
                    ? "border-accent/40 bg-accent/5"
                    : "border-warm-100 hover:border-warm-200"
                } ${isForced ? "cursor-default" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleTaal(taal.code)}
                  disabled={isForced}
                  className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-xl">{taal.vlag}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-warm-900">{taal.label}</span>
                  {isForced && (
                    <span className="ml-2 text-xs text-warm-400">(altijd actief)</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Kalendernamen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-1">
          Naam van de kalender per taal
        </h2>
        <p className="text-sm text-warm-500 mb-4">
          Optioneel: geef de kalender een naam per taal. Laat leeg om de standaardnaam te gebruiken.
        </p>
        <div className="space-y-3">
          {TALEN.filter((t) => config.actieve_talen.includes(t.code)).map((taal) => (
            <div key={taal.code}>
              <label className="block text-xs text-warm-500 mb-1 flex items-center gap-1.5">
                <span>{taal.vlag}</span>
                <span>{taal.label}</span>
              </label>
              <input
                type="text"
                value={config.kalender_namen[taal.code] ?? ""}
                onChange={(e) => updateNaam(taal.code, e.target.value)}
                placeholder={`Naam in het ${taal.label.toLowerCase()}`}
                className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
