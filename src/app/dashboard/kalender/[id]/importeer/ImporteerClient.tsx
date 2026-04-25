"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Props {
  calendarId: string;
  calendarNaam: string;
}

type ImportResult = {
  imported: number;
  skipped: number;
};

export default function ImporteerClient({ calendarId, calendarNaam }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const res = await fetch(`/api/calendars/${calendarId}/import-csv`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er liep iets mis bij het importeren.");
      } else {
        setResult({ imported: data.imported, skipped: data.skipped });
      }
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link
          href={`/dashboard/kalender/${calendarId}`}
          className="text-sm text-warm-400 hover:text-accent transition-colors flex items-center gap-1.5 mb-4"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Terug naar {calendarNaam}
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">
          Boekingen importeren
        </h1>
        <p className="text-warm-500 text-sm mt-1">
          Importeer je bestaande boekingen vanuit huurkalender.nl.
        </p>
      </div>

      {/* Stap-voor-stap instructies */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-warm-900 mb-5">
          Zo exporteer je je boekingen uit huurkalender.nl
        </h2>
        <ol className="space-y-4">
          {[
            "Ga naar huurkalender.nl en log in met je account.",
            'Klik rechtsboven op je naam of het "Account" menu.',
            'Kies "Gegevens downloaden" in het uitklapmenu.',
            "Selecteer de kalender of kalenders die je wilt importeren.",
            'Klik op "Downloaden". Je ontvangt een CSV-bestand.',
            "Upload dat CSV-bestand hieronder.",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-warm-700 text-sm leading-relaxed">
                {text}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 pt-5 border-t border-warm-100 bg-warm-50 rounded-xl p-4">
          <p className="text-xs text-warm-500 leading-relaxed">
            <span className="font-semibold text-warm-700">Let op:</span> het
            CSV-bestand bevat alle kalenders samen. Wanneer je meerdere woningen
            hebt in huurkalender.nl, worden alleen de boekingen met de juiste
            datums geïmporteerd. Controleer het resultaat achteraf in je
            kalender.
          </p>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-warm-900 mb-4">
          CSV-bestand uploaden
        </h2>

        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-warm-200 rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all duration-200"
        >
          <svg
            className="w-10 h-10 text-warm-300 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {file ? (
            <div>
              <p className="text-sm font-medium text-warm-900">{file.name}</p>
              <p className="text-xs text-warm-400 mt-1">
                {(file.size / 1024).toFixed(0)} KB — klik om een ander bestand
                te kiezen
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-warm-700">
                Klik om een CSV-bestand te kiezen
              </p>
              <p className="text-xs text-warm-400 mt-1">
                Alleen .csv bestanden, max 5 MB
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
              setError(null);
            }}
          />
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-800 mb-1">
              Importeren geslaagd
            </p>
            <p className="text-sm text-green-700">
              {result.imported}{" "}
              {result.imported === 1 ? "boeking" : "boekingen"} geïmporteerd
              {result.skipped > 0 &&
                `, ${result.skipped} overgeslagen (iCal-duplicaten of ongeldige rijen)`}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs text-warm-400 leading-relaxed">
            Bestaande boekingen worden niet verwijderd. Eventuele dubbels kan je
            achteraf manueel wissen.
          </p>
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="shrink-0 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Bezig..." : "Importeren"}
          </button>
        </div>

        {result && (
          <div className="mt-4 pt-4 border-t border-warm-100">
            <Link
              href={`/dashboard/kalender/${calendarId}`}
              className="text-sm text-accent hover:underline font-medium"
            >
              Bekijk het resultaat in je kalender →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
