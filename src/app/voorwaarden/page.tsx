import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene voorwaarden — Verhuurplanner",
  alternates: { canonical: "https://www.verhuurplanner.be/voorwaarden" },
  robots: { index: true, follow: true },
};

export default function VoorwaardenPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Algemene voorwaarden</h1>
      <p className="text-warm-400 text-sm mb-10">Laatste bijwerking: april 2026</p>
      <div className="space-y-8 text-warm-700">
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">1. Dienst</h2>
          <p className="leading-relaxed">Verhuurplanner biedt een online beschikbaarheidskalender voor vakantieverhuurders. De dienst wordt aangeboden via verhuurplanner.be en verhuurplanner.com.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">2. Gebruik</h2>
          <p className="leading-relaxed">Je bent verantwoordelijk voor de correctheid van de gegevens die je invoert. Het is niet toegestaan de dienst te gebruiken voor illegale activiteiten of om andere gebruikers te schaden.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">3. Gratis plan</h2>
          <p className="leading-relaxed">Het Basic plan is gratis en biedt 1 kalender. We behouden het recht om de functionaliteit van het gratis plan aan te passen. We zullen gebruikers hierover tijdig informeren.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">4. Aansprakelijkheid</h2>
          <p className="leading-relaxed">Verhuurplanner is niet aansprakelijk voor indirecte schade, gederfde winst of verlies van data. We streven naar maximale beschikbaarheid maar bieden geen garanties.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">5. Toepasselijk recht</h2>
          <p className="leading-relaxed">Belgisch recht is van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbanken in België.</p>
        </section>
      </div>
    </div>
  );
}
