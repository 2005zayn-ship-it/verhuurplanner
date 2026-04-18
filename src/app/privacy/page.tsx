import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid — Verhuurplanner",
  alternates: { canonical: "https://www.verhuurplanner.be/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Privacybeleid</h1>
      <p className="text-warm-400 text-sm mb-10">Laatste bijwerking: april 2026</p>

      <div className="space-y-8 text-warm-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Over dit beleid</h2>
          <p>Verhuurplanner (verhuurplanner.be) hecht veel belang aan de bescherming van jouw persoonsgegevens. We verwerken uitsluitend gegevens die noodzakelijk zijn voor onze dienstverlening en behandelen alle informatie met de nodige zorg. We stellen jouw gegevens nooit ter beschikking aan derden voor commerciële doeleinden.</p>
          <p className="mt-3">Dit privacybeleid is van toepassing op alle diensten die Verhuurplanner aanbiedt via verhuurplanner.be. Door gebruik te maken van onze dienst ga je akkoord met dit beleid. Bij vragen kan je ons bereiken via <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Wie verwerkt jouw gegevens?</h2>
          <p>Verhuurplanner, gevestigd in België, is de verwerkingsverantwoordelijke voor de persoonsgegevens die je als gebruiker aan ons verstrekt. Voor de gegevens die jij als verhuurder invoert over je gasten (gastnames, boekingsgegevens), treedt Verhuurplanner op als verwerker en ben jij de verwerkingsverantwoordelijke.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Welke gegevens verwerken wij?</h2>
          <p className="mb-3">We verwerken de volgende categorieën van persoonsgegevens:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Accountgegevens:</strong> naam en e-mailadres bij registratie</li>
            <li><strong>Kalender- en boekingsgegevens:</strong> reservaties, gastnames en notities die jij zelf invoert</li>
            <li><strong>Betalingsgegevens:</strong> bij betaalde abonnementen verwerken we betaalgegevens via onze betalingsverwerker</li>
            <li><strong>Technische gegevens:</strong> IP-adres, browser en besturingssysteem voor beveiliging en foutopsporing</li>
            <li><strong>Gebruiksgegevens:</strong> hoe je de dienst gebruikt, voor verbetering van onze service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Waarvoor gebruiken wij jouw gegevens?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Om je account te beheren en toegang te geven tot je kalenders</li>
            <li>Om de dienst te leveren en te verbeteren</li>
            <li>Om je te informeren over wijzigingen in de dienst of je abonnement</li>
            <li>Om technische ondersteuning te bieden</li>
            <li>Om betalingen te verwerken en facturen op te maken</li>
            <li>Om fraude te voorkomen en de beveiliging te waarborgen</li>
          </ul>
          <p className="mt-3">We gebruiken jouw gegevens niet voor gerichte marketing zonder jouw uitdrukkelijke toestemming.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Dienstverleners en subverwerkers</h2>
          <p className="mb-4">Voor de werking van Verhuurplanner maken wij gebruik van de volgende externe dienstverleners. Met elk van deze partijen zijn de vereiste verwerkersovereenkomsten gesloten.</p>

          <div className="space-y-4">
            <div className="bg-warm-50 rounded-xl p-4">
              <h3 className="font-semibold text-warm-900 mb-1">Supabase</h3>
              <p className="text-sm">We slaan jouw accountgegevens en kalenderdata op via Supabase. Gegevens worden verwerkt binnen de Europese Economische Ruimte. Supabase gebruikt jouw gegevens niet voor eigen doeleinden.</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-4">
              <h3 className="font-semibold text-warm-900 mb-1">Vercel</h3>
              <p className="text-sm">Onze website en applicatie worden gehost via Vercel. Vercel kan technische metagegevens verwerken, maar geen persoonsgegevens worden gedeeld voor andere doeleinden.</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-4">
              <h3 className="font-semibold text-warm-900 mb-1">E-maildiensten</h3>
              <p className="text-sm">Voor het verzenden van transactionele e-mails (bevestigingen, wachtwoord-reset) maken wij gebruik van een externe e-maildienst. Je naam en e-mailadres worden gedeeld voor het verzenden van de e-mail. E-mails worden tot 45 dagen bewaard op de mailservers.</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-4">
              <h3 className="font-semibold text-warm-900 mb-1">Betalingsverwerkers (Mollie / Stripe)</h3>
              <p className="text-sm">Bij betaalde abonnementen worden betalingen verwerkt via Mollie of Stripe. Zij verwerken je naam, factuuradres en betaalgegevens. Beide partijen nemen passende beveiligingsmaatregelen en bewaren gegevens niet langer dan wettelijk vereist.</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-4">
              <h3 className="font-semibold text-warm-900 mb-1">Google Analytics</h3>
              <p className="text-sm">We maken gebruik van Google Analytics om het gebruik van onze website bij te houden. Hierbij worden anonieme gebruiksgegevens verzameld. Google kan deze gegevens verwerken conform hun eigen privacybeleid.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Bewaartermijnen</h2>
          <p>We bewaren jouw gegevens zolang je een actief account hebt. Bij inactiviteit van meer dan 18 maanden (geen inlog) behouden we het recht om je account en bijbehorende gegevens te verwijderen, mits we je hierover vooraf informeren.</p>
          <p className="mt-3">Als je je account opzegt, worden je persoonsgegevens binnen 30 dagen verwijderd. Back-ups worden na maximaal 1 jaar definitief gewist. Factuurgegevens bewaren wij conform de wettelijke boekhoudkundige bewaarplicht (7 jaar).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Jouw rechten (AVG/GDPR)</h2>
          <p className="mb-3">Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je als betrokkene de volgende rechten:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Recht op inzage:</strong> je kan opvragen welke persoonsgegevens we van jou verwerken</li>
            <li><strong>Recht op rectificatie:</strong> je kan onjuiste of onvolledige gegevens laten corrigeren</li>
            <li><strong>Recht op vergetelheid:</strong> je kan vragen om verwijdering van jouw persoonsgegevens</li>
            <li><strong>Recht op beperking:</strong> je kan de verwerking van jouw gegevens (tijdelijk) laten beperken</li>
            <li><strong>Recht op overdraagbaarheid:</strong> je kan jouw gegevens in een leesbaar formaat opvragen</li>
            <li><strong>Recht van bezwaar:</strong> je kan bezwaar maken tegen de verwerking van jouw gegevens</li>
          </ul>
          <p className="mt-3">Voor al deze verzoeken kan je een e-mail sturen naar <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a>. Je ontvangt een reactie binnen 30 dagen. Afschriften worden verstuurd naar het bij ons bekende e-mailadres.</p>
          <p className="mt-3">Je hebt ook altijd het recht om een klacht in te dienen bij de Gegevensbeschermingsautoriteit (GBA) als je vermoedt dat wij jouw persoonsgegevens onjuist verwerken.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Cookies</h2>
          <p>We maken gebruik van functionele cookies die noodzakelijk zijn voor de werking van de dienst (ingelogd blijven, sessies beheren). Daarnaast gebruiken we analytische cookies (Google Analytics) om het gebruik van onze website te meten. Bij je eerste bezoek word je hierover geïnformeerd via onze cookiebanner.</p>
          <p className="mt-3">Meer informatie vind je in ons <Link href="/cookiebeleid" className="text-accent hover:underline">cookiebeleid</Link>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Beveiliging</h2>
          <p>We nemen passende technische en organisatorische maatregelen om jouw persoonsgegevens te beschermen tegen verlies, misbruik of ongeoorloofde toegang. Alle gegevensoverdracht verloopt via versleutelde verbindingen (SSL/HTTPS). Bij een datalek informeren wij je zo snel mogelijk en uiterlijk binnen 72 uur.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Verwerkersrol voor gastgegevens</h2>
          <p>Als je als verhuurder gastnames en boekingsgegevens invoert in Verhuurplanner, verwerk jij persoonsgegevens van jouw gasten. In dat geval ben jij de verwerkingsverantwoordelijke en treedt Verhuurplanner op als verwerker. Verhuurplanner verwerkt deze gegevens enkel in opdracht van jou en voor de werking van de dienst. Jij blijft verantwoordelijk voor het correct verwerken van de gegevens van jouw gasten conform de AVG.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Wijzigingen</h2>
          <p>We behouden het recht om dit privacybeleid te wijzigen. Bij ingrijpende wijzigingen word je via e-mail of een melding in de applicatie op de hoogte gesteld. Op deze pagina vind je altijd de meest recente versie.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-warm-900 mb-3">Contact</h2>
          <p>Heb je vragen of opmerkingen over dit privacybeleid? Neem contact op via <a href="mailto:info@verhuurplanner.be" className="text-accent hover:underline">info@verhuurplanner.be</a> of via ons <Link href="/contact" className="text-accent hover:underline">contactformulier</Link>.</p>
          <p className="mt-2">Toepasselijk recht: Belgisch recht. Geschillen worden voorgelegd aan de bevoegde rechtbanken in België.</p>
        </section>

      </div>
    </div>
  );
}
