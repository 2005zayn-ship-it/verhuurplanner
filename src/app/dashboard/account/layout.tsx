"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard/account/gegevens", label: "Mijn gegevens" },
  { href: "/dashboard/account/email-templates", label: "E-mail templates" },
  { href: "/dashboard/account/boekingsstatus", label: "Boekingsstatus instellingen" },
  { href: "/dashboard/account/gebruikers", label: "Gebruikersbeheer" },
  { href: "/dashboard/account/export", label: "Gegevens downloaden" },
  { href: "/dashboard/account/rapportage", label: "Rapportage" },
  { href: "/dashboard/account/facturatie", label: "Facturatie" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-warm-100">
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wider">Account</p>
            </div>
            <ul className="py-1.5">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-accent-light text-accent font-medium"
                          : "text-warm-700 hover:bg-warm-50 hover:text-warm-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
