import { createAdminClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { format, parseISO, subDays } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createAdminClient();

  const [{ data: profiles }, { data: calendars }, { data: bookings }] = await Promise.all([
    supabase.from("profiles").select("id, plan, payment_status, created_at").order("created_at", { ascending: false }),
    supabase.from("calendars").select("id, created_at, user_id"),
    supabase.from("bookings").select("id, created_at, status"),
  ]);

  const now = new Date();
  const last30 = subDays(now, 30).toISOString();

  const totalUsers = profiles?.length ?? 0;
  const totalCalendars = calendars?.length ?? 0;
  const totalBookings = bookings?.length ?? 0;
  const betaald = profiles?.filter(p => p.payment_status === "betaald").length ?? 0;
  const newUsers30 = profiles?.filter(p => p.created_at >= last30).length ?? 0;
  const newBookings30 = bookings?.filter(b => b.created_at >= last30).length ?? 0;

  const planCount: Record<string, number> = {};
  for (const p of profiles ?? []) {
    planCount[p.plan] = (planCount[p.plan] ?? 0) + 1;
  }

  const recentUsers = (profiles ?? []).slice(0, 8);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900">Dashboard</h1>
        <p className="text-warm-400 text-sm mt-1">Overzicht van {format(now, "d MMMM yyyy", { locale: nl })}</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Gebruikers totaal" value={totalUsers} sub={`+${newUsers30} afgelopen 30 dagen`} />
        <KpiCard label="Kalenders" value={totalCalendars} />
        <KpiCard label="Reservaties" value={totalBookings} sub={`+${newBookings30} afgelopen 30 dagen`} />
        <KpiCard label="Betalende gebruikers" value={betaald} sub={totalUsers > 0 ? `${Math.round(betaald / totalUsers * 100)}% van totaal` : ""} accent />
        <KpiCard label="Free plan" value={planCount["basic"] ?? 0} />
        <KpiCard label="Lite / Pro" value={(planCount["premium"] ?? 0) + (planCount["gold"] ?? 0)} />
      </div>

      {/* Plan verdeling */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { plan: "Free (basic)", count: planCount["basic"] ?? 0, color: "bg-warm-200" },
          { plan: "Lite (premium)", count: planCount["premium"] ?? 0, color: "bg-accent/30" },
          { plan: "Pro (gold)", count: planCount["gold"] ?? 0, color: "bg-accent" },
        ].map(row => (
          <div key={row.plan} className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
              <span className="text-sm font-medium text-warm-700">{row.plan}</span>
            </div>
            <div className="text-3xl font-bold text-warm-900">{row.count}</div>
            <div className="text-xs text-warm-400 mt-1">
              {totalUsers > 0 ? `${Math.round(row.count / totalUsers * 100)}% van gebruikers` : "0%"}
            </div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-warm-100 flex items-center justify-between">
          <h2 className="font-semibold text-warm-900">Recente gebruikers</h2>
          <a href="/admin/gebruikers" className="text-sm text-accent hover:underline">Alle gebruikers</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Aangemeld</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Plan</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {recentUsers.map(p => (
                <tr key={p.id} className="hover:bg-warm-50/50">
                  <td className="px-6 py-3 text-warm-500">
                    {format(parseISO(p.created_at), "d MMM yyyy", { locale: nl })}
                  </td>
                  <td className="px-6 py-3">
                    <PlanBadge plan={p.plan} />
                  </td>
                  <td className="px-6 py-3">
                    <PaymentBadge plan={p.plan} status={p.payment_status} />
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-warm-400">Geen gebruikers gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border shadow-sm p-5 ${accent ? "bg-accent text-white border-accent" : "bg-white border-warm-100"}`}>
      <div className={`text-3xl font-bold ${accent ? "text-white" : "text-warm-900"}`}>{value}</div>
      <div className={`text-sm font-medium mt-1 ${accent ? "text-white/80" : "text-warm-600"}`}>{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${accent ? "text-white/60" : "text-warm-400"}`}>{sub}</div>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = { basic: "Free", premium: "Lite", gold: "Pro" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent capitalize">
      {map[plan] ?? plan}
    </span>
  );
}

function PaymentBadge({ plan, status }: { plan: string; status: string }) {
  if (plan === "basic") return <span className="text-warm-400 text-xs">Gratis</span>;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      status === "betaald" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
    }`}>
      {status === "betaald" ? "Betaald" : "Onbetaald"}
    </span>
  );
}
