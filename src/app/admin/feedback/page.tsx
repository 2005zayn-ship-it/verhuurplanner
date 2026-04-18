import { createAdminClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback — Admin",
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  const supabase = await createAdminClient();

  const { data: items } = await supabase
    .from("feedback")
    .select("id, type, bericht, email, naam, created_at")
    .order("created_at", { ascending: false });

  const suggestions = (items ?? []).filter(i => i.type === "suggestie");
  const bugs = (items ?? []).filter(i => i.type === "bug");
  const other = (items ?? []).filter(i => i.type !== "suggestie" && i.type !== "bug");

  const TYPE_LABEL: Record<string, string> = {
    suggestie: "Suggestie",
    bug: "Bug",
    vraag: "Vraag",
    compliment: "Compliment",
  };

  const TYPE_STYLE: Record<string, string> = {
    suggestie: "bg-accent-light text-accent",
    bug: "bg-red-100 text-red-700",
    vraag: "bg-amber-100 text-amber-700",
    compliment: "bg-green-100 text-green-700",
  };

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-warm-900">Feedback</h1>
        <p className="text-warm-400 text-sm mt-1">{items?.length ?? 0} berichten ontvangen</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-warm-900">{suggestions.length}</div>
          <div className="text-sm text-warm-500 mt-1">Suggesties</div>
        </div>
        <div className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-warm-900">{bugs.length}</div>
          <div className="text-sm text-warm-500 mt-1">Bugs gemeld</div>
        </div>
        <div className="bg-white rounded-2xl border border-warm-100 p-5 shadow-sm text-center">
          <div className="text-3xl font-bold text-warm-900">{other.length}</div>
          <div className="text-sm text-warm-500 mt-1">Overige</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-warm-100">
          <h2 className="font-semibold text-warm-900">Alle berichten</h2>
        </div>
        {(items ?? []).length === 0 ? (
          <div className="px-6 py-12 text-center text-warm-400">Nog geen feedback ontvangen.</div>
        ) : (
          <div className="divide-y divide-warm-50">
            {(items ?? []).map(item => (
              <div key={item.id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLE[item.type] ?? "bg-warm-100 text-warm-600"}`}>
                        {TYPE_LABEL[item.type] ?? item.type}
                      </span>
                      {item.naam && <span className="text-sm font-medium text-warm-700">{item.naam}</span>}
                      {item.email && <span className="text-sm text-warm-400">{item.email}</span>}
                    </div>
                    <p className="text-sm text-warm-700 whitespace-pre-wrap">{item.bericht}</p>
                  </div>
                  <div className="text-xs text-warm-400 shrink-0">
                    {format(parseISO(item.created_at), "d MMM yyyy", { locale: nl })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
