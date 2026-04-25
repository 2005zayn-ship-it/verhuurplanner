"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  BoekingsformulierConfig,
  DEFAULT_BOEKINGSFORMULIER,
} from "@/lib/types";

type VrijVeld = BoekingsformulierConfig["vrije_velden"][number];

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

function FieldRow({
  label,
  tonen,
  verplicht,
  onToggleTonen,
  onToggleVerplicht,
  showVerplicht,
}: {
  label: string;
  tonen: boolean;
  verplicht: boolean;
  onToggleTonen: (v: boolean) => void;
  onToggleVerplicht: (v: boolean) => void;
  showVerplicht?: boolean;
}) {
  return (
    <div className="flex items-center gap-6 py-3 border-b border-warm-100 last:border-0">
      <span className="text-sm text-warm-800 w-32">{label}</span>
      <div className="flex items-center gap-2">
        <Toggle checked={tonen} onChange={onToggleTonen} label={`Toon ${label}`} />
        <span className="text-xs text-warm-500">Tonen</span>
      </div>
      {showVerplicht !== false && (
        <div className="flex items-center gap-2">
          <Toggle
            checked={tonen && verplicht}
            onChange={onToggleVerplicht}
            label={`${label} verplicht`}
          />
          <span className="text-xs text-warm-500">Verplicht</span>
        </div>
      )}
    </div>
  );
}

