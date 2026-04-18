import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Metadata } from "next";
import { Calendar } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("naam, plan, payment_status")
    .eq("id", user.id)
    .single();

  const { data: calendars } = await supabase
    .from("calendars")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const naam = profile?.naam || user.email?.split("@")[0] || "verhuurder";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Goedendag, {naam}</h1>
          <p className="text-warm-500 text-sm mt-1">Beheer hier je kalenders en reservaties.</p>
        </div>
        <NewCalendarButton planLimit={profile?.plan === "basic" ? 1 : profile?.plan === "premium" ? 3 : 10} currentCount={calendars?.length ?? 0} />
      </div>

      {/* Plan badge */}
      <div className="bg-accent-light rounded-xl px-4 py-3 flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            {profile?.plan?.toUpperCase() ?? "BASIC"} plan
          </span>
          {profile?.payment_status === "onbetaald" && profile?.plan !== "basic" && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Betaling vereist</span>
          )}
        </div>
        <Link href="/prijzen" className="text-xs text-accent hover:underline font-medium">
          Upgraden
        </Link>
      </div>

      {/* Kalenders */}
      {!calendars || calendars.length === 0 ? (
        <div className="text-center py-20 bg-warm-50 rounded-2xl border border-warm-100">
          <div className="w-14 h-14 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-warm-900 mb-2">Nog geen kalender</h2>
          <p className="text-warm-500 text-sm mb-6">Maak je eerste kalender aan om te starten.</p>
          <NewCalendarButton planLimit={1} currentCount={0} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(calendars as Calendar[]).map((cal) => (
            <Link
              key={cal.id}
              href={`/dashboard/kalender/${cal.id}`}
              className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${cal.kleur}20` }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cal.kleur} strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                </div>
                <svg className="w-4 h-4 text-warm-300 group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              <h3 className="font-semibold text-warm-900 mb-1">{cal.naam}</h3>
              {cal.woning_naam && <p className="text-sm text-warm-400">{cal.woning_naam}</p>}
              <div className="mt-4 pt-4 border-t border-warm-50 text-xs text-warm-400 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Embed
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                  iCal
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NewCalendarButton({ planLimit, currentCount }: { planLimit: number; currentCount: number }) {
  const atLimit = currentCount >= planLimit;
  if (atLimit) {
    return (
      <Link href="/prijzen" className="inline-flex items-center gap-2 border border-warm-200 text-warm-600 font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-warm-50 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
        Kalender toevoegen
        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Upgrade vereist</span>
      </Link>
    );
  }
  return (
    <Link href="/dashboard/kalender/nieuw" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
      Kalender toevoegen
    </Link>
  );
}
