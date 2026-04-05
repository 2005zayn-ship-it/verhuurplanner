"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner({ gaId }: { gaId?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
    if (consent === "accepted" && gaId) loadGA(gaId);
  }, [gaId]);

  function loadGA(id: string) {
    if (document.getElementById("ga-script")) return;
    const s1 = document.createElement("script");
    s1.id = "ga-script";
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s1.async = true;
    document.head.appendChild(s1);
    const s2 = document.createElement("script");
    s2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`;
    document.head.appendChild(s2);
  }

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    if (gaId) loadGA(gaId);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-900 text-warm-100 px-4 py-4 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1">
          We gebruiken cookies om de website goed te laten werken en (met jouw toestemming) bezoekersaantallen bij te houden via Google Analytics.{" "}
          <Link href="/cookiebeleid" className="underline hover:text-white">Meer info</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm border border-warm-600 text-warm-300 hover:bg-warm-800 rounded-xl transition-colors">
            Enkel noodzakelijke
          </button>
          <button onClick={accept} className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors">
            Alles accepteren
          </button>
        </div>
      </div>
    </div>
  );
}
