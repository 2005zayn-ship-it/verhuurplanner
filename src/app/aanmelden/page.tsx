"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AanmeldenPage() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [wachtwoordHerhaal, setWachtwoordHerhaal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (wachtwoord !== wachtwoordHerhaal) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }
    if (wachtwoord.length < 8) {
      setError("Je wachtwoord moet minstens 8 tekens lang zijn.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password: wachtwoord,
      options: { data: { naam } },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Dit e-mailadres is al in gebruik. Probeer in te loggen.");
      } else {
        setError("Er ging iets mis bij het aanmaken van je account. Probeer opnieuw.");
      }
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-warm-900 mb-3">Account aangemaakt</h2>
          <p className="text-warm-500 text-sm mb-6">
            Controleer je mailbox om je e-mailadres te bevestigen. Daarna kan je meteen aan de slag.
          </p>
          <Link href="/login" className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm inline-block">
            Naar inloggen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-warm-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
            <span className="font-bold text-lg text-warm-900">Verhuurplanner</span>
          </Link>
          <h1 className="text-2xl font-bold text-warm-900">Gratis account aanmaken</h1>
          <p className="text-warm-500 text-sm mt-1">Start met je eerste kalender in 2 minuten.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">Jouw naam</label>
            <input
              type="text"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              required
              placeholder="Jan Janssen"
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jouw@email.be"
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">Wachtwoord</label>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              required
              placeholder="Minimaal 8 tekens"
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">Wachtwoord herhalen</label>
            <input
              type="password"
              value={wachtwoordHerhaal}
              onChange={(e) => setWachtwoordHerhaal(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-60 mt-2"
          >
            {loading ? "Account aanmaken..." : "Gratis account aanmaken"}
          </button>

          <p className="text-xs text-warm-400 text-center">
            Door aan te melden ga je akkoord met onze{" "}
            <Link href="/voorwaarden" className="text-accent hover:underline">algemene voorwaarden</Link>{" "}
            en{" "}
            <Link href="/privacy" className="text-accent hover:underline">privacybeleid</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-warm-500 mt-6">
          Al een account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">Inloggen</Link>
        </p>
      </div>
    </div>
  );
}
