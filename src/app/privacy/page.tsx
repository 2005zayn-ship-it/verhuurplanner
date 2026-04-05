import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid — Verhuurplanner",
  alternates: { canonical: "https://www.verhuurplanner.be/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Privacybeleid</h1>
      <p className="text-warm-400 text-sm mb-10">Laatst bijgewerkt: april 2026</p>
      <div className="space-y-8 text-warm-700">
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Wie zijn wij?</h2>
          <p className="leading-relaxed">Verhuurplanner (verhuurplanner.be) is een dienst voor vakantieverhuurders om hun beschikbaarheidskalender te beheren. We zijn gevestigd in België.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Welke gegevens verzamelen wij?</h2>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>E-mailadres en naam bij registratie</li>
            <li>Kalendergegevens die je zelf invoert (reservaties, gastnames, notities)</li>
            <li>Technische gegevens (IP-adres, browser) voor beveiliging</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Waarvoor gebruiken wij jouw gegevens?</h2>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>Om je account te beheren en toegang te geven tot je kalenders</li>
            <li>Om de dienst te verbeteren</li>
            <li>Om je te contacteren bij vragen of problemen</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Worden gegevens gedeeld?</h2>
          <p className="leading-relaxed">We delen je gegevens niet met derden voor commerciële doeleinden. We maken gebruik van Supabase voor gegevensopslag (servers in de EU).</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Jouw rechten</h2>
          <p className="leading-relaxed">Je hebt het recht om je gegevens in te zien, te corrigeren of te laten verwijderen. Stuur een mail naar <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>.</p>
        </section>
      </div>
    </div>
  );
}
