import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookiebeleid — Verhuurplanner",
  alternates: { canonical: "https://www.verhuurplanner.be/cookiebeleid" },
  robots: { index: true, follow: true },
};

export default function CookiebeleidPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Cookiebeleid</h1>
      <p className="text-warm-400 text-sm mb-10">Laatste bijwerking: april 2026</p>
      <div className="space-y-8 text-warm-700">
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Wat zijn cookies?</h2>
          <p className="leading-relaxed">Cookies zijn kleine tekstbestanden die op je toestel worden opgeslagen wanneer je een website bezoekt.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-4">Welke cookies gebruiken wij?</h2>
          <div className="bg-warm-50 border border-warm-100 rounded-xl p-5">
            <h3 className="font-semibold text-warm-900 mb-3">Noodzakelijke cookies</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 text-left">
                  <th className="pb-2 pr-4 text-warm-500 font-medium">Cookie</th>
                  <th className="pb-2 pr-4 text-warm-500 font-medium">Doel</th>
                  <th className="pb-2 text-warm-500 font-medium">Bewaartermijn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">sb-*</td>
                  <td className="py-2 pr-4">Inlogstatus (Supabase Auth)</td>
                  <td className="py-2">Sessie / 1 jaar</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                  <td className="py-2 pr-4">Cookievoorkeur</td>
                  <td className="py-2">1 jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Contact</h2>
          <p className="leading-relaxed">Vragen? Mail naar <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>.</p>
        </section>
      </div>
    </div>
  );
}
