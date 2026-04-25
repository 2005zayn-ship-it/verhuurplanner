"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PreviewType = "kalender" | "boekingsformulier" | "combi";

export default function VoorbeeldWeergavePage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<PreviewType>("kalender");

  useEffect(() => {
    fetch(`/api/calendars/${calendarId}`)
      .then((r) => r.json())
      .then((d) => setToken(d.calendar?.public_token ?? null))
      .finally(() => setLoading(false));
  }, [calendarId]);

  const tabs: { key: PreviewType; label: string }[] = [
    { key: "kalender", label: "Kalender" },
    { key: "boekingsformulier", label: "Boekingsformulier" },
    { key: "combi", label: "Kalender + formulier" },
  ];

  const typeUrls: Record<PreviewType, string> = {
    kalender: `/widget/${token}`,
    boekingsformulier: `/widget/${token}/boeken`,
    combi: `/widget/${token}/combi`,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-warm-900">Voorbeeldweergave</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            Bekijk hoe de widget er voor gasten uitziet.
          </p>
        </div>
        {token && (
          <a
            href={typeUrls[activeType]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-warm-200 text-warm-700 text-sm font-medium rounded-xl hover:bg-warm-50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Openen in nieuw venster
          </a>
        )}
      </div>

      {/* Type selector */}
      <div className="flex gap-1 bg-warm-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveType(tab.key)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              activeType === tab.key
                ? "bg-white text-warm-900 shadow-sm"
                : "text-warm-600 hover:text-warm-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      {!token ? (
        <div className="bg-white rounded-2xl border border-warm-100 p-12 text-center">
          <div className="w-12 h-12 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-400">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <p className="text-warm-600 font-medium">Voorbeeld niet beschikbaar</p>
          <p className="text-sm text-warm-400 mt-1">
            Er kon geen kalendertoken worden opgehaald.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-100 overflow-hidden">
          {/* Browser chrome mockup */}
          <div className="bg-warm-50 border-b border-warm-100 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-warm-200" />
              <div className="w-3 h-3 rounded-full bg-warm-200" />
              <div className="w-3 h-3 rounded-full bg-warm-200" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-warm-400 font-mono border border-warm-200">
              {typeUrls[activeType]}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center bg-warm-50 z-10 pointer-events-none">
              <div className="text-center p-8">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-warm-700 font-medium mb-2">Widget wordt hier getoond</p>
                <p className="text-sm text-warm-500 mb-4 max-w-xs">
                  De live preview is beschikbaar zodra de widget-engine actief is.
                </p>
                <a
                  href={typeUrls[activeType]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Bekijk in nieuw venster
                </a>
              </div>
            </div>
            <div className="h-96 bg-warm-50" />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <p className="text-sm text-warm-700 font-medium mb-1">Hoe werkt het?</p>
        <ul className="text-xs text-warm-600 space-y-1">
          <li>1. Stel de widget in via de andere tabbladen.</li>
          <li>2. Kopieer de insluitcode en plak hem op jouw website.</li>
          <li>3. De widget toont automatisch de beschikbaarheid van jouw woning.</li>
        </ul>
      </div>
    </div>
  );
}
