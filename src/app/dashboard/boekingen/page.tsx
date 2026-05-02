import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alle boekingen — Verhuurplanner",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  bezet: "Bezet",
  optie: "Optie",
  geblokkeerd: "Geblokkeerd",
};
const STATUS_BG: Record<string, string> = {
  bezet: "#fde5e2",
  optie: "#fef3c7",
  geblokkeerd: "#f3f4f6",
};
const STATUS_TEXT: Record<string, string> = {
  bezet: "#b94a3a",
  optie: "#92400e",
  geblokkeerd: "#6b7280",
};

export default async function BoekingenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: calendars }, { data: allBookings }] = await Promise.all([
    supabase.from("calendars").select("id, naam, woning_naam, kleur").eq("user_id", user.id),
    supabase
      .from("bookings")
      .select("id, calendar_id, start_datum, eind_datum, gast_naam, gast_email, status, prijs_totaal, created_at")
      .in(
        "calendar_id",
        (await supabase.from("calendars").select("id").eq("user_id", user.id)).data?.map(c => c.id) ?? []
      )
      .order("start_datum", { ascending: false }),
  ]);

  const calMap = new Map((calendars ?? []).map(c => [c.id, c]));

  const today = startOfDay(new Date());

  const komende = (allBookings ?? []).filter(b => !isBefore(new Date(b.eind_datum), today));
  const verleden = (allBookings ?? []).filter(b => isBefore(new Date(b.eind_datum), today));

  const totalNachten = (allBookings ?? []).reduce((sum, b) => {
    const diff = Math.max(0, Math.round((new Date(b.eind_datum).getTime() - new Date(b.start_datum).getTime()) / 86400000));
    return sum + diff;
  }, 0);

  const totalOmzet = (allBookings ?? [])
    .filter(b => b.status === "bezet" && b.prijs_totaal)
    .reduce((sum, b) => sum + (b.prijs_totaal ?? 0), 0);

  function BookingRow({ b }: { b: typeof allBookings extends null ? never : NonNullable<typeof allBookings>[0] }) {
    const cal = calMap.get(b.calendar_id);
    const nachten = Math.max(0, Math.round((new Date(b.eind_datum).getTime() - new Date(b.start_datum).getTime()) / 86400000));
    return (
      <tr className="border-b border-warm-50 hover:bg-warm-50 transition-colors">
        <td className="px-4 py-3">
          <div className="text-sm font-medium text-warm-900">{b.gast_naam || <span className="text-warm-400 italic">Geen naam</span>}</div>
          {b.gast_email && <div className="text-xs text-warm-400">{b.gast_email}</div>}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            {cal && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cal.kleur }} />}
            <Link href={`/dashboard/kalender/${b.calendar_id}`} className="text-sm text-accent hover:underline">
              {cal?.woning_naam || cal?.naam || "Onbekende kalender"}
            </Link>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-warm-700">
          {format(new Date(b.start_datum), "d MMM yyyy", { locale: nl })}
          <span className="text-warm-400"> t/m </span>
          {format(new Date(b.eind_datum), "d MMM yyyy", { locale: nl })}
          <span className="text-xs text-warm-400 ml-1">({nachten}n)</span>
        </td>
        <td className="px-4 py-3">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: STATUS_BG[b.status] ?? "#f3f4f6", color: STATUS_TEXT[b.status] ?? "#6b7280" }}
          >
            {STATUS_LABEL[b.status] ?? b.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-warm-700 text-right">
          {b.prijs_totaal ? `€${b.prijs_totaal.toLocaleString("nl-BE")}` : <span className="text-warm-300">—</span>}
        </td>
      </tr>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Alle boekingen</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            {(allBookings ?? []).length} boekingen over {(calendars ?? []).length} {(calendars ?? []).length === 1 ? "kalender" : "kalenders"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-warm-100 shadow-sm px-4 py-3">
          <div className="text-2xl font-bold text-warm-900">{(allBookings ?? []).length}</div>
          <div className="text-xs text-warm-400 mt-0.5">Totaal boekingen</div>
        </div>
        <div className="bg-white rounded-xl border border-warm-100 shadow-sm px-4 py-3">
          <div className="text-2xl font-bold text-warm-900">{komende.filter(b => b.status === "bezet").length}</div>
          <div className="text-xs text-warm-400 mt-0.5">Komende bezet</div>
        </div>
        <div className="bg-white rounded-xl border border-warm-100 shadow-sm px-4 py-3">
          <div className="text-2xl font-bold text-warm-900">{totalNachten}</div>
          <div className="text-xs text-warm-400 mt-0.5">Totaal nachten</div>
        </div>
        <div className="bg-white rounded-xl border border-warm-100 shadow-sm px-4 py-3">
          <div className="text-2xl font-bold text-warm-900">{totalOmzet > 0 ? `€${totalOmzet.toLocaleString("nl-BE")}` : "—"}</div>
          <div className="text-xs text-warm-400 mt-0.5">Totaal omzet (bezet)</div>
        </div>
      </div>

      {(allBookings ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-100 p-12 text-center">
          <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 9h18M8 2v4M16 2v4M8 13h8M8 17h5" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-warm-900 mb-1">Nog geen boekingen</h2>
          <p className="text-sm text-warm-500">Ga naar een kalender en klik op een datum om je eerste reservatie toe te voegen.</p>
        </div>
      ) : (
        <>
          {/* Komende boekingen */}
          {komende.length > 0 && (
            <div className="bg-white rounded-2xl border border-warm-100 shadow-sm mb-4 overflow-hidden">
              <div className="px-4 py-3 border-b border-warm-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-sm font-semibold text-warm-700">Komende & actieve boekingen ({komende.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-100 bg-warm-50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Gast</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Kalender</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Periode</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Status</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-warm-500">Prijs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {komende.map(b => <BookingRow key={b.id} b={b} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Verleden boekingen */}
          {verleden.length > 0 && (
            <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-warm-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warm-300" />
                <h2 className="text-sm font-semibold text-warm-700">Afgelopen boekingen ({verleden.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-100 bg-warm-50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Gast</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Kalender</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Periode</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-warm-500">Status</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-warm-500">Prijs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verleden.map(b => <BookingRow key={b.id} b={b} />)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