export default function BoekingsformulierPage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [config, setConfig] = useState<BoekingsformulierConfig>(DEFAULT_BOEKINGSFORMULIER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newVeld, setNewVeld] = useState<VrijVeld>({
    naam: "",
    breedte: "vol",
    verplicht: false,
  });

  useEffect(() => {
    fetch(`/api/widget/${calendarId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.widget_config?.boekingsformulier) {
          setConfig({ ...DEFAULT_BOEKINGSFORMULIER, ...d.widget_config.boekingsformulier });
        }
      })
      .finally(() => setLoading(false));
  }, [calendarId]);

  const save = useCallback(
    async (updated: BoekingsformulierConfig) => {
      setSaving(true);
      await fetch(`/api/widget/${calendarId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "boekingsformulier", config: updated }),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [calendarId]
  );

  function update(partial: Partial<BoekingsformulierConfig>) {
    const updated = { ...config, ...partial };
    setConfig(updated);
    save(updated);
  }

  function addVrijVeld() {
    if (!newVeld.naam.trim()) return;
    const updated = { ...config, vrije_velden: [...config.vrije_velden, newVeld] };
    setConfig(updated);
    save(updated);
    setNewVeld({ naam: "", breedte: "vol", verplicht: false });
  }

  function removeVrijVeld(idx: number) {
    const updated = {
      ...config,
      vrije_velden: config.vrije_velden.filter((_, i) => i !== idx),
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
          <h1 className="text-xl font-semibold text-warm-900">Boekingsformulier</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Stel in welke velden gasten moeten invullen bij een boeking.
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
        {saving && (
          <span className="text-sm text-warm-400">Bezig met bewaren...</span>
        )}
      </div>

      {/* Contactgegevens */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Contactgegevens
        </h2>
        <FieldRow
          label="Adres"
          tonen={config.adres_tonen}
          verplicht={config.adres_verplicht}
          onToggleTonen={(v) => update({ adres_tonen: v, adres_verplicht: v ? config.adres_verplicht : false })}
          onToggleVerplicht={(v) => update({ adres_verplicht: v })}
        />
        <FieldRow
          label="Telefoon"
          tonen={config.telefoon_tonen}
          verplicht={config.telefoon_verplicht}
          onToggleTonen={(v) => update({ telefoon_tonen: v, telefoon_verplicht: v ? config.telefoon_verplicht : false })}
          onToggleVerplicht={(v) => update({ telefoon_verplicht: v })}
        />
        <FieldRow
          label="Land"
          tonen={config.land_tonen}
          verplicht={config.land_verplicht}
          onToggleTonen={(v) => update({ land_tonen: v, land_verplicht: v ? config.land_verplicht : false })}
          onToggleVerplicht={(v) => update({ land_verplicht: v })}
        />
        <FieldRow
          label="Aantekeningen"
          tonen={config.aantekeningen_tonen}
          verplicht={false}
          onToggleTonen={(v) => update({ aantekeningen_tonen: v })}
          onToggleVerplicht={() => {}}
          showVerplicht={false}
        />
      </div>

      {/* Aantal personen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Aantal personen
        </h2>
        <div className="space-y-2">
          {(
            [
              { value: "niet_vragen", label: "Niet vragen" },
              { value: "aantal_personen", label: "Aantal personen" },
              { value: "volwassenen_en_kinderen", label: "Volwassenen en kinderen apart" },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="radio"
                name="aantal_personen"
                value={opt.value}
                checked={config.aantal_personen === opt.value}
                onChange={() => update({ aantal_personen: opt.value })}
                className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
              />
              <span className="text-sm text-warm-800">{opt.label}</span>
            </label>
          ))}
        </div>

        {config.aantal_personen !== "niet_vragen" && (
          <div className="mt-5 pt-5 border-t border-warm-100 grid grid-cols-2 gap-4">
            {config.aantal_personen === "volwassenen_en_kinderen" ? (
              <>
                <div>
                  <label className="block text-xs text-warm-500 mb-1">Max. volwassenen</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={config.max_volwassenen}
                    onChange={(e) => update({ max_volwassenen: Number(e.target.value) })}
                    className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-500 mb-1">Max. kinderen</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={config.max_kinderen}
                    onChange={(e) => update({ max_kinderen: Number(e.target.value) })}
                    className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-500 mb-1">Max. totaal</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={config.max_totaal}
                    onChange={(e) => update({ max_totaal: Number(e.target.value) })}
                    className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-500 mb-1">
                    Kind = jonger dan (jaar)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={21}
                    value={config.leeftijd_kind}
                    onChange={(e) => update({ leeftijd_kind: Number(e.target.value) })}
                    className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs text-warm-500 mb-1">Max. personen</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={config.max_totaal}
                  onChange={(e) => update({ max_totaal: Number(e.target.value) })}
                  className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vrije velden */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-1">
          Extra velden
        </h2>
        <p className="text-xs text-warm-500 mb-4">
          Voeg eigen velden toe aan het boekingsformulier.
        </p>

        {config.vrije_velden.length > 0 && (
          <div className="mb-4 space-y-2">
            {config.vrije_velden.map((veld, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg border border-warm-100"
              >
                <span className="flex-1 text-sm text-warm-800">{veld.naam}</span>
                <span className="text-xs text-warm-500 bg-white px-2 py-0.5 rounded border border-warm-200">
                  {veld.breedte === "vol" ? "Volledig" : "Half"}
                </span>
                {veld.verplicht && (
                  <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                    Verplicht
                  </span>
                )}
                <button
                  onClick={() => removeVrijVeld(idx)}
                  className="text-warm-400 hover:text-warm-700 transition-colors"
                  aria-label="Verwijder veld"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-warm-500 mb-1">Veldnaam</label>
            <input
              type="text"
              placeholder="bijv. Rekeningnummer"
              value={newVeld.naam}
              onChange={(e) => setNewVeld({ ...newVeld, naam: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addVrijVeld()}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-warm-500 mb-1">Breedte</label>
            <select
              value={newVeld.breedte}
              onChange={(e) =>
                setNewVeld({ ...newVeld, breedte: e.target.value as "half" | "vol" })
              }
              className="w-full border border-warm-200 rounded-lg px-2 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            >
              <option value="vol">Volledig</option>
              <option value="half">Half</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <input
              type="checkbox"
              id="verplicht-nieuw"
              checked={newVeld.verplicht}
              onChange={(e) => setNewVeld({ ...newVeld, verplicht: e.target.checked })}
              className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent"
            />
            <label htmlFor="verplicht-nieuw" className="text-xs text-warm-600 cursor-pointer">
              Verplicht
            </label>
          </div>
          <button
            onClick={addVrijVeld}
            disabled={!newVeld.naam.trim()}
            className="px-3 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Toevoegen
          </button>
        </div>
      </div>
    </div>
  );
}
