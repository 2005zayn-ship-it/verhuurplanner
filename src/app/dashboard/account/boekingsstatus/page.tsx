"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CustomStatus {
  naam: string;
  kleur: string;
}

interface CustomBron {
  naam: string;
  kleur: string;
}

const DEFAULT_STATUSSEN = [
  { naam: "Bezet", kleur: "#ef4444", vast: true },
  { naam: "Optie", kleur: "#f59e0b", vast: true },
  { naam: "Geblokkeerd", kleur: "#94a3b8", vast: true },
];

const DEFAULT_BRONNEN = [
  "Vipio",
  "Natuurhuisje",
  "Booking.com",
  "VRBO",
  "Micazu",
  "Vakantiewoningen-in-België",
  "Rechtstreeks",
  "iCal import",
  "Eigen website",
];

export default function BoekingStatusPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [customStatussen, setCustomStatussen] = useState<CustomStatus[]>([]);
  const [newStatusNaam, setNewStatusNaam] = useState("");
  const [newStatusKleur, setNewStatusKleur] = useState("#3b82f6");

  const [customBronnen, setCustomBronnen] = useState<CustomBron[]>([]);
  const [newBronNaam, setNewBronNaam] = useState("");
  const [newBronKleur, setNewBronKleur] = useState("#8b5cf6");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const { data } = await supabase
          .from("profiles")
          .select("custom_statussen, custom_bronnen")
          .eq("id", user.id)
          .single();

        if (data?.custom_statussen) setCustomStatussen(data.custom_statussen as CustomStatus[]);
        if (data?.custom_bronnen) setCustomBronnen(data.custom_bronnen as CustomBron[]);
      } catch { /* kolom bestaat mogelijk nog niet */ }

      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        custom_statussen: customStatussen,
        custom_bronnen: customBronnen,
      });
      if (error) throw error;
      setSaveMsg("Instellingen opgeslagen.");
    } catch {
      setSaveMsg("Opslaan mislukt. De kolommen custom_statussen en custom_bronnen zijn mogelijk nog niet aangemaakt in Supabase.");
    } finally {
      setSaving(false);
    }
  }

  function addStatus() {
    if (!newStatusNaam.trim()) return;
    setCustomStatussen((prev) => [...prev, { naam: newStatusNaam.trim(), kleur: newStatusKleur }]);
    setNewStatusNaam("");
  }

  function removeStatus(i: number) {
    setCustomStatussen((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addBron() {
    if (!newBronNaam.trim()) return;
    setCustomBronnen((prev) => [...prev, { naam: newBronNaam.trim(), kleur: newBronKleur }]);
    setNewBronNaam("");
  }

  function removeBron(i: number) {
    setCustomBronnen((prev) => prev.filter((_, idx) => idx !== i));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-warm-100 rounded w-48 mb-4" />
            <div className="space-y-2">
              <div className="h-9 bg-warm-50 rounded-lg" />
              <div className="h-9 bg-warm-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-warm-900">Boekingsstatus instellingen</h1>
        <p className="text-warm-500 text-sm mt-1">Beheer de statussen en bronnen voor je boekingen.</p>
      </div>

      {/* Statussen */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-warm-900 mb-4">Boekingsstatussen</h2>

        {/* Vaste statussen */}
        <div className="space-y-2 mb-5">
          {DEFAULT_STATUSSEN.map((s) => (
            <div key={s.naam} className="flex items-center gap-3 py-2.5 px-3 bg-warm-50 rounded-xl">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.kleur }} />
              <span className="text-sm font-medium text-warm-800">{s.naam}</span>
              <span className="ml-auto text-xs text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">Standaard</span>
            </div>
          ))}
        </div>

        {/* Aangepaste statussen */}
        {customStatussen.length > 0 && (
          <div className="space-y-2 mb-4">
            {customStatussen.map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 border border-warm-100 rounded-xl">
                <input
                  type="color"
                  value={s.kleur}
                  onChange={(e) => setCustomStatussen((prev) => prev.map((x, idx) => idx === i ? { ...x, kleur: e.target.value } : x))}
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm text-warm-800 flex-1">{s.naam}</span>
                <button
                  onClick={() => removeStatus(i)}
                  className="p-1 text-warm-300 hover:text-red-500 transition-colors rounded"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nieuwe status toevoegen */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={newStatusKleur}
            onChange={(e) => setNewStatusKleur(e.target.value)}
            className="w-9 h-9 rounded-lg cursor-pointer border border-warm-200 p-0.5"
          />
          <input
            className={`${inputCls} flex-1`}
            value={newStatusNaam}
            onChange={(e) => setNewStatusNaam(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatus()}
            placeholder="Naam van nieuwe status"
          />
          <button onClick={addStatus} className={btnCls}>+ Toevoegen</button>
        </div>
      </div>

      {/* Bronnen */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-warm-900 mb-4">Boekingsbron / Oorsprong</h2>

        {/* Vaste bronnen */}
        <div className="flex flex-wrap gap-2 mb-5">
          {DEFAULT_BRONNEN.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 border border-warm-100 rounded-full text-sm text-warm-700">
              {b}
              <span className="text-xs text-warm-400">(standaard)</span>
            </span>
          ))}
        </div>

        {/* Aangepaste bronnen */}
        {customBronnen.length > 0 && (
          <div className="space-y-2 mb-4">
            {customBronnen.map((b, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 border border-warm-100 rounded-xl">
                <input
                  type="color"
                  value={b.kleur}
                  onChange={(e) => setCustomBronnen((prev) => prev.map((x, idx) => idx === i ? { ...x, kleur: e.target.value } : x))}
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm text-warm-800 flex-1">{b.naam}</span>
                <button
                  onClick={() => removeBron(i)}
                  className="p-1 text-warm-300 hover:text-red-500 transition-colors rounded"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nieuwe bron toevoegen */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={newBronKleur}
            onChange={(e) => setNewBronKleur(e.target.value)}
            className="w-9 h-9 rounded-lg cursor-pointer border border-warm-200 p-0.5"
          />
          <input
            className={`${inputCls} flex-1`}
            value={newBronNaam}
            onChange={(e) => setNewBronNaam(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBron()}
            placeholder="Naam van nieuwe bron"
          />
          <button onClick={addBron} className={btnCls}>+ Toevoegen</button>
        </div>
      </div>

      {/* Opslaan */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className={`${btnCls} ${saving ? "opacity-60 cursor-not-allowed" : ""}`}>
          {saving ? "Opslaan..." : "Instellingen opslaan"}
        </button>
        {saveMsg && (
          <p className={`text-sm ${saveMsg.includes("mislukt") ? "text-red-600" : "text-green-700"}`}>{saveMsg}</p>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white placeholder:text-warm-300 transition-colors";
const btnCls = "bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap";
