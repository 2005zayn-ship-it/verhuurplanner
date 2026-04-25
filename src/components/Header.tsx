"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Calendar } from "@/lib/types";

const ONLINE_KALENDER_TABS = [
  { href: "boekingsformulier", label: "Boekingsformulier" },
  { href: "tarieven", label: "Tarieven & diensten" },
  { href: "reserveringsinstellingen", label: "Boekingsinstellingen" },
  { href: "uiterlijk", label: "Uiterlijk" },
  { href: "insluitcode", label: "Insluitcode" },
  { href: "taalinstellingen", label: "Vertalingen" },
  { href: "voorbeeld", label: "Voorbeeldweergave" },
];

const ACCOUNT_ITEMS = [
  { href: "/dashboard/account/gegevens", label: "Mijn gegevens" },
  { href: "/dashboard/account/email-templates", label: "E-mail templates" },
  { href: "/dashboard/kalender", label: "Import & synchronisatie" },
  { href: "/dashboard/account/kalender-instellingen", label: "Kalender instellingen" },
  { href: "/dashboard/account/boekingsstatus", label: "Boekingsstatus instellingen" },
  { href: "/dashboard/account/gebruikers", label: "Gebruikersbeheer" },
  { href: "/dashboard/account/export", label: "Gegevens downloaden" },
  { href: "/dashboard/account/rapportage", label: "Rapportage" },
];

type OpenDropdown = "kalenders" | "boekingen" | "online-kalender" | "account" | null;

