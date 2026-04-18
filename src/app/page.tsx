import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verhuurplanner | Beschikbaarheidskalender voor vakantieverhuurders",
  description: "Beheer je beschikbaarheid en reservaties in één eenvoudige kalender. Gratis starten. Geen technische kennis nodig.",
  alternates: { canonical: "https://www.verhuurplanner.be" },
};

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
    titel: "Maandkalender per woning",
    tekst: "Bekijk en beheer je beschikbaarheid per maand. Bezet, vrij of optie — in één oogopslag duidelijk.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    titel: "Gastnaam per periode",
    tekst: "Noteer wie wanneer verblijft. Ideaal als geheugensteuntje en voor een vlotte communicatie.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    titel: "Embed op je eigen website",
    tekst: "Toon je beschikbaarheidskalender op je eigen website met één regel code. Automatisch bijgewerkt.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
    titel: "Notities per boeking",
    tekst: "Voeg notities toe aan elke reservatie. Aankomsttijd, sleutelafspraak, speciale wensen — alles op één plek.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    titel: "Veilig en privé",
    tekst: "Jouw kalenderdata is privé. Alleen jij ziet de gastgegevens. De publieke embed toont enkel beschikbaarheid.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    titel: "Altijd up-to-date",
    tekst: "Wijzig je kalender en bezoekers van je website zien het meteen. Geen handmatige synchronisatie nodig.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4M8 14h4M8 17h2" />
      </svg>
    ),
    titel: "iCal synchronisatie",
    tekst: "Koppel je kalender aan Google Agenda, Outlook of Apple Kalender via een iCal URL. Bezettingen worden automatisch doorgegeven.",
  },
];

const plans = [
  {
    naam: "Free",
    prijs: "Gratis",
    periode: "",
    beschrijving: "Voor verhuurders die starten met digitaal beheer.",
    kenmerken: [
      "1 kalender",
      "Max 100 boekingen",
      "Beschikbaarheid tonen (bezet/vrij/optie)",
      "Gastnaam per periode",
      "Notities per boeking",
      "Embed op je website",
      "iCal URL exporteren (Google Agenda, Outlook, Apple)",
    ],
    nee: ["iCal importeren (Airbnb, Booking.com...)", "Meerdere kalenders", "Betalingen ontvangen"],
    cta: "Gratis starten",
    href: "/aanmelden",
    accent: false,
    binnenkort: false,
  },
  {
    naam: "Lite",
    prijs: "€9",
    periode: "/maand",
    beschrijving: "Onbeperkt kalenders, onbeperkte boekingen.",
    kenmerken: [
      "Onbeperkt kalenders",
      "Onbeperkt boekingen",
      "Alles van Free",
      "Beschikbaarheid delen via link",
      "Boekingen synchroniseren (iCal import)",
      "Prioritair support",
    ],
    nee: [],
    cta: "Binnenkort beschikbaar",
    href: "#",
    accent: false,
    binnenkort: true,
  },
  {
    naam: "Pro",
    prijs: "€15",
    periode: "/maand excl. BTW",
    beschrijving: "Onbeperkt kalenders en alle functies.",
    kenmerken: [
      "Onbeperkt kalenders",
      "Onbeperkt boekingen",
      "Alles van Lite",
      "Direct betalingen ontvangen",
      "Betaalverzoeken versturen",
      "Reserveringen ontvangen via website",
      "Kortingscodes",
      "E-mail templates & automatisering",
      "Rapportages uitdraaien",
      "SMS alerts",
      "Gebruikersrollen",
    ],
    nee: [],
    cta: "Binnenkort beschikbaar",
    href: "#",
    accent: true,
    binnenkort: true,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-800 to-accent pt-20 pb-28 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Gratis starten — geen creditcard nodig
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Jouw beschikbaarheidskalender,<br className="hidden sm:block" /> altijd up-to-date
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Beheer je reservaties en toon je beschikbaarheid op je eigen website.
            Eenvoudig, snel en zonder technische kennis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/aanmelden" className="bg-white text-accent font-bold px-8 py-3.5 rounded-xl hover:bg-warm-50 transition-colors text-base">
              Gratis starten
            </Link>
            <Link href="/prijzen" className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base">
              Bekijk plannen
            </Link>
          </div>
        </div>
      </section>

      {/* Kalender preview mockup */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-warm-100 overflow-hidden">
          <div className="bg-warm-50 border-b border-warm-100 px-6 py-4 flex items-center justify-between">
            <span className="font-semibold text-warm-900">Chalet de Ardennen — Mei 2026</span>
            <div className="flex gap-4 text-xs text-warm-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-200 inline-block" />Bezet</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-200 inline-block" />Optie</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-100 border border-green-200 inline-block" />Vrij</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
                <div key={d} className="text-xs text-warm-400 font-medium py-1">{d}</div>
              ))}
              {[...Array(3)].map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const bezet = [1,2,3,4,5,6,7,8,16,17,18,19,20,21,22,29,30,31].includes(day);
                const optie = [13,14,15].includes(day);
                return (
                  <div
                    key={day}
                    className={`py-2 rounded-lg text-sm font-medium ${
                      bezet ? "bg-red-100 text-red-700" :
                      optie ? "bg-amber-100 text-amber-700" :
                      "text-warm-600 bg-green-50"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-warm-900 mb-3">Alles wat je nodig hebt</h2>
          <p className="text-warm-500 max-w-xl mx-auto">
            Geen ingewikkeld systeem. Gewoon een kalender die werkt, waar je ook bent.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.titel} className="bg-white rounded-2xl border border-warm-100 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">{f.titel}</h3>
              <p className="text-sm text-warm-500 leading-relaxed">{f.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-warm-50 py-20 px-4" id="prijzen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-900 mb-3">Eenvoudige prijzen</h2>
            <p className="text-warm-500">Start gratis. Upgrade wanneer je wil.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.naam}
                className={`bg-white rounded-2xl border shadow-sm p-8 flex flex-col ${
                  plan.accent ? "border-accent ring-2 ring-accent/20" : "border-warm-100"
                }`}
              >
                {plan.accent && (
                  <div className="text-xs font-semibold text-accent bg-accent-light px-3 py-1 rounded-full self-start mb-4">
                    Populairste keuze
                  </div>
                )}
                <h3 className="text-xl font-bold text-warm-900">{plan.naam}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-extrabold text-warm-900">{plan.prijs}</span>
                  <span className="text-warm-400 text-sm">{plan.periode}</span>
                </div>
                <p className="text-sm text-warm-500 mb-6">{plan.beschrijving}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.kenmerken.map((k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-warm-700">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {k}
                    </li>
                  ))}
                  {plan.nee.map((k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-warm-300">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {k}
                    </li>
                  ))}
                </ul>
                {plan.binnenkort ? (
                  <div className="text-center text-sm text-warm-400 bg-warm-50 rounded-xl py-3 font-medium">
                    Binnenkort beschikbaar
                  </div>
                ) : (
                  <Link href={plan.href} className="text-center font-semibold py-3 rounded-xl transition-colors text-sm bg-warm-900 hover:bg-warm-800 text-white">
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-warm-900 mb-4">Klaar om te starten?</h2>
          <p className="text-warm-500 mb-8">
            Maak je gratis account aan en heb je eerste kalender in minder dan 2 minuten klaar.
          </p>
          <Link href="/aanmelden" className="bg-accent hover:bg-accent-hover text-white font-bold px-10 py-4 rounded-xl transition-colors text-base inline-block">
            Gratis account aanmaken
          </Link>
        </div>
      </section>
    </>
  );
}
