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

      <div className="space-y-8 text-warm-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">1. Dienst</h2>
          <p>Verhuurplanner, aangeboden via verhuurplanner.be, is een online dienst voor het beheren van beschikbaarheidskalenders voor vakantieverhuurders. Je kunt via de dienst kalenders aanmaken, boekingen bijhouden en beschikbaarheid delen met bezoekers van je eigen website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">2. Account aanmaken</h2>
          <p>Om gebruik te maken van Verhuurplanner maak je een account aan en ga je akkoord met deze algemene voorwaarden. Je bent zelf verantwoordelijk voor de beveiliging van je account en wachtwoord. Zorg ervoor dat je registratiegegevens correct en actueel zijn. Accounts die zijn aangemaakt via geautomatiseerde methoden zijn niet toegestaan.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">3. Kalenders en gegevens</h2>
          <p>De informatie die je in je kalenders opneemt, valt volledig onder jouw verantwoordelijkheid. Je vrijwaart Verhuurplanner voor aanspraken wegens onjuiste gegevens of schendingen van auteursrechten in door jou aangeleverd materiaal. Verhuurplanner behoudt het recht om inhoud te weigeren, te wijzigen of te verwijderen indien die onjuist, misleidend of in strijd met deze voorwaarden is.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">4. Gratis plan (Free)</h2>
          <p>Het Free plan biedt maximaal 1 kalender en maximaal 100 boekingen, zonder kosten. Verhuurplanner behoudt het recht om de omvang of functionaliteit van het Free plan te wijzigen. Gebruikers worden vooraf op de hoogte gesteld van ingrijpende wijzigingen.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">5. Betaalde abonnementen</h2>
          <p>Betaalde abonnementen (Lite en Pro) geven toegang tot uitgebreidere functionaliteiten. Prijzen kunnen worden gewijzigd. Wijzigingen hebben geen invloed op een lopend abonnement, maar gelden vanaf de volgende abonnementsperiode. Verhuurplanner is niet aansprakelijk voor prijswijzigingen.</p>
          <p className="mt-3">Betalingen verlopen via de aangeboden online betaalmethoden. Dit is noodzakelijk voor correcte verwerking en activering van je abonnement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">6. Opzegging</h2>
          <p>Je kan een betaald abonnement op elk moment opzeggen via je accountinstellingen of via een e-mail naar <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>. Houd een opzegtermijn van 30 dagen voor de einddatum van de lopende abonnementsperiode aan. Je ontvangt een bevestiging binnen één werkdag.</p>
          <p className="mt-3">SMS-tegoed dat werd aangekocht is niet terugbetaalbaar bij opzegging.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">7. Opschorting en verwijdering van accounts</h2>
          <p>Verhuurplanner behoudt het recht om accounts te weigeren, op te schorten of te verwijderen in geval van misbruik, schending van deze voorwaarden, ongeoorloofd gedrag of handelen in strijd met toepasselijke wetgeving. Bij opschorting of verwijdering is Verhuurplanner niet aansprakelijk voor enige schade die hieruit voortvloeit.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">8. Aansprakelijkheid</h2>
          <p>De dienst wordt geleverd "as is" en "as available". Verhuurplanner garandeert geen ononderbroken, foutloze of volledig beveiligde werking. Verhuurplanner is niet aansprakelijk voor directe of indirecte schade, gederfde winst, verlies van gegevens of enige andere gevolgschade die voortvloeit uit het gebruik of het niet kunnen gebruiken van de dienst.</p>
          <p className="mt-3">Verhuurplanner is op geen enkele wijze aansprakelijk voor aanspraken die verband houden met onjuiste of onvolledige informatie die door de gebruiker werd ingevoerd.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">9. Technische ondersteuning</h2>
          <p>Technische ondersteuning wordt aangeboden op best-effort basis. Verhuurplanner kan gebruik maken van externe hosting- en infrastructuurpartners voor het leveren van de dienst.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">10. Wijzigingen aan de dienst</h2>
          <p>Verhuurplanner mag functies toevoegen, wijzigen of verwijderen. Voortgezet gebruik van de dienst na dergelijke wijzigingen geldt als aanvaarding ervan. Bij ingrijpende wijzigingen word je via e-mail of in de applicatie geïnformeerd.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">11. Toegestaan gebruik</h2>
          <p>Je verbindt je ertoe de dienst enkel te gebruiken voor wettige doeleinden. Niet toegestaan zijn onder meer: illegale activiteiten, het versturen van spam, het verspreiden van malware, het nabootsen van andere personen, activiteiten die de werking van de dienst verstoren of andere gebruikers schaden.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">12. Intellectuele eigendom</h2>
          <p>De software, het ontwerp en de inhoud van Verhuurplanner zijn eigendom van of in licentie gegeven aan Verhuurplanner. Je data en kalenderinhoud blijven jouw eigendom. Je verleent Verhuurplanner een beperkte licentie om deze data te verwerken voor de werking van de dienst.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">13. Privacy</h2>
          <p>Het gebruik van persoonsgegevens valt onder het <a href="/privacy" className="text-accent hover:underline">privacybeleid</a> van Verhuurplanner, in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG / GDPR).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">14. Toepasselijk recht</h2>
          <p>Belgisch recht is van toepassing op deze voorwaarden en op het gebruik van Verhuurplanner. Geschillen die niet minnelijk kunnen worden opgelost, worden voorgelegd aan de bevoegde rechtbanken in België.</p>
        </section>

      </div>
    </div>
  );
}
