import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const ADMIN_EMAIL = "vakantiewoningeninbelgie@gmail.com";

export default async function AdminPage() {
  const supabase = await createAdminClient();

  // Admin check via auth (no server client here, use service role)
  // We'll verify via a custom header or just protect via middleware later
  // For now, fetch all data

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: calendars } = await supabase
    .from("calendars")
    .select("*, profiles(email, naam, plan, payment_status)")
    .order("created_at", { ascending: false });

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, calendar_id, start_datum, eind_datum, status");

  const totalBookings = bookings?.length ?? 0;
  const totalCalendars = calendars?.length ?? 0;
  const totalUsers = profiles?.length ?? 0;
  const betaald = profiles?.filter(p => p.payment_status === "betaald").length ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Admin — Verhuurplanner</h1>
          <p className="text-warm-500 text-sm mt-1">Overzicht van alle gebruikers en kalenders.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Gebruikers", value: totalUsers },
          { label: "Kalenders", value: totalCalendars },
          { label: "Reservaties", value: totalBookings },
          { label: "Betalend", value: betaald },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
            <div className="text-3xl font-bold text-warm-900">{kpi.value}</div>
            <div className="text-sm text-warm-400 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Gebruikers */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-warm-100">
          <h2 className="font-semibold text-warm-900">Gebruikers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">E-mail</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Plan</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Betaling</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Aangemeld</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {(profiles || []).map(p => (
                <tr key={p.id} className="hover:bg-warm-50/50">
                  <td className="px-6 py-3 text-warm-900 font-medium">{p.naam || "—"}</td>
                  <td className="px-6 py-3 text-warm-600">{p.email}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent capitalize">
                      {p.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <PaymentBadge userId={p.id} status={p.payment_status} plan={p.plan} />
                  </td>
                  <td className="px-6 py-3 text-warm-400">
                    {format(parseISO(p.created_at), "d MMM yyyy", { locale: nl })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kalenders */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-warm-100">
          <h2 className="font-semibold text-warm-900">Kalenders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Eigenaar</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Aangemaakt</th>
                <th className="text-left px-6 py-3 text-warm-500 font-medium">Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {(calendars || []).map((cal: any) => (
                <tr key={cal.id} className="hover:bg-warm-50/50">
                  <td className="px-6 py-3 font-medium text-warm-900">{cal.naam}</td>
                  <td className="px-6 py-3 text-warm-600">{cal.profiles?.email || "—"}</td>
                  <td className="px-6 py-3 text-warm-400">
                    {format(parseISO(cal.created_at), "d MMM yyyy", { locale: nl })}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-warm-400 max-w-[160px] truncate">{cal.public_token}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentBadge({ userId, status, plan }: { userId: string; status: string; plan: string }) {
  if (plan === "basic") return <span className="text-warm-400 text-xs">Gratis</span>;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      status === "betaald" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
    }`}>
      {status === "betaald" ? "Betaald" : "Onbetaald"}
    </span>
  );
}
