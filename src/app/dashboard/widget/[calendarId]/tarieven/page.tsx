"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { CalendarTarief, CalendarDienst, TarievenConfig } from "@/lib/types";

const DAGEN = [
  { label: "Ma", value: 1 },
  { label: "Di", value: 2 },
  { label: "Wo", value: 3 },
  { label: "Do", value: 4 },
  { label: "Vr", value: 5 },
  { label: "Za", value: 6 },
  { label: "Zo", value: 7 },
];

const DEFAULT_CONFIG: TarievenConfig = {
  beschrijving: "",
  prijs_per: "per_boeking",
  datums_zonder_prijs: "boekbaar",
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-warm-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          placeholder="—"
          className="w-full border border-warm-200 rounded-lg pl-7 pr-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
        />
      </div>
    </div>
  );
}

function DagSelector({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: number[];
  onChange: (v: number[]) => void;
}) {
  function toggle(dag: number) {
    const next = selected.includes(dag)
      ? selected.filter((d) => d !== dag)
      : [...selected, dag].sort();
    onChange(next);
  }
  return (
    <div>
      <label className="block text-xs text-warm-600 mb-2">{label}</label>
      <div className="flex gap-1.5">
        {DAGEN.map((d) => {
          const active = selected.includes(d.value);
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => toggle(d.value)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                active ? "bg-accent text-white" : "bg-warm-100 text-warm-600 hover:bg-warm-200"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Periode modal (afwijkende tarieven)
// ──────────────────────────────────────────────

type PeriodeForm = Omit<CalendarTarief, "id" | "calendar_id" | "created_at" | "is_standaard" | "volgorde">;

const EMPTY_PERIODE: PeriodeForm = {
  naam: "",
  van_datum: null,
  tot_datum: null,
  prijs_nacht: null,
  prijs_weekend: null,
  prijs_lang_weekend: null,
  prijs_midweek: null,
  prijs_week: null,
  prijs_14nachten: null,
  prijs_21nachten: null,
  prijs_maand: null,
  aankomst_dagen: [1, 2, 3, 4, 5, 6, 7],
  vertrek_dagen: [1, 2, 3, 4, 5, 6, 7],
  min_nachten: 1,
  max_nachten: null,
  actief: true,
};

function PeriodeModal({
  periode,
  onSave,
  onClose,
}: {
  periode: CalendarTarief | null;
  onSave: (data: PeriodeForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PeriodeForm>(
    periode
      ? {
          naam: periode.naam,
          van_datum: periode.van_datum,
          tot_datum: periode.tot_datum,
          prijs_nacht: periode.prijs_nacht,
          prijs_weekend: periode.prijs_weekend,
          prijs_lang_weekend: periode.prijs_lang_weekend,
          prijs_midweek: periode.prijs_midweek,
          prijs_week: periode.prijs_week,
          prijs_14nachten: periode.prijs_14nachten,
          prijs_21nachten: periode.prijs_21nachten,
          prijs_maand: periode.prijs_maand,
          aankomst_dagen: periode.aankomst_dagen,
          vertrek_dagen: periode.vertrek_dagen,
          min_nachten: periode.min_nachten,
          max_nachten: periode.max_nachten,
          actief: periode.actief,
        }
      : { ...EMPTY_PERIODE }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-warm-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-warm-900">
            {periode ? "Periode bewerken" : "Periode toevoegen"}
          </h2>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">Naam</label>
            <input
              type="text"
              value={form.naam}
              onChange={(e) => setForm({ ...form, naam: e.target.value })}
              placeholder="bijv. Zomertarief"
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">Geldig van — tot</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-warm-500 mb-1">Vanaf</label>
                <input
                  type="date"
                  value={form.van_datum ?? ""}
                  onChange={(e) => setForm({ ...form, van_datum: e.target.value || null })}
                  className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-warm-500 mb-1">Tot en met</label>
                <input
                  type="date"
                  value={form.tot_datum ?? ""}
                  onChange={(e) => setForm({ ...form, tot_datum: e.target.value || null })}
                  className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-3">Prijzen</label>
            <div className="grid grid-cols-2 gap-3">
              <PriceInput label="Per nacht" value={form.prijs_nacht} onChange={(v) => setForm({ ...form, prijs_nacht: v })} />
              <PriceInput label="Weekend (vr–zo)" value={form.prijs_weekend} onChange={(v) => setForm({ ...form, prijs_weekend: v })} />
              <PriceInput label="Lang weekend (vr–ma)" value={form.prijs_lang_weekend} onChange={(v) => setForm({ ...form, prijs_lang_weekend: v })} />
              <PriceInput label="Midweek (ma–vr)" value={form.prijs_midweek} onChange={(v) => setForm({ ...form, prijs_midweek: v })} />
              <PriceInput label="Week (7 nachten)" value={form.prijs_week} onChange={(v) => setForm({ ...form, prijs_week: v })} />
              <PriceInput label="14 nachten" value={form.prijs_14nachten} onChange={(v) => setForm({ ...form, prijs_14nachten: v })} />
              <PriceInput label="21 nachten" value={form.prijs_21nachten} onChange={(v) => setForm({ ...form, prijs_21nachten: v })} />
              <PriceInput label="Maand" value={form.prijs_maand} onChange={(v) => setForm({ ...form, prijs_maand: v })} />
            </div>
          </div>

          <DagSelector label="Aankomstdagen" selected={form.aankomst_dagen} onChange={(v) => setForm({ ...form, aankomst_dagen: v })} />
          <DagSelector label="Vertrekdagen" selected={form.vertrek_dagen} onChange={(v) => setForm({ ...form, vertrek_dagen: v })} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Min. nachten</label>
              <input
                type="number"
                min={1}
                value={form.min_nachten}
                onChange={(e) => setForm({ ...form, min_nachten: Number(e.target.value) })}
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Max. nachten</label>
              <input
                type="number"
                min={1}
                value={form.max_nachten ?? ""}
                onChange={(e) => setForm({ ...form, max_nachten: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="—"
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.actief}
              onChange={(e) => setForm({ ...form, actief: e.target.checked })}
              className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent"
            />
            <span className="text-sm text-warm-800">Periode is actief</span>
          </label>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-warm-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-warm-200 text-warm-700 text-sm font-medium rounded-xl hover:bg-warm-50 transition-colors">
            Annuleren
          </button>
          <button
            onClick={() => { if (!form.naam.trim()) return; onSave(form); }}
            disabled={!form.naam.trim()}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
          >
            Bewaren
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Dienst modal
// ──────────────────────────────────────────────

const EMPTY_DIENST: Omit<CalendarDienst, "id" | "calendar_id" | "created_at"> = {
  naam: "",
  omschrijving: null,
  actief: true,
  verplicht: false,
  optie_type: "ja_nee",
  frequentie: "per_boeking",
  prijs: 0,
  btw_percentage: 0,
  korting_meenemen: false,
  volgorde: 0,
};

function DienstModal({
  dienst,
  onSave,
  onClose,
}: {
  dienst: Partial<CalendarDienst> | null;
  onSave: (data: Omit<CalendarDienst, "id" | "calendar_id" | "created_at">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_DIENST, ...(dienst ?? {}) });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-warm-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-warm-900">
            {dienst && "id" in dienst && dienst.id ? "Dienst bewerken" : "Dienst toevoegen"}
          </h2>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">Naam</label>
            <input type="text" value={form.naam} onChange={(e) => setForm({ ...form, naam: e.target.value })} placeholder="bijv. Eindschoonmaak"
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">Omschrijving (optioneel)</label>
            <input type="text" value={form.omschrijving ?? ""} onChange={(e) => setForm({ ...form, omschrijving: e.target.value || null })} placeholder="Extra toelichting voor de gast"
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Prijs</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 text-sm">€</span>
                <input type="number" min={0} step={0.01} value={form.prijs} onChange={(e) => setForm({ ...form, prijs: Number(e.target.value) })}
                  className="w-full border border-warm-200 rounded-lg pl-7 pr-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">BTW %</label>
              <input type="number" min={0} max={100} value={form.btw_percentage} onChange={(e) => setForm({ ...form, btw_percentage: Number(e.target.value) })}
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">Keuze voor gast</label>
            <div className="space-y-1.5">
              {([{ value: "ja_nee", label: "Ja / Nee keuze" }, { value: "aantal", label: "Aantal invoeren" }, { value: "altijd", label: "Altijd inbegrepen" }] as const).map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="optie_type" value={opt.value} checked={form.optie_type === opt.value} onChange={() => setForm({ ...form, optie_type: opt.value })}
                    className="w-4 h-4 text-accent border-warm-300 focus:ring-accent" />
                  <span className="text-sm text-warm-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">Berekend per</label>
            <select value={form.frequentie} onChange={(e) => setForm({ ...form, frequentie: e.target.value as CalendarDienst["frequentie"] })}
              className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none">
              <option value="per_boeking">Per boeking</option>
              <option value="per_nacht">Per nacht</option>
              <option value="per_persoon">Per persoon</option>
              <option value="per_item">Per item</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.verplicht} onChange={(e) => setForm({ ...form, verplicht: e.target.checked })}
                className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent" />
              <span className="text-sm text-warm-800">Verplichte dienst</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.actief} onChange={(e) => setForm({ ...form, actief: e.target.checked })}
                className="w-4 h-4 rounded text-accent border-warm-300 focus:ring-accent" />
              <span className="text-sm text-warm-800">Dienst is actief</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-warm-100 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-warm-200 text-warm-700 text-sm font-medium rounded-xl hover:bg-warm-50 transition-colors">Annuleren</button>
          <button
            onClick={() => { if (!form.naam.trim()) return; const { id: _id, calendar_id: _cid, created_at: _cat, ...rest } = form as CalendarDienst; onSave(rest); }}
            disabled={!form.naam.trim()}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40"
          >Bewaren</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────

type StdForm = Omit<CalendarTarief, "id" | "calendar_id" | "created_at" | "naam" | "is_standaard" | "volgorde" | "van_datum" | "tot_datum">;

const DEFAULT_STD: StdForm = {
  prijs_nacht: null,
  prijs_weekend: null,
  prijs_lang_weekend: null,
  prijs_midweek: null,
  prijs_week: null,
  prijs_14nachten: null,
  prijs_21nachten: null,
  prijs_maand: null,
  aankomst_dagen: [1, 2, 3, 4, 5, 6, 7],
  vertrek_dagen: [1, 2, 3, 4, 5, 6, 7],
  min_nachten: 1,
  max_nachten: null,
  actief: true,
};

export default function TarievenPage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  // Widget-level config (beschrijving, prijs_per, datums_zonder_prijs)
  const [config, setConfig] = useState<TarievenConfig>(DEFAULT_CONFIG);
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  // Standaard tarief (inline form)
  const [standaard, setStandaard] = useState<CalendarTarief | null>(null);
  const [stdForm, setStdForm] = useState<StdForm>(DEFAULT_STD);
  const [loadingT, setLoadingT] = useState(true);
  const [stdSaving, setStdSaving] = useState(false);
  const [extendedPrices, setExtendedPrices] = useState(false);

  // Afwijkende periodes
  const [periodes, setPeriodes] = useState<CalendarTarief[]>([]);
  const [periodeEnabled, setPeriodeEnabled] = useState(false);
  const [periodeModal, setPeriodeModal] = useState<CalendarTarief | null | false>(false);

  // Diensten
  const [diensten, setDiensten] = useState<CalendarDienst[]>([]);
  const [loadingD, setLoadingD] = useState(true);
  const [dienstModal, setDienstModal] = useState<Partial<CalendarDienst> | null | false>(false);

  const stdFormRef = useRef(stdForm);
  stdFormRef.current = stdForm;
  const standaardRef = useRef(standaard);
  standaardRef.current = standaard;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Load widget config
  useEffect(() => {
    fetch(`/api/widget/${calendarId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.widget_config?.tarieven) {
          setConfig({ ...DEFAULT_CONFIG, ...d.widget_config.tarieven });
        }
      });
  }, [calendarId]);

  // Load tarieven
  const loadTarieven = useCallback(() => {
    setLoadingT(true);
    fetch(`/api/widget/${calendarId}/tarieven`)
      .then((r) => r.json())
      .then((d) => {
        const all: CalendarTarief[] = d.tarieven ?? [];
        const std = all.find((t) => t.is_standaard) ?? null;
        const per = all.filter((t) => !t.is_standaard);
        setStandaard(std);
        setPeriodes(per);
        if (per.length > 0) setPeriodeEnabled(true);
        if (std) {
          const form: StdForm = {
            prijs_nacht: std.prijs_nacht,
            prijs_weekend: std.prijs_weekend,
            prijs_lang_weekend: std.prijs_lang_weekend,
            prijs_midweek: std.prijs_midweek,
            prijs_week: std.prijs_week,
            prijs_14nachten: std.prijs_14nachten,
            prijs_21nachten: std.prijs_21nachten,
            prijs_maand: std.prijs_maand,
            aankomst_dagen: std.aankomst_dagen,
            vertrek_dagen: std.vertrek_dagen,
            min_nachten: std.min_nachten,
            max_nachten: std.max_nachten,
            actief: std.actief,
          };
          setStdForm(form);
          stdFormRef.current = form;
          const hasExtra = !!(std.prijs_weekend || std.prijs_midweek || std.prijs_week || std.prijs_lang_weekend || std.prijs_14nachten || std.prijs_21nachten || std.prijs_maand);
          setExtendedPrices(hasExtra);
        }
      })
      .finally(() => setLoadingT(false));
  }, [calendarId]);

  const loadDiensten = useCallback(() => {
    setLoadingD(true);
    fetch(`/api/widget/${calendarId}/diensten`)
      .then((r) => r.json())
      .then((d) => setDiensten(d.diensten ?? []))
      .finally(() => setLoadingD(false));
  }, [calendarId]);

  useEffect(() => {
    loadTarieven();
    loadDiensten();
  }, [loadTarieven, loadDiensten]);

  // Auto-save widget config
  async function saveConfig(updated: TarievenConfig) {
    setConfigSaving(true);
    await fetch(`/api/widget/${calendarId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "tarieven", config: updated }),
    });
    setConfigSaving(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  }

  // Debounced auto-save for standaard tarief
  function scheduleStdSave() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setStdSaving(true);
      const data = stdFormRef.current;
      const existing = standaardRef.current;
      if (existing) {
        await fetch(`/api/widget/${calendarId}/tarieven`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: existing.id, ...data }),
        });
      } else {
        const res = await fetch(`/api/widget/${calendarId}/tarieven`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ naam: "Standaardprijs", is_standaard: true, volgorde: 0, van_datum: null, tot_datum: null, ...data }),
        });
        const json = await res.json();
        if (json.tarief) {
          setStandaard(json.tarief);
          standaardRef.current = json.tarief;
        }
      }
      setStdSaving(false);
    }, 600);
  }

  function updateStd<K extends keyof StdForm>(key: K, value: StdForm[K]) {
    setStdForm((prev) => {
      const next = { ...prev, [key]: value };
      stdFormRef.current = next;
      scheduleStdSave();
      return next;
    });
  }

  // Periodes CRUD
  async function savePeriode(data: PeriodeForm) {
    const isEdit = periodeModal && (periodeModal as CalendarTarief).id;
    if (isEdit) {
      await fetch(`/api/widget/${calendarId}/tarieven`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: (periodeModal as CalendarTarief).id, ...data }),
      });
    } else {
      await fetch(`/api/widget/${calendarId}/tarieven`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, is_standaard: false, volgorde: periodes.length }),
      });
    }
    setPeriodeModal(false);
    loadTarieven();
  }

  async function deletePeriode(id: string) {
    if (!confirm("Periode verwijderen?")) return;
    await fetch(`/api/widget/${calendarId}/tarieven?id=${id}`, { method: "DELETE" });
    loadTarieven();
  }

  // Diensten CRUD
  async function saveDienst(data: Omit<CalendarDienst, "id" | "calendar_id" | "created_at">) {
    const isEdit = dienstModal && "id" in dienstModal && dienstModal.id;
    if (isEdit) {
      await fetch(`/api/widget/${calendarId}/diensten`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: (dienstModal as CalendarDienst).id, ...data }),
      });
    } else {
      await fetch(`/api/widget/${calendarId}/diensten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setDienstModal(false);
    loadDiensten();
  }

  async function deleteDienst(id: string) {
    if (!confirm("Dienst verwijderen?")) return;
    await fetch(`/api/widget/${calendarId}/diensten?id=${id}`, { method: "DELETE" });
    loadDiensten();
  }

  function formatPeriode(t: CalendarTarief) {
    if (t.van_datum && t.tot_datum) return `${t.van_datum} — ${t.tot_datum}`;
    return t.van_datum ? `Vanaf ${t.van_datum}` : "Altijd";
  }

  function prijsSummary(t: Pick<CalendarTarief, "prijs_nacht" | "prijs_week" | "prijs_weekend" | "prijs_14nachten" | "prijs_maand">): string {
    const parts: string[] = [];
    if (t.prijs_nacht) parts.push(`€${t.prijs_nacht}/nacht`);
    if (t.prijs_week) parts.push(`€${t.prijs_week}/week`);
    if (t.prijs_weekend) parts.push(`€${t.prijs_weekend}/weekend`);
    if (t.prijs_14nachten) parts.push(`€${t.prijs_14nachten}/14n`);
    if (t.prijs_maand) parts.push(`€${t.prijs_maand}/maand`);
    return parts.length > 0 ? parts.slice(0, 3).join(" · ") : "Geen prijzen ingesteld";
  }

  if (loadingT) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* ── Section 1: Widget-level instellingen ── */}
      <section className="bg-white rounded-2xl border border-warm-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-warm-900">Tarieven</h1>
          <div className="flex items-center gap-2 text-sm">
            {configSaved && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                Bewaard
              </span>
            )}
            {configSaving && <span className="text-warm-400">Bewaren...</span>}
          </div>
        </div>

        {/* Beschrijving */}
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Beschrijving</label>
          <p className="text-xs text-warm-400 mb-2">Vrije tekst die bovenaan het tariefoverzicht in de widget wordt getoond.</p>
          <textarea
            value={config.beschrijving}
            onChange={(e) => {
              const updated = { ...config, beschrijving: e.target.value };
              setConfig(updated);
              saveConfig(updated);
            }}
            rows={3}
            placeholder="bijv. Alle prijzen zijn inclusief verwarming en electriciteit."
            className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-none"
          />
        </div>

        {/* Prijs per */}
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2">Prijs per</label>
          <div className="flex gap-4">
            {([["per_boeking", "Per boeking"], ["per_persoon", "Per persoon"]] as const).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="prijs_per"
                  value={val}
                  checked={config.prijs_per === val}
                  onChange={() => {
                    const updated = { ...config, prijs_per: val };
                    setConfig(updated);
                    saveConfig(updated);
                  }}
                  className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-sm text-warm-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Datums zonder prijs */}
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2">Datums zonder prijs behandelen als</label>
          <div className="flex gap-4">
            {([["boekbaar", "Boekbare datum"], ["bezet", "Bezette datum"]] as const).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="datums_zonder_prijs"
                  value={val}
                  checked={config.datums_zonder_prijs === val}
                  onChange={() => {
                    const updated = { ...config, datums_zonder_prijs: val };
                    setConfig(updated);
                    saveConfig(updated);
                  }}
                  className="w-4 h-4 text-accent border-warm-300 focus:ring-accent"
                />
                <span className="text-sm text-warm-800">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Standaardprijzen ── */}
      <section className="bg-white rounded-2xl border border-warm-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-warm-900">Standaardprijzen</h2>
            <p className="text-xs text-warm-500 mt-0.5">Gelden voor alle periodes tenzij je een afwijking instelt.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {stdSaving && <span className="text-warm-400 text-xs">Bewaren...</span>}
          </div>
        </div>

        {/* Prijs per nacht */}
        <div className="max-w-xs">
          <PriceInput
            label="Prijs per nacht"
            value={stdForm.prijs_nacht}
            onChange={(v) => updateStd("prijs_nacht", v)}
          />
        </div>

        {/* Extended prices toggle */}
        <div>
          <button
            type="button"
            onClick={() => setExtendedPrices((v) => !v)}
            className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${extendedPrices ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {extendedPrices ? "Minder prijsopties tonen" : "Afwijkende prijzen per verblijfstype instellen"}
          </button>
        </div>

        {extendedPrices && (
          <div className="space-y-4 pt-2 border-t border-warm-100">
            <div className="grid grid-cols-2 gap-3">
              <PriceInput label="Weekend (vr–zo)" value={stdForm.prijs_weekend} onChange={(v) => updateStd("prijs_weekend", v)} />
              <PriceInput label="Lang weekend (vr–ma)" value={stdForm.prijs_lang_weekend} onChange={(v) => updateStd("prijs_lang_weekend", v)} />
              <PriceInput label="Midweek (ma–vr)" value={stdForm.prijs_midweek} onChange={(v) => updateStd("prijs_midweek", v)} />
              <PriceInput label="Week (7 nachten)" value={stdForm.prijs_week} onChange={(v) => updateStd("prijs_week", v)} />
              <PriceInput label="14 nachten" value={stdForm.prijs_14nachten} onChange={(v) => updateStd("prijs_14nachten", v)} />
              <PriceInput label="21 nachten" value={stdForm.prijs_21nachten} onChange={(v) => updateStd("prijs_21nachten", v)} />
              <PriceInput label="Maand" value={stdForm.prijs_maand} onChange={(v) => updateStd("prijs_maand", v)} />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-warm-100 space-y-4">
          <DagSelector label="Aankomstdagen" selected={stdForm.aankomst_dagen} onChange={(v) => updateStd("aankomst_dagen", v)} />
          <DagSelector label="Vertrekdagen" selected={stdForm.vertrek_dagen} onChange={(v) => updateStd("vertrek_dagen", v)} />

          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <div>
              <label className="block text-xs text-warm-500 mb-1">Min. nachten</label>
              <input
                type="number"
                min={1}
                value={stdForm.min_nachten}
                onChange={(e) => updateStd("min_nachten", Number(e.target.value))}
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-warm-500 mb-1">Max. nachten</label>
              <input
                type="number"
                min={1}
                value={stdForm.max_nachten ?? ""}
                onChange={(e) => updateStd("max_nachten", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="—"
                className="w-full border border-warm-200 rounded-lg px-3 py-1.5 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Afwijkende periodes ── */}
      <section className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-warm-900">Afwijkende prijsperiodes</h2>
            <p className="text-xs text-warm-500 mt-0.5">
              Stel andere prijzen in voor specifieke periodes, bijv. zomer of kerst.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!periodeEnabled) setPeriodeEnabled(true);
              else setPeriodeModal(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
              periodeEnabled
                ? "bg-accent hover:bg-accent-hover text-white"
                : "border border-warm-200 text-warm-700 hover:bg-warm-50"
            }`}
          >
            {periodeEnabled ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Periode toevoegen
              </>
            ) : (
              "Inschakelen"
            )}
          </button>
        </div>

        {periodeEnabled && (
          <>
            {periodes.length === 0 ? (
              <div className="border-2 border-dashed border-warm-200 rounded-xl p-6 text-center">
                <p className="text-sm text-warm-500">Nog geen periodes. Klik op &ldquo;Periode toevoegen&rdquo; om te starten.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {periodes.map((p) => (
                  <div key={p.id} className={`rounded-xl border p-4 flex items-start justify-between gap-4 ${p.actief ? "border-warm-100" : "border-warm-100 opacity-60"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-warm-900 text-sm">{p.naam}</span>
                        {!p.actief && <span className="text-xs bg-warm-100 text-warm-500 px-2 py-0.5 rounded-full">Inactief</span>}
                      </div>
                      <p className="text-xs text-warm-500">{formatPeriode(p)}</p>
                      <p className="text-xs text-warm-600 mt-0.5">{prijsSummary(p)}</p>
                      {p.min_nachten > 1 && <p className="text-xs text-warm-400 mt-0.5">Min. {p.min_nachten} nachten</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setPeriodeModal(p)} className="p-1.5 text-warm-400 hover:text-warm-700 transition-colors" aria-label="Bewerken">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => deletePeriode(p.id)} className="p-1.5 text-warm-400 hover:text-red-500 transition-colors" aria-label="Verwijderen">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Section 4: Extra diensten ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-warm-900">Extra diensten &amp; kosten</h2>
            <p className="text-sm text-warm-500 mt-0.5">Bedragen bovenop de huurprijs, bijv. eindschoonmaak of toeristenbelasting.</p>
          </div>
          <button
            onClick={() => setDienstModal(null)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Dienst toevoegen
          </button>
        </div>

        {loadingD ? (
          <div className="flex items-center justify-center h-24 bg-white rounded-2xl border border-warm-100">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : diensten.length === 0 ? (
          <div className="bg-white rounded-2xl border border-warm-100 p-8 text-center">
            <div className="w-10 h-10 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="text-sm text-warm-600 font-medium">Nog geen diensten</p>
            <p className="text-xs text-warm-400 mt-1">bijv. eindschoonmaak, toeristenbelasting, ontbijt...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {diensten.map((d) => (
              <div key={d.id} className={`bg-white rounded-xl border p-4 flex items-start justify-between gap-4 ${d.actief ? "border-warm-100" : "border-warm-100 opacity-60"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-warm-900 text-sm">{d.naam}</span>
                    {d.verplicht && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Verplicht</span>}
                    {!d.actief && <span className="text-xs bg-warm-100 text-warm-500 px-2 py-0.5 rounded-full">Inactief</span>}
                  </div>
                  {d.omschrijving && <p className="text-xs text-warm-400 mb-0.5">{d.omschrijving}</p>}
                  <p className="text-xs text-warm-600">€{d.prijs} {({ per_boeking: "per boeking", per_nacht: "per nacht", per_persoon: "per persoon", per_item: "per item" })[d.frequentie]}{d.btw_percentage > 0 ? ` (${d.btw_percentage}% btw)` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setDienstModal(d)} className="p-1.5 text-warm-400 hover:text-warm-700 transition-colors" aria-label="Bewerken">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button onClick={() => deleteDienst(d.id)} className="p-1.5 text-warm-400 hover:text-red-500 transition-colors" aria-label="Verwijderen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {periodeModal !== false && (
        <PeriodeModal
          periode={periodeModal}
          onSave={savePeriode}
          onClose={() => setPeriodeModal(false)}
        />
      )}
      {dienstModal !== false && (
        <DienstModal
          dienst={dienstModal}
          onSave={saveDienst}
          onClose={() => setDienstModal(false)}
        />
      )}
    </div>
  );
}
