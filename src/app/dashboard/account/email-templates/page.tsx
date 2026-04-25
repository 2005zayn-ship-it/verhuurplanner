"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Calendar } from "@/lib/types";

type Taal = "NL" | "FR" | "DE" | "EN";
const TALEN: Taal[] = ["NL", "FR", "DE", "EN"];

const MERGE_TAGS = [
  { tag: "[NAAM_GAST]", label: "Naam gast" },
  { tag: "[EMAIL_GAST]", label: "E-mail gast" },
  { tag: "[TELEFOON_GAST]", label: "Telefoon gast" },
  { tag: "[KALENDER_NAAM]", label: "Naam kalender" },
  { tag: "[START_DATUM]", label: "Startdatum boeking" },
  { tag: "[EIND_DATUM]", label: "Einddatum boeking" },
  { tag: "[AANTAL_NACHTEN]", label: "Aantal nachten" },
  { tag: "[STATUS]", label: "Boekingsstatus" },
  { tag: "[BRON]", label: "Boekingsbron" },
];

interface TaalInhoud {
  onderwerp: string;
  bericht: string;
  bijlage_url: string;
}

interface EmailTemplate {
  id: string;
  naam: string;
  inhoud: Partial<Record<Taal, TaalInhoud>>;
  is_ingepland: boolean;
  inplan_dagen: number | null;
  inplan_voor_na: string;
  inplan_datum_type: string;
  inplan_tijd_uur: number;
  inplan_tijd_minuut: number;
  inplan_kalenders: string[];
  inplan_statussen: string[];
  inplan_import_meenemen: boolean;
}

