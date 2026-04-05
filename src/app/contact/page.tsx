"use client";

import { useState } from "react";
import { Metadata } from "next";

export default function ContactPage() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naam, email, bericht }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError("Er ging iets mis. Probeer opnieuw of mail ons rechtstreeks.");
      }
    } catch {
      setError("Er ging iets mis. Probeer opnieuw.");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-warm-900 mb-2">Bericht ontvangen</h2>
        <p className="text-warm-500">We antwoorden je zo snel mogelijk.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Contact</h1>
      <p className="text-warm-500 text-sm mb-8">Vragen of opmerkingen? We helpen je graag.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1.5">Naam</label>
          <input type="text" value={naam} onChange={e => setNaam(e.target.value)} required placeholder="Jan Janssen"
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1.5">E-mailadres</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jouw@email.be"
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1.5">Bericht</label>
          <textarea value={bericht} onChange={e => setBericht(e.target.value)} required rows={5} placeholder="Jouw vraag of opmerking..."
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
          {loading ? "Versturen..." : "Bericht versturen"}
        </button>
      </form>

      <p className="text-center text-sm text-warm-400 mt-6">
        Of mail rechtstreeks naar{" "}
        <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>
      </p>
    </div>
  );
}
