"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ReserveringsConfig, DEFAULT_RESERVERINGEN } from "@/lib/types";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-accent" : "bg-warm-200"
      }`}
      aria-label={label}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export default function ReserveringsInstellingenPage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [config, setConfig] = useState<ReserveringsConfig>(DEFAULT_RESERVERINGEN);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/widget/${calendarId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.widget_config?.reserveringen) {
          setConfig({ ...DEFAULT_RESERVERINGEN, ...d.widget_config.reserveringen });
        }
      })
      .finally(() => setLoading(false));
  }, [calendarId]);

  const save = useCallback(
    async (updated: ReserveringsConfig) => {
      setSaving(true);
      await fetch(`/api/widget/${calendarId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "reserveringen", config: updated }),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [calendarId]
  );

  function update(partial: Partial<ReserveringsConfig>) {
    const updated = { ...config, ...partial };
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

  const isAan = config.ontvangen_via === "inschakelen";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Reserveringsinstellingen</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Bepaal hoe boekingen worden ontvangen en verwerkt.
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

      {/* Online reserveringen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-warm-900">Online reserveringen</h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Gasten kunnen een reservering aanvragen via de widget.
            </p>
          </div>
          <Toggle
            checked={isAan}
            onChange={(v) => update({ ontvangen_via: v ? "inschakelen" : "uitschakelen" })}
            label="Online reserveringen"
          />
        </div>

        {isAan && (
          <div className="space-y-4 pt-4 border-t border-warm-100">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">
                E-mailadres voor meldingen
              </label>
              <input
                type="email"
                value={config.email_adres}
                onChange={(e) => update({ email_adres: e.target.value })}
                placeholder="jouw@email.be"
                className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">
                Melding sturen bij
              </label>
              <div className="space-y-2">
                {(
                  [
                    { value: "elke_status", label: "Elke statuswijziging" },
                    { value: "bevestigd", label: "Alleen bevestigde boekingen" },
                    { value: "nieuw", label: "Alleen nieuwe aanvragen" },
                  ] as const
                ).map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="notificatie_bij"
                      value={opt.value}
                      checked={config.notificatie_bij === opt.value}
                      onChange={() => update({ notificatie_bij: opt.value })}
                      className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                    />
                    <span className="text-sm text-warm-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aankomst- en vertrektijden */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Check-in en check-out
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">Aankomsttijd</label>
            <div className="flex gap-2 items-center">
              <select
                value={config.start_tijd_uur}
                onChange={(e) => update({ start_tijd_uur: Number(e.target.value) })}
                className="flex-1 border border-warm-200 rounded-lg px-2 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="text-warm-400">:</span>
              <select
                value={config.start_tijd_minuut}
                onChange={(e) => update({ start_tijd_minuut: Number(e.target.value) })}
                className="flex-1 border border-warm-200 rounded-lg px-2 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">Vertrektijd</label>
            <div className="flex gap-2 items-center">
              <select
                value={config.eind_tijd_uur}
                onChange={(e) => update({ eind_tijd_uur: Number(e.target.value) })}
                className="flex-1 border border-warm-200 rounded-lg px-2 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="text-warm-400">:</span>
              <select
                value={config.eind_tijd_minuut}
                onChange={(e) => update({ eind_tijd_minuut: Number(e.target.value) })}
                className="flex-1 border border-warm-200 rounded-lg px-2 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Boekingsinstellingen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Boekingsinstellingen
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Reservering bevestigen
            </label>
            <div className="space-y-2">
              {(
                [
                  { value: "direct", label: "Direct bevestigd" },
                  { value: "op_bevestiging", label: "Na handmatige bevestiging" },
                  { value: "na_betaling", label: "Na ontvangst van betaling" },
                ] as const
              ).map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="aangenomen_reserveringen"
                    value={opt.value}
                    checked={config.aangenomen_reserveringen === opt.value}
                    onChange={() => update({ aangenomen_reserveringen: opt.value })}
                    className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                  />
                  <span className="text-sm text-warm-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-warm-100">
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Boeking per
            </label>
            <div className="flex gap-4">
              {(
                [
                  { value: "nacht", label: "Nacht" },
                  { value: "dag", label: "Dag" },
                ] as const
              ).map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="boeking_per"
                    value={opt.value}
                    checked={config.boeking_per === opt.value}
                    onChange={() => update({ boeking_per: opt.value })}
                    className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                  />
                  <span className="text-sm text-warm-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-warm-100">
            <label className="block text-sm font-medium text-warm-700 mb-2">
              Boekingsnummer
            </label>
            <div className="space-y-2">
              {(
                [
                  { value: "doorlopend", label: "Doorlopend (1, 2, 3...)" },
                  { value: "jaartal_doorlopend", label: "Jaar + doorlopend (2025-1, 2025-2...)" },
                  { value: "eigen_begin", label: "Eigen beginnummer" },
                ] as const
              ).map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="boekingnummer"
                    value={opt.value}
                    checked={config.boekingnummer === opt.value}
                    onChange={() => update({ boekingnummer: opt.value })}
                    className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                  />
                  <span className="text-sm text-warm-800">{opt.label}</span>
                </label>
              ))}
            </div>
            {config.boekingnummer === "eigen_begin" && (
              <div className="mt-3 ml-7">
                <label className="block text-xs text-warm-500 mb-1">Beginnummer</label>
                <input
                  type="number"
                  min={1}
                  value={config.eigen_begin_nummer}
                  onChange={(e) => update({ eigen_begin_nummer: Number(e.target.value) })}
                  className="w-32 border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doorverwijzing */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Doorverwijzing na boeking
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Dankjewel-pagina (na bevestiging)
            </label>
            <input
              type="url"
              value={config.dankjewel_url}
              onChange={(e) => update({ dankjewel_url: e.target.value })}
              placeholder="https://jouwsite.be/bedankt"
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
            <p className="text-xs text-warm-400 mt-1">
              Laat leeg om de standaard bevestigingspagina te tonen.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Annulatiepagina
            </label>
            <input
              type="url"
              value={config.annulatie_url}
              onChange={(e) => update({ annulatie_url: e.target.value })}
              placeholder="https://jouwsite.be/annulatie"
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Boekingsscherm */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Boekingsformulier openen
        </h2>
        <div className="space-y-2">
          {(
            [
              { value: "zelfde_scherm", label: "In hetzelfde venster" },
              { value: "popup", label: "Als pop-up" },
              { value: "nieuw_scherm", label: "In een nieuw venster" },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="boekingsscherm"
                value={opt.value}
                checked={config.boekingsscherm === opt.value}
                onChange={() => update({ boekingsscherm: opt.value })}
                className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
              />
              <span className="text-sm text-warm-800">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Meerdere eenheden */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-warm-900">Meerdere eenheden boeken</h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Gasten kunnen via de combi-widget meerdere woningen of eenheden in één boeking selecteren.
            </p>
          </div>
          <Toggle
            checked={config.meerdere_eenheden_boekbaar}
            onChange={(v) => update({ meerdere_eenheden_boekbaar: v })}
            label="Meerdere eenheden boeken"
          />
        </div>
        {config.meerdere_eenheden_boekbaar && (
          <p className="mt-3 text-xs text-warm-500 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
            Wanneer ingeschakeld toont de combi-widget een keuze voor elke eenheid, zodat gasten meerdere eenheden samen kunnen boeken.
          </p>
        )}
      </div>
    </div>
  );
}
