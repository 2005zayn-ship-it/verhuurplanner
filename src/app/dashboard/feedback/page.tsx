"use client";

import { useState } from "react";
import Link from "next/link";

const TYPES = [
  { value: "suggestie", label: "Suggestie", desc: "Een idee om Verhuurplanner beter te maken" },
  { value: "bug", label: "Bug melden", desc: "Iets werkt niet zoals verwacht" },
  { value: "vraag", label: "Vraag", desc: "Je hebt een vraag over een functie" },
  { value: "compliment", label: "Compliment", desc: "Iets wat je heel goed vindt" },
];

export default function FeedbackPage() {
  const [type, setType] = useState("suggestie");
  const [bericht, setBericht] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bericht.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, bericht }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Er ging iets mis");
        setStatus("error");
        return;
      }
      setStatus("success");
      setBericht("");
    } catch {
      setErrorMsg("Kon het bericht niet versturen. Probeer opnieuw.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-warm-900 mb-2">Bedankt voor je feedback!</h2>
        <p className="text-warm-500 text-sm mb-6">We lezen elke melding en nemen ze mee in de verdere ontwikkeling.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setStatus("idle")}
            className="px-5 py-2.5 rounded-xl border border-warm-200 text-warm-700 text-sm hover:bg-warm-50 transition-colors"
          >
            Nog iets melden
          </button>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors">
            Terug naar dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-warm-400 hover:text-warm-700 flex items-center gap-1.5 mb-4 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Terug naar dashboard
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Feedback geven</h1>
        <p className="text-warm-500 text-sm mt-1">Heb je een suggestie, vraag of bug gevonden? Laat het ons weten.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-3">Soort feedback</label>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  type === t.value
                    ? "border-accent bg-accent-light ring-2 ring-accent/20"
                    : "border-warm-200 bg-white hover:border-warm-300"
                }`}
              >
                <div className="text-sm font-semibold text-warm-900">{t.label}</div>
                <div className="text-xs text-warm-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2" htmlFor="bericht">
            Jouw bericht
          </label>
          <textarea
            id="bericht"
            value={bericht}
            onChange={e => { setBericht(e.target.value); if (status === "error") setStatus("idle"); }}
            rows={5}
            placeholder={
              type === "suggestie" ? "Beschrijf je idee..." :
              type === "bug" ? "Wat ging er mis? Welke stappen leidde tot het probleem?" :
              type === "vraag" ? "Stel je vraag..." :
              "Wat vind je goed?"
            }
            className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm text-warm-900 placeholder-warm-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
            required
          />
          <div className="text-xs text-warm-400 mt-1 text-right">{bericht.length}/2000</div>
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !bericht.trim()}
          className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Versturen..." : "Feedback versturen"}
        </button>
      </form>
    </div>
  );
}
