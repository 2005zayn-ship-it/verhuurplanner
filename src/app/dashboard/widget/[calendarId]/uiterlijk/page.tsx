"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { WidgetUiterlijkConfig, DEFAULT_UITERLIJK } from "@/lib/types";

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
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-warm-50 last:border-0">
      <span className="text-sm text-warm-800">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-warm-50 last:border-0">
      <span className="text-sm text-warm-800">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-warm-400 font-mono">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border border-warm-200"
        />
      </div>
    </div>
  );
}

export default function UiterlijkPage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [config, setConfig] = useState<WidgetUiterlijkConfig>(DEFAULT_UITERLIJK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/widget/${calendarId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.widget_config?.uiterlijk) {
          setConfig({ ...DEFAULT_UITERLIJK, ...d.widget_config.uiterlijk });
        }
      })
      .finally(() => setLoading(false));
  }, [calendarId]);

  const save = useCallback(
    async (updated: WidgetUiterlijkConfig) => {
      setSaving(true);
      await fetch(`/api/widget/${calendarId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "uiterlijk", config: updated }),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    [calendarId]
  );

  function update(partial: Partial<WidgetUiterlijkConfig>) {
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

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Widget-uiterlijk</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Pas de kalenderweergave aan naar jouw voorkeur.
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

      {/* Kalenderinstellingen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Kalenderinstellingen
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-warm-500 mb-1">Aantal maanden</label>
            <input
              type="number"
              min={1}
              max={12}
              value={config.aantal_maanden}
              onChange={(e) => update({ aantal_maanden: Number(e.target.value) })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-warm-500 mb-1">Schaalgrootte (%)</label>
            <input
              type="number"
              min={50}
              max={150}
              step={5}
              value={config.schaalgrootte}
              onChange={(e) => update({ schaalgrootte: Number(e.target.value) })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-warm-500 mb-1">
              Min. dagen van tevoren
            </label>
            <input
              type="number"
              min={0}
              value={config.min_van_tevoren}
              onChange={(e) => update({ min_van_tevoren: Number(e.target.value) })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-warm-500 mb-1">
              Max. dagen vooraf (0 = geen limiet)
            </label>
            <input
              type="number"
              min={0}
              value={config.max_van_tevoren}
              onChange={(e) => update({ max_van_tevoren: Number(e.target.value) })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-warm-500 mb-1">Seizoen van</label>
            <input
              type="date"
              value={config.seizoen_van}
              onChange={(e) => update({ seizoen_van: e.target.value })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-warm-500 mb-1">Seizoen tot</label>
            <input
              type="date"
              value={config.seizoen_tot}
              onChange={(e) => update({ seizoen_tot: e.target.value })}
              className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
        </div>

        <div className="space-y-0">
          <ToggleRow
            label="Historiek tonen (bezette verleden datums)"
            checked={config.historiek_tonen}
            onChange={(v) => update({ historiek_tonen: v })}
          />
          <ToggleRow
            label="Navigatiemenu bovenaan"
            checked={config.navigatiemenu_boven}
            onChange={(v) => update({ navigatiemenu_boven: v })}
          />
          <ToggleRow
            label="Navigatiemenu onderaan"
            checked={config.navigatiemenu_onder}
            onChange={(v) => update({ navigatiemenu_onder: v })}
          />
          <ToggleRow
            label="Titel tonen"
            checked={config.titel_tonen}
            onChange={(v) => update({ titel_tonen: v })}
          />
          <ToggleRow
            label="Jaar-dropdown tonen"
            checked={config.dropdown_tonen}
            onChange={(v) => update({ dropdown_tonen: v })}
          />
          <ToggleRow
            label="Weeknummers tonen"
            checked={config.weeknummers_tonen}
            onChange={(v) => update({ weeknummers_tonen: v })}
          />
          <ToggleRow
            label="Verhuurplanner-logo tonen"
            checked={config.logo_tonen}
            onChange={(v) => update({ logo_tonen: v })}
          />
          <ToggleRow
            label="Legenda tonen"
            checked={config.legenda_tonen}
            onChange={(v) => update({ legenda_tonen: v })}
          />
          <ToggleRow
            label="Diagonale streep op gedeeltelijk bezette dagen"
            checked={config.diagonale_streep}
            onChange={(v) => update({ diagonale_streep: v })}
          />
          <ToggleRow
            label="Boekingswijziging via kalender"
            checked={config.kalender_wijzigen_boeking}
            onChange={(v) => update({ kalender_wijzigen_boeking: v })}
          />
          <ToggleRow
            label="Opnemen in combi-kalender"
            checked={config.in_combi_kalender}
            onChange={(v) => update({ in_combi_kalender: v })}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-warm-100">
          <label className="block text-sm font-medium text-warm-700 mb-2">Uitlijning</label>
          <div className="flex gap-4">
            {(
              [
                { value: "midden", label: "Midden" },
                { value: "links", label: "Links" },
              ] as const
            ).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="uitlijning"
                  value={opt.value}
                  checked={config.uitlijning === opt.value}
                  onChange={() => update({ uitlijning: opt.value })}
                  className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-sm text-warm-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-warm-100">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            Maanden weergave
          </label>
          <div className="flex gap-4">
            {(
              [
                { value: "naast_elkaar", label: "Naast elkaar" },
                { value: "onder_elkaar", label: "Onder elkaar" },
              ] as const
            ).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="maanden_uitlijning"
                  value={opt.value}
                  checked={config.maanden_uitlijning === opt.value}
                  onChange={() => update({ maanden_uitlijning: opt.value })}
                  className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-sm text-warm-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Kleuren & stijl */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Kleuren en stijl
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-warm-700 mb-2">Lettertype</label>
          <select
            value={config.lettertype}
            onChange={(e) => update({ lettertype: e.target.value })}
            className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          >
            {["Arial", "Verdana", "Georgia", "Times New Roman", "Courier New", "Trebuchet MS"].map(
              (f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            Bezette kleur weergave
          </label>
          <div className="flex gap-4">
            {(
              [
                { value: "een_kleur", label: "Één kleur voor alle statussen" },
                { value: "statussen", label: "Kleur per status (bezet/optie/geblokkeerd)" },
              ] as const
            ).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bezette_kleur_type"
                  value={opt.value}
                  checked={config.bezette_kleur_type === opt.value}
                  onChange={() => update({ bezette_kleur_type: opt.value })}
                  className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-sm text-warm-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <ColorInput
          label="Bezette dag kleur"
          value={config.bezette_kleur}
          onChange={(v) => update({ bezette_kleur: v })}
        />
        <ColorInput
          label="Beschikbare dag kleur"
          value={config.beschikbare_kleur}
          onChange={(v) => update({ beschikbare_kleur: v })}
        />
        <ColorInput
          label="Achtergrond widget"
          value={config.achtergrond_kleur}
          onChange={(v) => update({ achtergrond_kleur: v })}
        />
        <ColorInput
          label="Kalender achtergrond"
          value={config.kalender_achtergrond}
          onChange={(v) => update({ kalender_achtergrond: v })}
        />
        <ColorInput
          label="Vandaag cirkel"
          value={config.vandaag_cirkel_kleur}
          onChange={(v) => update({ vandaag_cirkel_kleur: v })}
        />
      </div>

      {/* Prijzen */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <h2 className="text-sm font-semibold text-warm-700 uppercase tracking-wide mb-4">
          Prijsweergave
        </h2>

        <ToggleRow
          label="Prijsindicatie tonen in kalender"
          checked={config.indicatie_prijzen}
          onChange={(v) => update({ indicatie_prijzen: v })}
        />

        {config.indicatie_prijzen && (
          <div className="mt-3 pl-3 border-l-2 border-warm-100 space-y-0">
            <ToggleRow
              label="Weekprijzen"
              checked={config.weekprijzen_tonen}
              onChange={(v) => update({ weekprijzen_tonen: v })}
            />
            <ToggleRow
              label="Midweekprijzen"
              checked={config.midweekprijzen_tonen}
              onChange={(v) => update({ midweekprijzen_tonen: v })}
            />
            <ToggleRow
              label="Lang weekendprijzen"
              checked={config.lang_weekend_prijzen_tonen}
              onChange={(v) => update({ lang_weekend_prijzen_tonen: v })}
            />
            <ToggleRow
              label="Weekendprijzen"
              checked={config.weekendprijzen_tonen}
              onChange={(v) => update({ weekendprijzen_tonen: v })}
            />
            <ToggleRow
              label="Nachtprijzen"
              checked={config.nachtprijzen_tonen}
              onChange={(v) => update({ nachtprijzen_tonen: v })}
            />
            <div className="mt-3 pt-3 border-t border-warm-50">
              <label className="block text-xs text-warm-500 mb-1">
                Standaard aantal personen voor prijsberekening
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={config.standaard_personen}
                onChange={(e) => update({ standaard_personen: Number(e.target.value) })}
                className="w-24 border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-warm-100 space-y-0">
          <ToggleRow
            label="Kortingscode-veld tonen"
            checked={config.kortingscode_veld}
            onChange={(v) => update({ kortingscode_veld: v })}
          />
          <ToggleRow
            label="Extra websiteknop tonen"
            checked={config.extra_website_knop}
            onChange={(v) => update({ extra_website_knop: v })}
          />
        </div>

        {config.extra_website_knop && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Knoptekst</label>
              <input
                type="text"
                value={config.extra_website_tekst}
                onChange={(e) => update({ extra_website_tekst: e.target.value })}
                placeholder="Website"
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">URL</label>
              <input
                type="url"
                value={config.extra_website_url}
                onChange={(e) => update({ extra_website_url: e.target.value })}
                placeholder="https://..."
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
