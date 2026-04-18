"use client";

import { useState, useEffect } from "react";

export default function CookieResetButton() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(localStorage.getItem("cookie_consent"));
  }, []);

  function reset() {
    localStorage.removeItem("cookie_consent");
    setCurrent(null);
    window.location.reload();
  }

  function setDeclined() {
    localStorage.setItem("cookie_consent", "declined");
    setCurrent("declined");
    // Remove GA cookies by setting them expired
    document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }

  if (current === null) {
    return (
      <p className="text-sm text-warm-400">Nog geen cookievoorkeur ingesteld.</p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <span className="text-sm text-warm-600">
        Huidige voorkeur: <strong>{current === "accepted" ? "Alle cookies geaccepteerd" : "Enkel noodzakelijke cookies"}</strong>
      </span>
      <div className="flex gap-2">
        {current === "accepted" && (
          <button
            onClick={setDeclined}
            className="px-4 py-2 text-sm border border-warm-200 text-warm-700 hover:bg-warm-50 rounded-xl transition-colors"
          >
            Analytische cookies weigeren
          </button>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors"
        >
          Voorkeur opnieuw instellen
        </button>
      </div>
    </div>
  );
}
