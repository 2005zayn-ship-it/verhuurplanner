"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="bg-white border-b border-warm-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="11" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5" />
            </svg>
            <span className="font-bold text-warm-900 text-lg">Verhuurplanner</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/prijzen" className="text-warm-600 hover:text-warm-900 transition-colors">Prijzen</Link>
            <Link href="/faq" className="text-warm-600 hover:text-warm-900 transition-colors">FAQ</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-warm-600 hover:text-warm-900 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="text-warm-500 hover:text-warm-700 transition-colors">Uitloggen</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-warm-600 hover:text-warm-900 transition-colors">Inloggen</Link>
                <Link href="/aanmelden" className="bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm">
                  Gratis starten
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-warm-600 hover:bg-warm-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-warm-100 py-4 flex flex-col gap-4 text-sm">
            <Link href="/prijzen" className="text-warm-700" onClick={() => setMenuOpen(false)}>Prijzen</Link>
            <Link href="/faq" className="text-warm-700" onClick={() => setMenuOpen(false)}>FAQ</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-warm-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-warm-500">Uitloggen</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-warm-700" onClick={() => setMenuOpen(false)}>Inloggen</Link>
                <Link href="/aanmelden" className="bg-accent text-white font-semibold px-4 py-2 rounded-xl text-center" onClick={() => setMenuOpen(false)}>
                  Gratis starten
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
