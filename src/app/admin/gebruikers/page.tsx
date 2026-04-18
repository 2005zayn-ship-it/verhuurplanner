import { createAdminClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gebruikers — Admin",
  robots: { index: false, follow: false },
};

export default async function GebruikersPage() {
  const supabase = await createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, naam, plan, payment_status, created_at")
    .order("created_at", { ascending: false });

  const { data: calendarCounts } = await supabase
    .from("calendars")
    .select("user_id");

  const { data: bookingCounts } = await supabase
    .from("bookings")
    .select("calendar_id, calendars(user_id)");

  const calPerUser: Record<string, number> = {};
  for (const c of calendarCounts ?? []) {
    calPerUser[c.user_id] = (calPerUser[c.user_id] ?? 0) + 1;
  }

  const planMap: Record<string, string> = { basic: "Free", premium: "Lite", gold: "Pro" };

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900">Gebruikers</h1>
        <p className="text-warm-400 text-sm mt-1">{profiles?.length ?? 0} gebruikers in totaal</p>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">E-mail</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Plan</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Betaling</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Kalenders</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Aangemeld</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {(profiles ?? []).map(p => (
                <tr key={p.id} className="hover:bg-warm-50/50">
                  <td className="px-6 py-3 font-medium text-warm-900">{p.naam || <span className="text-warm-300">Geen naam</span>}</td>
                  <td className="px-6 py-3 text-warm-600">{p.email}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent">
                      {planMap[p.plan] ?? p.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {p.plan === "basic" ? (
                      <span className="text-warm-400 text-xs">Gratis</span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.payment_status === "betaald" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.payment_status === "betaald" ? "Betaald" : "Onbetaald"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-warm-600 tabular-nums">{calPerUser[p.id] ?? 0}</td>
                  <td className="px-6 py-3 text-warm-400">
                    {format(parseISO(p.created_at), "d MMM yyyy", { locale: nl })}
                  </td>
                </tr>
              ))}
              {(profiles ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-warm-400">Geen gebruikers gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
