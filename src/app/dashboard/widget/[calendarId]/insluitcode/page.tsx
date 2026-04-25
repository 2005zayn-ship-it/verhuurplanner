"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type WidgetType = "kalender" | "boekingsformulier" | "combi";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <pre className="bg-warm-900 text-warm-100 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2.5 py-1 bg-warm-700 hover:bg-warm-600 text-warm-200 text-xs font-medium rounded-lg transition-colors"
      >
        {copied ? "Gekopieerd!" : "Kopiëren"}
      </button>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-warm-100 last:border-0">
      <span className="text-sm text-warm-700 w-40 flex-shrink-0">{label}</span>
      <span className="flex-1 text-xs text-warm-500 font-mono truncate">{url}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex-shrink-0 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
      >
        {copied ? "Gekopieerd" : "Kopiëren"}
      </button>
    </div>
  );
}

export default function InsluitcodePage() {
  const params = useParams();
  const calendarId = params.calendarId as string;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WidgetType>("kalender");

  useEffect(() => {
    fetch(`/api/calendars/${calendarId}`)
      .then((r) => r.json())
      .then((d) => setToken(d.calendar?.public_token ?? null))
      .finally(() => setLoading(false));
  }, [calendarId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-2xl">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Kon de kalendertoken niet ophalen. Herlaad de pagina.
        </div>
      </div>
    );
  }

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://verhuurplanner.be";

  const urls = {
    kalender: `${baseUrl}/widget/${token}`,
    boekingsformulier: `${baseUrl}/widget/${token}/boeken`,
    combi: `${baseUrl}/widget/${token}/combi`,
  };

  const jsCode = (type: WidgetType) =>
    `<!-- Verhuurplanner widget -->
<div id="vp-widget-${type}"></div>
<script src="${baseUrl}/widget.js" data-token="${token}" data-type="${type}" data-target="vp-widget-${type}"></script>`;

  const iframeCode = (type: WidgetType) =>
    `<iframe
  src="${urls[type]}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="no"
  title="Verhuurplanner ${type}">
</iframe>`;

  const tabs: { key: WidgetType; label: string }[] = [
    { key: "kalender", label: "Kalender" },
    { key: "boekingsformulier", label: "Boekingsformulier" },
    { key: "combi", label: "Kalender + formulier" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-warm-900">Insluitcode</h1>
        <p className="text-sm text-warm-500 mt-0.5">
          Kopieer de code en plak ze op jouw website.
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-warm-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white text-warm-900 shadow-sm"
                : "text-warm-600 hover:text-warm-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* JavaScript code */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center">
            <span className="text-amber-700 text-xs font-bold">JS</span>
          </div>
          <h2 className="text-sm font-semibold text-warm-900">JavaScript (aanbevolen)</h2>
        </div>
        <p className="text-xs text-warm-500 mb-3">
          Past zich automatisch aan aan de breedte van jouw pagina.
        </p>
        <CodeBlock code={jsCode(activeTab)} />
      </div>

      {/* iFrame code */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-700 text-xs font-bold">{`</>`}</span>
          </div>
          <h2 className="text-sm font-semibold text-warm-900">iFrame</h2>
        </div>
        <p className="text-xs text-warm-500 mb-3">
          Gebruik dit als JavaScript niet werkt op jouw platform.
        </p>
        <CodeBlock code={iframeCode(activeTab)} />
      </div>

      {/* Directe links */}
      <div className="bg-white rounded-2xl border border-warm-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warm-500">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <h2 className="text-sm font-semibold text-warm-900">Directe links</h2>
        </div>
        <p className="text-xs text-warm-500 mb-3">
          Gebruik deze links rechtstreeks als knoplink of in e-mails.
        </p>
        <LinkRow label="Kalender" url={urls.kalender} />
        <LinkRow label="Boekingsformulier" url={urls.boekingsformulier} />
        <LinkRow label="Kalender + formulier" url={urls.combi} />
      </div>

      {/* Token info */}
      <div className="bg-warm-50 rounded-xl border border-warm-100 p-4">
        <p className="text-xs text-warm-500">
          <span className="font-medium text-warm-700">Kalendertoken:</span>{" "}
          <span className="font-mono">{token}</span>
        </p>
        <p className="text-xs text-warm-400 mt-1">
          Deze token is uniek voor jouw kalender. Deel hem niet via publieke kanalen.
        </p>
      </div>
    </div>
  );
}
