"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "forgot";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
    if (error) {
      setError("E-mail of wachtwoord klopt niet. Probeer opnieuw.");
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/wachtwoord-reset`,
    });
    if (error) {
      setError("Er ging iets mis. Controleer je e-mailadres.");
    } else {
      setSuccess("Controleer je mailbox. We stuurden een link om je wachtwoord te resetten.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-warm-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-accent mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
            <span className="font-bold text-lg text-warm-900">Verhuurplanner</span>
          </Link>
          <h1 className="text-2xl font-bold text-warm-900">
            {mode === "login" ? "Inloggen" : "Wachtwoord vergeten"}
          </h1>
          <p className="text-warm-500 text-sm mt-1">
            {mode === "login"
              ? "Welkom terug."
              : "Vul je e-mailadres in. We sturen je een resetlink."}
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
            {success}
          </div>
        ) : (
          <form onSubmit={mode === "login" ? handleLogin : handleForgot} className="space-y-4">
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

            {mode === "login" && (
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Wachtwoord</label>
                <input
                  type="password"
                  value={wachtwoord}
                  onChange={(e) => setWachtwoord(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {loading ? "Even wachten..." : mode === "login" ? "Inloggen" : "Resetlink versturen"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm space-y-2">
          {mode === "login" ? (
            <>
              <button onClick={() => { setMode("forgot"); setError(""); }} className="text-accent hover:underline block w-full">
                Wachtwoord vergeten?
              </button>
              <p className="text-warm-500">
                Nog geen account?{" "}
                <Link href="/aanmelden" className="text-accent hover:underline font-medium">
                  Gratis aanmelden
                </Link>
              </p>
            </>
          ) : (
            <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-accent hover:underline">
              Terug naar inloggen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
