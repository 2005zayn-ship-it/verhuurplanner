"use client";

import { useEffect, useState, useRef } from "react";

interface FacturatieProfiel {
  bedrijfsnaam?: string;
  btw_nummer?: string;
  adres?: string;
  postcode?: string;
  gemeente?: string;
  telefoon?: string;
  facturatie_email?: string;
  iban?: string;
  bic?: string;
}

const EMPTY: FacturatieProfiel = {
  bedrijfsnaam: "",
  btw_nummer: "",
  adres: "",
  postcode: "",
  gemeente: "",
  telefoon: "",
  facturatie_email: "",
  iban: "",
  bic: "",
};

export default function FacturatiePage() {
  const [form, setForm] = useState<FacturatieProfiel>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/account/facturatie-profiel")
      .then((r) => r.json())
      .then((d) => setForm({ ...EMPTY, ...d.profiel }))
      .finally(() => setLoading(false));
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function update<K extends keyof FacturatieProfiel>(key: K, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      await fetch("/api/account/facturatie-profiel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Facturatie</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Jouw gegevens die op de afrekening voor de eigenaar verschijnen.
          </p>
        </div>
        <div className="text-sm">
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
      </div>

      <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-warm-900">Jouw bedrijfsgegevens</h2>
        <p className="text-xs text-warm-400 -mt-2">
          Deze gegevens verschijnen als afzender bovenaan elke afrekening die je naar een eigenaar stuurt.
        </p>

        <Field label="Bedrijfsnaam of naam" value={form.bedrijfsnaam ?? ""} onChange={(v) => update("bedrijfsnaam", v)} placeholder="bijv. Vakantiebeheeer Janssen" />
        <Field label="BTW-nummer (optioneel)" value={form.btw_nummer ?? ""} onChange={(v) => update("btw_nummer", v)} placeholder="BE 0123.456.789" />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Adres" value={form.adres ?? ""} onChange={(v) => update("adres", v)} placeholder="Kerkstraat 12" />
          </div>
          <Field label="Postcode" value={form.postcode ?? ""} onChange={(v) => update("postcode", v)} placeholder="3000" />
          <Field label="Gemeente" value={form.gemeente ?? ""} onChange={(v) => update("gemeente", v)} placeholder="Leuven" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefoon" value={form.telefoon ?? ""} onChange={(v) => update("telefoon", v)} placeholder="+32 471 00 00 00" />
          <Field label="E-mail voor facturatie" value={form.facturatie_email ?? ""} onChange={(v) => update("facturatie_email", v)} placeholder="facturen@mijnbedrijf.be" />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-warm-900">Bankgegevens</h2>
        <p className="text-xs text-warm-400 -mt-2">
          Optioneel. Verschijnt onderaan de afrekening als je commissie factureert.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="IBAN" value={form.iban ?? ""} onChange={(v) => update("iban", v)} placeholder="BE68 5390 0754 7034" />
          <Field label="BIC" value={form.bic ?? ""} onChange={(v) => update("bic", v)} placeholder="TRIOBEBB" />
        </div>
      </section>

      <section className="bg-accent-light rounded-2xl px-5 py-4">
        <h3 className="text-sm font-semibold text-accent mb-1">Afrekening per woning</h3>
        <p className="text-xs text-warm-600 leading-relaxed">
          De commissie-instellingen en eigenaargegevens stel je per woning in. Ga naar een kalender en klik op &ldquo;Afrekening&rdquo; om een afrekening te genereren.
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-warm-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-800 focus:ring-1 focus:ring-accent focus:border-accent outline-none"
      />
    </div>
  );
}
