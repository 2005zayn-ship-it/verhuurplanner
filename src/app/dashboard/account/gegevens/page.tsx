"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface GegevensForm {
  voornaam: string;
  achternaam: string;
  telefoon: string;
  straat: string;
  huisnummer: string;
  postcode: string;
  woonplaats: string;
  land: string;
  accountnaam: string;
  website: string;
  btw_nummer: string;
  btw_land: string;
  sender_email: string;
  sender_name: string;
}

const EMPTY_FORM: GegevensForm = {
  voornaam: "",
  achternaam: "",
  telefoon: "",
  straat: "",
  huisnummer: "",
  postcode: "",
  woonplaats: "",
  land: "België",
  accountnaam: "",
  website: "",
  btw_nummer: "",
  btw_land: "BE",
  sender_email: "",
  sender_name: "",
};

export default function GegevensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "fout"; tekst: string } | null>(null);

  const [form, setForm] = useState<GegevensForm>(EMPTY_FORM);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailRepeat, setNewEmailRepeat] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  const [plan, setPlan] = useState<string>("basic");
  const [paymentStatus, setPaymentStatus] = useState<string>("onbetaald");
  const [autoVerlenging, setAutoVerlenging] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setPlan(data.plan ?? "basic");
        setPaymentStatus(data.payment_status ?? "onbetaald");
        setAutoVerlenging(data.automatische_verlenging ?? true);
        setForm({
          voornaam: data.voornaam ?? "",
          achternaam: data.achternaam ?? "",
          telefoon: data.telefoon ?? "",
          straat: data.straat ?? "",
          huisnummer: data.huisnummer ?? "",
          postcode: data.postcode ?? "",
          woonplaats: data.woonplaats ?? "",
          land: data.land ?? "België",
          accountnaam: data.naam ?? "",
          website: data.website ?? "",
          btw_nummer: data.btw_nummer ?? "",
          btw_land: data.btw_land ?? "BE",
          sender_email: data.sender_email ?? "",
          sender_name: data.sender_name ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function set(field: keyof GegevensForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        naam: form.accountnaam || null,
        voornaam: form.voornaam || null,
        achternaam: form.achternaam || null,
        telefoon: form.telefoon || null,
        straat: form.straat || null,
        huisnummer: form.huisnummer || null,
        postcode: form.postcode || null,
        woonplaats: form.woonplaats || null,
        land: form.land || null,
        website: form.website || null,
        btw_nummer: form.btw_nummer || null,
        btw_land: form.btw_land || null,
        sender_email: form.sender_email || null,
        sender_name: form.sender_name || null,
        automatische_verlenging: autoVerlenging,
      });

      if (error) throw error;
      setSaveMsg({ type: "ok", tekst: "Gegevens opgeslagen." });
    } catch {
      setSaveMsg({ type: "fout", tekst: "Er ging iets mis. Controleer of alle velden correct zijn ingevuld." });
    } finally {
      setSaving(false);
    }
  }

  async function handleEmailChange() {
    setEmailMsg(null);
    if (!newEmail || !newEmailRepeat) { setEmailMsg("Vul beide velden in."); return; }
    if (newEmail !== newEmailRepeat) { setEmailMsg("De e-mailadressen komen niet overeen."); return; }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMsg("Bevestigingsmail verstuurd. Controleer je inbox.");
      setNewEmail("");
      setNewEmailRepeat("");
    } catch {
      setEmailMsg("E-mailadres kon niet worden gewijzigd. Probeer opnieuw.");
    }
  }

  async function handlePasswordChange() {
    setPasswordMsg(null);
    if (!newPassword || !newPasswordRepeat) { setPasswordMsg("Vul beide velden in."); return; }
    if (newPassword !== newPasswordRepeat) { setPasswordMsg("De wachtwoorden komen niet overeen."); return; }
    if (newPassword.length < 8) { setPasswordMsg("Kies een wachtwoord van minstens 8 tekens."); return; }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg("Wachtwoord gewijzigd.");
      setNewPassword("");
      setNewPasswordRepeat("");
    } catch {
      setPasswordMsg("Wachtwoord kon niet worden gewijzigd. Probeer opnieuw.");
    }
  }

  const PLAN_LABELS: Record<string, string> = { basic: "Gratis", premium: "Lite", gold: "Pro" };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-warm-100 rounded w-40 mb-4" />
            <div className="grid grid-cols-2 gap-3">
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
        <h1 className="text-xl font-bold text-warm-900">Mijn gegevens</h1>
        <p className="text-warm-500 text-sm mt-1">Beheer je persoonlijke en bedrijfsgegevens.</p>
      </div>

      {/* Logo upload — placeholder */}
      <Section title="Account logo">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-warm-50 border border-warm-200 border-dashed flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-300">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 15l5-5 4 4 3-3 6 6" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-warm-700">Logo uploaden</p>
            <p className="text-xs text-warm-400 mt-0.5">Binnenkort beschikbaar. Je logo verschijnt in de online kalender.</p>
          </div>
        </div>
      </Section>

      {/* Persoonlijke gegevens */}
      <Section title="Persoonlijke gegevens">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Voornaam">
            <input className={inputCls} value={form.voornaam} onChange={(e) => set("voornaam", e.target.value)} placeholder="Jouw voornaam" />
          </Field>
          <Field label="Achternaam">
            <input className={inputCls} value={form.achternaam} onChange={(e) => set("achternaam", e.target.value)} placeholder="Jouw achternaam" />
          </Field>
          <Field label="Telefoon">
            <input className={inputCls} value={form.telefoon} onChange={(e) => set("telefoon", e.target.value)} placeholder="+32 4XX XX XX XX" type="tel" />
          </Field>
          <Field label="Straat">
            <input className={inputCls} value={form.straat} onChange={(e) => set("straat", e.target.value)} placeholder="Straatnaam" />
          </Field>
          <Field label="Huisnummer">
            <input className={inputCls} value={form.huisnummer} onChange={(e) => set("huisnummer", e.target.value)} placeholder="1A" />
          </Field>
          <Field label="Postcode">
            <input className={inputCls} value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="1000" />
          </Field>
          <Field label="Gemeente">
            <input className={inputCls} value={form.woonplaats} onChange={(e) => set("woonplaats", e.target.value)} placeholder="Brussel" />
          </Field>
          <Field label="Land">
            <input className={inputCls} value={form.land} onChange={(e) => set("land", e.target.value)} placeholder="België" />
          </Field>
        </div>
      </Section>

      {/* Account gegevens */}
      <Section title="Account gegevens">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Accountnaam" hint="Zichtbaar voor gasten en in e-mails">
            <input className={inputCls} value={form.accountnaam} onChange={(e) => set("accountnaam", e.target.value)} placeholder="Bijv. Vakantiehuisje Ardennen" />
          </Field>
          <Field label="Website">
            <input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://jouwsite.be" type="url" />
          </Field>
        </div>
      </Section>

      {/* E-mailadres wijzigen */}
      <Section title="Login e-mail wijzigen">
        <p className="text-sm text-warm-500 mb-4">Huidig e-mailadres: <span className="font-medium text-warm-700">{email}</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Nieuw e-mailadres">
            <input className={inputCls} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="nieuw@voorbeeld.be" type="email" />
          </Field>
          <Field label="Herhaal nieuw e-mailadres">
            <input className={inputCls} value={newEmailRepeat} onChange={(e) => setNewEmailRepeat(e.target.value)} placeholder="nieuw@voorbeeld.be" type="email" />
          </Field>
        </div>
        {emailMsg && (
          <p className={`text-sm mb-3 ${emailMsg.includes("verstuurd") ? "text-green-700" : "text-red-600"}`}>{emailMsg}</p>
        )}
        <button onClick={handleEmailChange} className={btnCls}>
          Login e-mail wijzigen
        </button>
      </Section>

      {/* Wachtwoord wijzigen */}
      <Section title="Wachtwoord wijzigen">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Nieuw wachtwoord">
            <input className={inputCls} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minstens 8 tekens" type="password" />
          </Field>
          <Field label="Herhaal nieuw wachtwoord">
            <input className={inputCls} value={newPasswordRepeat} onChange={(e) => setNewPasswordRepeat(e.target.value)} placeholder="Herhaal wachtwoord" type="password" />
          </Field>
        </div>
        {passwordMsg && (
          <p className={`text-sm mb-3 ${passwordMsg === "Wachtwoord gewijzigd." ? "text-green-700" : "text-red-600"}`}>{passwordMsg}</p>
        )}
        <button onClick={handlePasswordChange} className={btnCls}>
          Wachtwoord wijzigen
        </button>
      </Section>

      {/* Bedrijfsgegevens */}
      <Section title="Bedrijfsgegevens">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="BTW/VAT-nummer">
            <input className={inputCls} value={form.btw_nummer} onChange={(e) => set("btw_nummer", e.target.value)} placeholder="BE0123456789" />
          </Field>
          <Field label="Land van inschrijving">
            <input className={inputCls} value={form.btw_land} onChange={(e) => set("btw_land", e.target.value)} placeholder="BE" />
          </Field>
        </div>
      </Section>

      {/* E-mails vanuit eigen domein */}
      <Section title="E-mails versturen vanuit eigen domein">
        <p className="text-sm text-warm-500 mb-4">
          Verstuur e-mails vanuit je eigen domeinnaam om de kans op spam te verkleinen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Afzender e-mailadres" hint="Bijv. verhuur@jouwwoning.be">
            <input className={inputCls} value={form.sender_email} onChange={(e) => set("sender_email", e.target.value)} placeholder="verhuur@jouwwoning.be" type="email" />
          </Field>
          <Field label="Weergavenaam afzender">
            <input className={inputCls} value={form.sender_name} onChange={(e) => set("sender_name", e.target.value)} placeholder="Els Roelants" />
          </Field>
        </div>
        <div className="bg-warm-50 rounded-xl border border-warm-100 p-4 text-sm text-warm-600">
          <p className="font-medium text-warm-800 mb-2">DNS-records instellen</p>
          <p className="mb-2">Voeg deze records toe bij je domeinnaamregistrar:</p>
          <div className="space-y-1 font-mono text-xs bg-white rounded-lg border border-warm-100 p-3">
            <p><span className="text-warm-400">TXT</span> @ <span className="text-accent">v=spf1 include:verhuurplanner.be ~all</span></p>
            <p><span className="text-warm-400">CNAME</span> mail._domainkey <span className="text-accent">mail._domainkey.verhuurplanner.be</span></p>
          </div>
          <p className="mt-2 text-xs text-warm-400">Het kan tot 48 uur duren voor DNS-wijzigingen actief zijn.</p>
        </div>
      </Section>

      {/* Facturen & pakket */}
      <Section title="Facturen en pakketten">
        <div className="flex items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
            plan === "gold" ? "bg-amber-100 text-amber-700" : plan === "premium" ? "bg-accent-light text-accent" : "bg-warm-100 text-warm-600"
          }`}>
            {PLAN_LABELS[plan] ?? plan}
          </span>
          {paymentStatus === "onbetaald" && plan !== "basic" && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">Betaling openstaand</span>
          )}
        </div>

        {/* Automatische verlenging */}
        <div className="flex items-center justify-between py-3 border-t border-warm-100">
          <div>
            <p className="text-sm font-medium text-warm-800">Automatische verlenging</p>
            <p className="text-xs text-warm-400 mt-0.5">Je abonnement wordt automatisch verlengd aan het einde van de periode.</p>
          </div>
          <button
            onClick={() => setAutoVerlenging((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoVerlenging ? "bg-accent" : "bg-warm-200"}`}
            aria-pressed={autoVerlenging}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${autoVerlenging ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Facturen tabel */}
        <div className="mt-4">
          <p className="text-sm font-medium text-warm-800 mb-3">Factuurgeschiedenis</p>
          <div className="rounded-xl border border-warm-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-warm-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide">Datum</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide">Bedrag</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-warm-400 text-sm">Nog geen facturen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Opslaan */}
      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave} disabled={saving} className={`${btnCls} ${saving ? "opacity-60 cursor-not-allowed" : ""}`}>
          {saving ? "Opslaan..." : "Gegevens opslaan"}
        </button>
        {saveMsg && (
          <p className={`text-sm ${saveMsg.type === "ok" ? "text-green-700" : "text-red-600"}`}>{saveMsg.tekst}</p>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white placeholder:text-warm-300 transition-colors";
const btnCls = "bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-warm-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-warm-600 mb-1.5">
        {label}
        {hint && <span className="ml-1 text-warm-400 font-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
