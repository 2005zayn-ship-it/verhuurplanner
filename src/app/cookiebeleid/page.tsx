import { Metadata } from "next";
import CookieResetButton from "./CookieResetButton";

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
          <h2 className="text-xl font-semibold text-warm-900 mb-4">Noodzakelijke cookies</h2>
          <p className="mb-4 leading-relaxed">Deze cookies zijn vereist voor de werking van de website en kunnen niet worden uitgeschakeld.</p>
          <div className="bg-warm-50 border border-warm-100 rounded-xl p-5">
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
                  <td className="py-2 pr-4">Jouw cookievoorkeur bijhouden</td>
                  <td className="py-2">1 jaar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-4">Analytische cookies (optioneel)</h2>
          <p className="mb-4 leading-relaxed">Analytische cookies worden enkel geplaatst na jouw uitdrukkelijke toestemming. Ze helpen ons begrijpen hoe bezoekers de website gebruiken zodat we de dienst kunnen verbeteren.</p>
          <div className="bg-warm-50 border border-warm-100 rounded-xl p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 text-left">
                  <th className="pb-2 pr-4 text-warm-500 font-medium">Cookie</th>
                  <th className="pb-2 pr-4 text-warm-500 font-medium">Aanbieder</th>
                  <th className="pb-2 pr-4 text-warm-500 font-medium">Doel</th>
                  <th className="pb-2 text-warm-500 font-medium">Bewaartermijn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_ga, _ga_*</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2 pr-4">Bezoekersstatistieken</td>
                  <td className="py-2">2 jaar</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">_gid</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2 pr-4">Sessietracking</td>
                  <td className="py-2">24 uur</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Toestemming wijzigen of intrekken</h2>
          <p className="leading-relaxed mb-4">Je kan jouw cookievoorkeur op elk moment aanpassen. Bij weigering worden analytische cookies niet langer geplaatst en worden eventuele bestaande analytische cookies verwijderd.</p>
          <CookieResetButton />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Contact</h2>
          <p className="leading-relaxed">Vragen over ons cookiebeleid? Mail naar <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>.</p>
        </section>
      </div>
    </div>
  );
}
