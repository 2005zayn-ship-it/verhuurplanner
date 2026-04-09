"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function WachtwoordResetContent() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [herhaal, setHerhaal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Sessie al aanwezig (PKCE code al uitgewisseld via /auth/callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // Fallback: hash-based flow vuurt PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (wachtwoord.length < 8) {
      setError("Je wachtwoord moet minstens 8 tekens lang zijn.");
      return;
    }
    if (wachtwoord !== herhaal) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: wachtwoord });
    setLoading(false);

    if (error) {
      setError("Er ging iets mis. De resetlink is mogelijk verlopen. Vraag een nieuwe aan.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2500);
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
          <h2 className="text-xl font-bold text-warm-900 mb-2">Wachtwoord gewijzigd</h2>
          <p className="text-warm-500 text-sm">Je wordt doorgestuurd naar je dashboard...</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 w-full max-w-md p-8 text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-500 text-sm">Resetlink wordt geverifieerd...</p>
          <p className="text-warm-400 text-xs mt-3">
            Als dit lang duurt, is de link mogelijk verlopen.{" "}
            <Link href="/login" className="text-accent hover:underline">Vraag een nieuwe aan</Link>.
          </p>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-warm-900">Nieuw wachtwoord</h1>
          <p className="text-warm-500 text-sm mt-1">Kies een nieuw wachtwoord voor je account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">Nieuw wachtwoord</label>
            <input
              type="password"
              value={wachtwoord}
              onChange={(e) => setWachtwoord(e.target.value)}
              required
              placeholder="Minimaal 8 tekens"
              autoFocus
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1.5">Wachtwoord herhalen</label>
            <input
              type="password"
              value={herhaal}
              onChange={(e) => setHerhaal(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-60 mt-2"
          >
            {loading ? "Opslaan..." : "Wachtwoord opslaan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WachtwoordResetClient() {
  return (
    <Suspense>
      <WachtwoordResetContent />
    </Suspense>
  );
}
