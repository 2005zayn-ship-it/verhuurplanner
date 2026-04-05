"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const KLEUREN = [
  "#1d6fa4", "#2d9d6e", "#e05c2a", "#8b5cf6", "#e0a82a", "#e05c8a", "#3b82f6", "#64748b",
];

export default function NieuweKalenderPage() {
  const router = useRouter();
  const [naam, setNaam] = useState("");
  const [woningNaam, setWoningNaam] = useState("");
  const [kleur, setKleur] = useState(KLEUREN[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data, error } = await supabase
      .from("calendars")
      .insert({ naam, woning_naam: woningNaam || null, kleur, user_id: user.id })
      .select()
      .single();

    if (error) {
      setError("Er ging iets mis. Probeer opnieuw.");
      setLoading(false);
      return;
    }
    router.push(`/dashboard/kalender/${data.id}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-900 mb-8 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        Terug naar dashboard
      </Link>

      <h1 className="text-2xl font-bold text-warm-900 mb-8">Nieuwe kalender aanmaken</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1.5">Naam van de kalender <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            required
            placeholder="bv. Chalet de Ardennen"
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1.5">Naam van de woning (optioneel)</label>
          <input
            type="text"
            value={woningNaam}
            onChange={(e) => setWoningNaam(e.target.value)}
            placeholder="bv. Rue des Forêts 12, Bouillon"
            className="w-full border border-warm-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
          <p className="text-xs text-warm-400 mt-1">Enkel zichtbaar voor jou in je dashboard.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-3">Kleur</label>
          <div className="flex gap-3 flex-wrap">
            {KLEUREN.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setKleur(c)}
                className={`w-9 h-9 rounded-full transition-transform ${kleur === c ? "scale-125 ring-2 ring-offset-2 ring-warm-400" : "hover:scale-110"}`}
                style={{ backgroundColor: c }}
                aria-label={`Kleur ${c}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
        >
          {loading ? "Aanmaken..." : "Kalender aanmaken"}
        </button>
      </form>
    </div>
  );
}
