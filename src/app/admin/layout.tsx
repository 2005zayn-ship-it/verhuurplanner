import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ReactNode } from "react";

const ADMIN_EMAILS = ["eroelant@gmail.com", "zaynsroelants@gmail.com"];

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/gebruikers", label: "Gebruikers", icon: "users" },
  { href: "/admin/abonnementen", label: "Abonnementen", icon: "credit-card" },
  { href: "/admin/feedback", label: "Feedback", icon: "message-circle" },
];

const ICON_PATHS: Record<string, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  "credit-card": <><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></>,
  "message-circle": <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>,
};

function Icon({ name }: { name: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-warm-100 flex flex-col">
        <div className="px-5 py-5 border-b border-warm-100">
          <span className="text-xs font-semibold text-warm-400 uppercase tracking-wider">Admin</span>
          <div className="text-sm font-bold text-warm-900 mt-0.5">Verhuurplanner</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-warm-600 hover:bg-warm-50 hover:text-warm-900 transition-colors"
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-warm-100 space-y-0.5">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-warm-500 hover:bg-warm-50 hover:text-warm-900 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Dashboard
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
