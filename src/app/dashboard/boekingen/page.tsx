import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alle boekingen — Verhuurplanner",
  robots: { index: false, follow: false },
};

export default async function BoekingenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-warm-900 mb-2">Alle boekingen</h1>
      <p className="text-warm-500 text-sm mb-8">Een overzicht van al je boekingen over al je kalenders.</p>

      <div className="bg-warm-50 rounded-2xl border border-warm-100 p-12 text-center">
        <div className="w-14 h-14 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
            <path d="M8 13h8M8 17h5" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-warm-900 mb-2">Boekingenoverzicht</h2>
        <p className="text-warm-500 text-sm max-w-sm mx-auto">
          Het gecombineerd boekingenoverzicht is in ontwikkeling. Bekijk je boekingen nu per kalender via het dashboard.
        </p>
      </div>
    </div>
  );
}
