import { createAdminClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Abonnementen — Admin",
  robots: { index: false, follow: false },
};

const PLAN_PRICE: Record<string, number> = { premium: 9, gold: 15 };
const PLAN_LABEL: Record<string, string> = { basic: "Free", premium: "Lite", gold: "Pro" };

export default async function AbonnementenPage() {
  const supabase = await createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, naam, plan, payment_status, created_at")
    .neq("plan", "basic")
    .order("created_at", { ascending: false });

  const betaald = (profiles ?? []).filter(p => p.payment_status === "betaald");
  const onbetaald = (profiles ?? []).filter(p => p.payment_status === "onbetaald");
  const mrrEstimate = betaald.reduce((sum, p) => sum + (PLAN_PRICE[p.plan] ?? 0), 0);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900">Abonnementen</h1>
        <p className="text-warm-400 text-sm mt-1">Betalende en onbetalende Lite/Pro gebruikers</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-warm-900">{betaald.length}</div>
          <div className="text-sm text-warm-500 mt-1">Betalend</div>
        </div>
        <div className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-warm-900">{onbetaald.length}</div>
          <div className="text-sm text-warm-500 mt-1">Onbetaald</div>
        </div>
        <div className="bg-accent rounded-2xl border border-accent p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-white">€{mrrEstimate}</div>
          <div className="text-sm text-white/80 mt-1">Geschatte MRR</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-warm-100">
          <h2 className="font-semibold text-warm-900">Lite &amp; Pro gebruikers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Naam</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">E-mail</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Plan</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Prijs</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-warm-400 font-medium">Aangemeld</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {(profiles ?? []).map(p => (
                <tr key={p.id} className="hover:bg-warm-50/50">
                  <td className="px-6 py-3 font-medium text-warm-900">{p.naam || <span className="text-warm-300">—</span>}</td>
                  <td className="px-6 py-3 text-warm-600">{p.email}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-light text-accent">
                      {PLAN_LABEL[p.plan] ?? p.plan}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-warm-600">
                    €{PLAN_PRICE[p.plan] ?? 0}/maand
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.payment_status === "betaald" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {p.payment_status === "betaald" ? "Betaald" : "Onbetaald"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-warm-400">
                    {format(parseISO(p.created_at), "d MMM yyyy", { locale: nl })}
                  </td>
                </tr>
              ))}
              {(profiles ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-warm-400">Nog geen Lite of Pro gebruikers.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