export default function Header() {
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);

  // Auth + profile + calendars
  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setUser(null); return; }
      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("naam")
        .eq("id", data.user.id)
        .single();
      setUserName(profile?.naam ?? data.user.email?.split("@")[0] ?? null);

      const { data: cals } = await supabase
        .from("calendars")
        .select("id, naam, kleur, woning_naam, user_id, public_token, widget_config, ical_import_urls, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: true });
      setCalendars((cals as Calendar[]) ?? []);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        setUser(null);
        setUserName(null);
        setCalendars([]);
      } else {
        loadUser();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Sluit dropdowns bij klik buiten nav
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function toggleDropdown(name: OpenDropdown) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="bg-white border-b border-warm-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" ref={navRef}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="11" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5" />
            </svg>
            <span className="font-bold text-warm-900 text-base">Verhuurplanner</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm ml-6">
            {user ? (
              <>
                {/* Kalenders */}
                <DropdownButton
                  label="Kalenders"
                  isOpen={openDropdown === "kalenders"}
                  isActive={isActive("/dashboard/kalender")}
                  onClick={() => toggleDropdown("kalenders")}
                />
                {openDropdown === "kalenders" && (
                  <DropdownPanel>
                    {calendars.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-warm-400">Nog geen kalenders</p>
                    ) : (
                      calendars.map((cal) => (
                        <DropdownLink
                          key={cal.id}
                          href={`/dashboard/kalender/${cal.id}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cal.kleur }}
                          />
                          {cal.naam}
                        </DropdownLink>
                      ))
                    )}
                    <div className="border-t border-warm-100 mt-1 pt-1">
                      <DropdownLink href="/dashboard/kalender/nieuw" onClick={() => setOpenDropdown(null)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Kalender toevoegen
                      </DropdownLink>
                    </div>
                  </DropdownPanel>
                )}

                {/* Boekingen */}
                <DropdownButton
                  label="Boekingen"
                  isOpen={openDropdown === "boekingen"}
                  isActive={isActive("/dashboard/boekingen")}
                  onClick={() => toggleDropdown("boekingen")}
                />
                {openDropdown === "boekingen" && (
                  <DropdownPanel>
                    <DropdownLink href="/dashboard/boekingen" onClick={() => setOpenDropdown(null)}>
                      Alle boekingen
                    </DropdownLink>
                    <DropdownLink href="/dashboard/account/export" onClick={() => setOpenDropdown(null)}>
                      Boekingen exporteren
                    </DropdownLink>
                  </DropdownPanel>
                )}

                {/* Online kalender */}
                <DropdownButton
                  label="Online kalender"
                  isOpen={openDropdown === "online-kalender"}
                  isActive={isActive("/dashboard/widget")}
                  onClick={() => toggleDropdown("online-kalender")}
                />
                {openDropdown === "online-kalender" && (
                  <DropdownPanel>
                    {ONLINE_KALENDER_TABS.map((tab) => (
                      <DropdownLink
                        key={tab.href}
                        href={`/dashboard/widget?goto=${tab.href}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {tab.label}
                      </DropdownLink>
                    ))}
                  </DropdownPanel>
                )}

                {/* Account */}
                <DropdownButton
                  label="Account"
                  isOpen={openDropdown === "account"}
                  isActive={isActive("/dashboard/account")}
                  onClick={() => toggleDropdown("account")}
                />
                {openDropdown === "account" && (
                  <DropdownPanel>
                    <div className="px-4 py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider border-b border-warm-100 mb-1">
                      Account {userName && <span className="text-warm-600 normal-case font-medium">{userName}</span>}
                    </div>
                    {ACCOUNT_ITEMS.map((item) => (
                      <DropdownLink key={item.href} href={item.href} onClick={() => setOpenDropdown(null)}>
                        {item.label}
                      </DropdownLink>
                    ))}
                  </DropdownPanel>
                )}

                {/* Kennisbank */}
                <NavLink href="/faq" isActive={pathname === "/faq"} onClick={() => setOpenDropdown(null)}>
                  Kennisbank
                </NavLink>

                {/* Uitloggen */}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-2 text-warm-500 hover:text-warm-700 transition-colors rounded-lg hover:bg-warm-50"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <NavLink href="/prijzen" isActive={pathname === "/prijzen"}>Prijzen</NavLink>
                <NavLink href="/faq" isActive={pathname === "/faq"}>Kennisbank</NavLink>
                <Link href="/login" className="px-3 py-2 text-warm-600 hover:text-warm-900 transition-colors rounded-lg hover:bg-warm-50">
                  Inloggen
                </Link>
                <Link
                  href="/aanmelden"
                  className="ml-2 bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  Gratis starten
                </Link>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-warm-600 hover:bg-warm-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu openen"
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
          <div className="md:hidden border-t border-warm-100 py-3 flex flex-col gap-0.5 text-sm pb-4">
            {user ? (
              <>
                {/* Kalenders */}
                <MobileSection title="Kalenders">
                  {calendars.map((cal) => (
                    <MobileLink key={cal.id} href={`/dashboard/kalender/${cal.id}`} onClick={() => setMenuOpen(false)}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cal.kleur }} />
                      {cal.naam}
                    </MobileLink>
                  ))}
                  <MobileLink href="/dashboard/kalender/nieuw" onClick={() => setMenuOpen(false)}>
                    + Kalender toevoegen
                  </MobileLink>
                </MobileSection>

                {/* Boekingen */}
                <MobileSection title="Boekingen">
                  <MobileLink href="/dashboard/boekingen" onClick={() => setMenuOpen(false)}>Alle boekingen</MobileLink>
                  <MobileLink href="/dashboard/account/export" onClick={() => setMenuOpen(false)}>Boekingen exporteren</MobileLink>
                </MobileSection>

                {/* Online kalender */}
                <MobileSection title="Online kalender">
                  {ONLINE_KALENDER_TABS.map((tab) => (
                    <MobileLink key={tab.href} href={`/dashboard/widget?goto=${tab.href}`} onClick={() => setMenuOpen(false)}>
                      {tab.label}
                    </MobileLink>
                  ))}
                </MobileSection>

                {/* Account */}
                <MobileSection title={`Account${userName ? ` — ${userName}` : ""}`}>
                  {ACCOUNT_ITEMS.map((item) => (
                    <MobileLink key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </MobileLink>
                  ))}
                </MobileSection>

                <Link href="/faq" className="px-3 py-2 text-warm-700 hover:bg-warm-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Kennisbank
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 text-left text-warm-500 hover:bg-warm-50 rounded-lg">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link href="/prijzen" className="px-3 py-2 text-warm-700 hover:bg-warm-50 rounded-lg" onClick={() => setMenuOpen(false)}>Prijzen</Link>
                <Link href="/faq" className="px-3 py-2 text-warm-700 hover:bg-warm-50 rounded-lg" onClick={() => setMenuOpen(false)}>Kennisbank</Link>
                <Link href="/login" className="px-3 py-2 text-warm-700 hover:bg-warm-50 rounded-lg" onClick={() => setMenuOpen(false)}>Inloggen</Link>
                <Link
                  href="/aanmelden"
                  className="bg-accent text-white font-semibold px-4 py-2 rounded-xl text-center mt-1"
                  onClick={() => setMenuOpen(false)}
                >
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

// ─── Sub-components ───────────────────────────────────────────

function DropdownButton({
  label,
  isOpen,
  isActive,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${
        isActive || isOpen
          ? "text-accent font-medium bg-accent-light"
          : "text-warm-600 hover:text-warm-900 hover:bg-warm-50"
      }`}
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-full mt-1 bg-white border border-warm-100 rounded-xl shadow-lg py-1.5 z-50 min-w-52">
      {children}
    </div>
  );
}

function DropdownLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50 hover:text-warm-900 transition-colors"
    >
      {children}
    </Link>
  );
}

function NavLink({
  href,
  isActive,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
        isActive ? "text-accent font-medium bg-accent-light" : "text-warm-600 hover:text-warm-900 hover:bg-warm-50"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-1">
      <p className="px-3 pt-2 pb-1 text-xs font-semibold text-warm-400 uppercase tracking-wider">{title}</p>
      {children}
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-warm-600 hover:bg-warm-50 hover:text-warm-900 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