const EMPTY_TEMPLATE: Omit<EmailTemplate, "id"> = {
  naam: "",
  inhoud: {},
  is_ingepland: false,
  inplan_dagen: null,
  inplan_voor_na: "voor",
  inplan_datum_type: "startdatum",
  inplan_tijd_uur: 8,
  inplan_tijd_minuut: 0,
  inplan_kalenders: [],
  inplan_statussen: [],
  inplan_import_meenemen: false,
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [selected, setSelected] = useState<EmailTemplate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTaal, setActiveTaal] = useState<Taal>("NL");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderSaving, setSenderSaving] = useState(false);
  const [senderMsg, setSenderMsg] = useState<string | null>(null);

  const berichtRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load sender settings
      const { data: profile } = await supabase
        .from("profiles")
        .select("sender_email, sender_name")
        .eq("id", user.id)
        .single();
      if (profile) {
        setSenderEmail(profile.sender_email ?? "");
        setSenderName(profile.sender_name ?? "");
      }

      // Load calendars
      const { data: cals } = await supabase
        .from("calendars")
        .select("id, naam, kleur, woning_naam, user_id, public_token, widget_config, ical_import_urls, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setCalendars((cals as Calendar[]) ?? []);

      // Load templates
      try {
        const { data: tpls, error } = await supabase
          .from("email_templates")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        setTemplates((tpls as EmailTemplate[]) ?? []);
      } catch {
        setDbError(true);
      }

      setLoading(false);
    }
    load();
  }, []);

  function newTemplate() {
    setSelected({ id: "", ...EMPTY_TEMPLATE });
    setIsNew(true);
    setActiveTaal("NL");
    setSaveMsg(null);
  }

  function editTemplate(t: EmailTemplate) {
    setSelected({ ...t });
    setIsNew(false);
    setActiveTaal("NL");
    setSaveMsg(null);
  }

  function updateInhoud(taal: Taal, field: keyof TaalInhoud, value: string) {
    if (!selected) return;
    setSelected((prev) => {
      if (!prev) return prev;
      const current = prev.inhoud[taal] ?? { onderwerp: "", bericht: "", bijlage_url: "" };
      return {
        ...prev,
        inhoud: { ...prev.inhoud, [taal]: { ...current, [field]: value } },
      };
    });
  }

  function insertMergeTag(tag: string) {
    if (!berichtRef.current) return;
    const el = berichtRef.current;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + tag + el.value.slice(end);
    updateInhoud(activeTaal, "bericht", newVal);
    // Restore cursor
    setTimeout(() => {
      el.selectionStart = start + tag.length;
      el.selectionEnd = start + tag.length;
      el.focus();
    }, 0);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      const payload = {
        user_id: user.id,
        naam: selected.naam,
        inhoud: selected.inhoud,
        is_ingepland: selected.is_ingepland,
        inplan_dagen: selected.inplan_dagen,
        inplan_voor_na: selected.inplan_voor_na,
        inplan_datum_type: selected.inplan_datum_type,
        inplan_tijd_uur: selected.inplan_tijd_uur,
        inplan_tijd_minuut: selected.inplan_tijd_minuut,
        inplan_kalenders: selected.inplan_kalenders,
        inplan_statussen: selected.inplan_statussen,
        inplan_import_meenemen: selected.inplan_import_meenemen,
      };

      if (isNew) {
        const { data, error } = await supabase.from("email_templates").insert(payload).select().single();
        if (error) throw error;
        setTemplates((prev) => [...prev, data as EmailTemplate]);
        setSelected(data as EmailTemplate);
        setIsNew(false);
      } else {
        const { error } = await supabase.from("email_templates").update(payload).eq("id", selected.id);
        if (error) throw error;
        setTemplates((prev) => prev.map((t) => (t.id === selected.id ? { ...t, ...payload } : t)));
      }
      setSaveMsg("Template opgeslagen.");
    } catch {
      setSaveMsg("Opslaan mislukt. Voer eerst de SQL-migratie uit in Supabase.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTemplate(id: string) {
    try {
      const supabase = createClient();
      await supabase.from("email_templates").delete().eq("id", id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selected?.id === id) { setSelected(null); setIsNew(false); }
    } catch { /* silent */ }
  }

  async function handleSaveSender() {
    setSenderSaving(true);
    setSenderMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        sender_email: senderEmail || null,
        sender_name: senderName || null,
      });
      if (error) throw error;
      setSenderMsg("Instellingen opgeslagen.");
    } catch {
      setSenderMsg("Opslaan mislukt.");
    } finally {
      setSenderSaving(false);
    }
  }

  const manuele = templates.filter((t) => !t.is_ingepland);
  const ingeplande = templates.filter((t) => t.is_ingepland);

  const currentInhoud = selected?.inhoud[activeTaal] ?? { onderwerp: "", bericht: "", bijlage_url: "" };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-warm-100 rounded w-48 mb-4" />
            <div className="h-9 bg-warm-50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-warm-900">E-mail templates</h1>
        <p className="text-warm-500 text-sm mt-1">Stel automatische e-mails in voor je gasten.</p>
      </div>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Tabel aanmaken vereist.</strong> Voer de SQL-migratie uit in Supabase voor e-mail templates beschikbaar zijn.
          <pre className="mt-2 text-xs font-mono bg-white border border-amber-100 rounded-lg p-3 overflow-x-auto">
{`CREATE TABLE email_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  naam text NOT NULL,
  inhoud jsonb DEFAULT '{}' NOT NULL,
  is_ingepland boolean DEFAULT false,
  inplan_dagen integer,
  inplan_voor_na text DEFAULT 'voor',
  inplan_datum_type text DEFAULT 'startdatum',
  inplan_tijd_uur integer DEFAULT 8,
  inplan_tijd_minuut integer DEFAULT 0,
  inplan_kalenders text[] DEFAULT '{}',
  inplan_statussen text[] DEFAULT '{}',
  inplan_import_meenemen boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eigen templates" ON email_templates
  FOR ALL USING (auth.uid() = user_id);`}
          </pre>
        </div>
      )}

      {/* Eigen domein */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-warm-900 mb-1">E-mails versturen vanuit eigen domein</h2>
        <p className="text-sm text-warm-500 mb-4">Verminder de kans op spam door e-mails te versturen vanuit je eigen domeinnaam.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1.5">Afzender e-mailadres</label>
            <input
              className={inputCls}
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="verhuur@jouwwoning.be"
              type="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1.5">Weergavenaam afzender</label>
            <input
              className={inputCls}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Els Roelants"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSaveSender} disabled={senderSaving} className={btnCls}>
            {senderSaving ? "Opslaan..." : "Opslaan"}
          </button>
          {senderMsg && <p className={`text-sm ${senderMsg.includes("mislukt") ? "text-red-600" : "text-green-700"}`}>{senderMsg}</p>}
        </div>
      </div>

      {/* Templates + editor */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Lijst */}
        <div className="lg:w-64 shrink-0 space-y-4">
          <button onClick={newTemplate} className="w-full flex items-center justify-center gap-2 border border-warm-200 text-warm-700 hover:bg-warm-50 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            Template toevoegen
          </button>

          {[
            { label: "Manuele templates", list: manuele },
            { label: "Ingeplande templates", list: ingeplande },
          ].map(({ label, list }) => (
            <div key={label} className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-warm-100">
                <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider">{label}</p>
              </div>
              {list.length === 0 ? (
                <p className="px-4 py-3 text-sm text-warm-400">Geen templates</p>
              ) : (
                list.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between px-4 py-3 border-b border-warm-50 last:border-0 cursor-pointer transition-colors ${selected?.id === t.id ? "bg-accent-light" : "hover:bg-warm-50"}`}
                    onClick={() => editTemplate(t)}
                  >
                    <div>
                      <p className={`text-sm font-medium ${selected?.id === t.id ? "text-accent" : "text-warm-800"}`}>{t.naam || "Naamloze template"}</p>
                      <div className="flex gap-1 mt-1">
                        {TALEN.filter((tl) => t.inhoud[tl]?.onderwerp).map((tl) => (
                          <span key={tl} className="text-xs bg-warm-100 text-warm-600 px-1.5 py-0.5 rounded font-medium">{tl}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                      className="p-1.5 text-warm-300 hover:text-red-500 transition-colors rounded"
                      title="Verwijderen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* Editor */}
        {selected ? (
          <div className="flex-1 bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1.5">Template naam</label>
              <input
                className={inputCls}
                value={selected.naam}
                onChange={(e) => setSelected((p) => p ? { ...p, naam: e.target.value } : p)}
                placeholder="Bijv. Bevestigingsmail bij boeking"
              />
            </div>

            {/* Taal tabs */}
            <div>
              <div className="flex gap-1 border-b border-warm-100 mb-4">
                {TALEN.map((tl) => (
                  <button
                    key={tl}
                    onClick={() => setActiveTaal(tl)}
                    className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeTaal === tl
                        ? "border-accent text-accent"
                        : "border-transparent text-warm-500 hover:text-warm-700"
                    }`}
                  >
                    {tl}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-warm-600 mb-1.5">Onderwerp ({activeTaal})</label>
                  <input
                    className={inputCls}
                    value={currentInhoud.onderwerp}
                    onChange={(e) => updateInhoud(activeTaal, "onderwerp", e.target.value)}
                    placeholder="Bijv. Bevestiging jouw boeking bij [KALENDER_NAAM]"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-warm-600 mb-1.5">Bericht ({activeTaal})</label>
                    <textarea
                      ref={berichtRef}
                      className={`${inputCls} min-h-40 resize-y`}
                      value={currentInhoud.bericht}
                      onChange={(e) => updateInhoud(activeTaal, "bericht", e.target.value)}
                      placeholder="Beste [NAAM_GAST], ..."
                    />
                  </div>

                  {/* Merge tags */}
                  <div className="w-44 shrink-0">
                    <p className="text-xs font-medium text-warm-600 mb-1.5">Samenvoegvelden</p>
                    <div className="space-y-1">
                      {MERGE_TAGS.map(({ tag, label }) => (
                        <button
                          key={tag}
                          onClick={() => insertMergeTag(tag)}
                          className="w-full text-left px-2 py-1.5 text-xs bg-warm-50 hover:bg-accent-light hover:text-accent text-warm-700 rounded-lg transition-colors font-mono"
                          title={label}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-warm-600 mb-1.5">Bijlage ({activeTaal}) — max 10 MB</label>
                  <p className="text-xs text-warm-400">Bijlagen uploaden is binnenkort beschikbaar.</p>
                </div>
              </div>
            </div>

            {/* Inplannen */}
            <div className="border-t border-warm-100 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-warm-800">E-mail inplannen</p>
                  <p className="text-xs text-warm-400 mt-0.5">Verstuur automatisch op een bepaald moment.</p>
                </div>
                <button
                  onClick={() => setSelected((p) => p ? { ...p, is_ingepland: !p.is_ingepland } : p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selected.is_ingepland ? "bg-accent" : "bg-warm-200"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${selected.is_ingepland ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {selected.is_ingepland && (
                <div className="space-y-4 bg-warm-50 rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-warm-700">
                    <span>Versturen</span>
                    <input
                      type="number"
                      min={0}
                      className="w-16 px-2 py-1.5 border border-warm-200 rounded-lg text-sm text-center"
                      value={selected.inplan_dagen ?? ""}
                      onChange={(e) => setSelected((p) => p ? { ...p, inplan_dagen: parseInt(e.target.value) || 0 } : p)}
                    />
                    <span>dag(en)</span>
                    <select
                      className={`${inputCls} w-auto`}
                      value={selected.inplan_voor_na}
                      onChange={(e) => setSelected((p) => p ? { ...p, inplan_voor_na: e.target.value } : p)}
                    >
                      <option value="voor">voor</option>
                      <option value="na">na</option>
                    </select>
                    <span>de</span>
                    <select
                      className={`${inputCls} w-auto`}
                      value={selected.inplan_datum_type}
                      onChange={(e) => setSelected((p) => p ? { ...p, inplan_datum_type: e.target.value } : p)}
                    >
                      <option value="startdatum">startdatum</option>
                      <option value="einddatum">einddatum</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-warm-700">
                    <span>Verzenden om</span>
                    <input
                      type="number"
                      min={0}
                      max={23}
                      className="w-16 px-2 py-1.5 border border-warm-200 rounded-lg text-sm text-center"
                      value={selected.inplan_tijd_uur}
                      onChange={(e) => setSelected((p) => p ? { ...p, inplan_tijd_uur: parseInt(e.target.value) || 0 } : p)}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={5}
                      className="w-16 px-2 py-1.5 border border-warm-200 rounded-lg text-sm text-center"
                      value={selected.inplan_tijd_minuut}
                      onChange={(e) => setSelected((p) => p ? { ...p, inplan_tijd_minuut: parseInt(e.target.value) || 0 } : p)}
                    />
                    <span className="text-warm-400 text-xs">(servertijd)</span>
                  </div>

                  {calendars.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-warm-600 mb-2">Boekingen in kalender</p>
                      <div className="space-y-1.5">
                        {calendars.map((cal) => (
                          <label key={cal.id} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-warm-300 text-accent"
                              checked={selected.inplan_kalenders.includes(cal.id)}
                              onChange={(e) => {
                                setSelected((p) => {
                                  if (!p) return p;
                                  const list = e.target.checked
                                    ? [...p.inplan_kalenders, cal.id]
                                    : p.inplan_kalenders.filter((id) => id !== cal.id);
                                  return { ...p, inplan_kalenders: list };
                                });
                              }}
                            />
                            {cal.naam}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium text-warm-600 mb-2">Met de boekingsstatus</p>
                    <div className="flex gap-3">
                      {["bezet", "optie", "geblokkeerd"].map((s) => (
                        <label key={s} className="flex items-center gap-1.5 text-sm text-warm-700 cursor-pointer capitalize">
                          <input
                            type="checkbox"
                            className="rounded border-warm-300 text-accent"
                            checked={selected.inplan_statussen.includes(s)}
                            onChange={(e) => {
                              setSelected((p) => {
                                if (!p) return p;
                                const list = e.target.checked
                                  ? [...p.inplan_statussen, s]
                                  : p.inplan_statussen.filter((x) => x !== s);
                                return { ...p, inplan_statussen: list };
                              });
                            }}
                          />
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-warm-600 mb-2">Geïmporteerde boekingen meenemen</p>
                    <div className="flex gap-3">
                      {[false, true].map((val) => (
                        <label key={String(val)} className="flex items-center gap-1.5 text-sm text-warm-700 cursor-pointer">
                          <input
                            type="radio"
                            className="text-accent"
                            checked={selected.inplan_import_meenemen === val}
                            onChange={() => setSelected((p) => p ? { ...p, inplan_import_meenemen: val } : p)}
                          />
                          {val ? "Ja" : "Nee"}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button onClick={handleSave} disabled={saving} className={`${btnCls} ${saving ? "opacity-60 cursor-not-allowed" : ""}`}>
                {saving ? "Opslaan..." : "Template opslaan"}
              </button>
              {saveMsg && (
                <p className={`text-sm ${saveMsg.includes("mislukt") ? "text-red-600" : "text-green-700"}`}>{saveMsg}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-warm-50 rounded-2xl border border-warm-100 flex items-center justify-center min-h-64">
            <div className="text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-warm-300 mx-auto mb-3">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <p className="text-warm-400 text-sm">Selecteer een template of maak een nieuwe aan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white placeholder:text-warm-300 transition-colors";
const btnCls = "bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors";
