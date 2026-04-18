import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verhuurplanner | Compleet reserveringssysteem voor vakantieverhuurders",
  description: "Boekingen, betalingen en communicatie in één platform. Geen losse mails, geen manuele opvolging. Gratis starten.",
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
    plan: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    titel: "Gastnaam en notities",
    tekst: "Noteer wie wanneer verblijft. Aankomsttijd, sleutelafspraak, speciale wensen — alles bij de boeking.",
    plan: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    titel: "Embed op je eigen website",
    tekst: "Toon je beschikbaarheidskalender op je website met één regel code. Automatisch bijgewerkt, altijd correct.",
    plan: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4M8 14h4M8 17h2" />
      </svg>
    ),
    titel: "iCal export en import",
    tekst: "Exporteer naar Google Agenda, Outlook of Apple Kalender. Importeer bezettingen van Airbnb of Booking.com automatisch.",
    plan: "Lite",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    titel: "Beschikbaarheid delen",
    tekst: "Stuur gasten een directe link naar je beschikbaarheidskalender. Geen login nodig, altijd up-to-date.",
    plan: "Lite",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
      </svg>
    ),
    titel: "Betalingen ontvangen",
    tekst: "Gasten betalen bij het boeken via een beveiligde betaalpagina. Automatische opvolging zonder dat jij erachteraan moet.",
    plan: "Pro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    titel: "Boekingen ontvangen",
    tekst: "Gasten boeken rechtstreeks via je eigen website. Jij krijgt een melding, zij krijgen een bevestiging. Geen losse mails meer.",
    plan: "Pro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    titel: "E-mail templates",
    tekst: "Stel je eigen e-mailtemplates in voor boekingsbevestigingen en herinneringen. Jij configureert ze eenmalig, het systeem verstuurt.",
    plan: "Pro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    titel: "Rapportages",
    tekst: "Bekijk je bezettingsgraad, inkomsten en boekingsoverzicht per periode. Handig voor je boekhouding.",
    plan: "Pro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.93 3.18 2 2 0 0 1 3.9 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    titel: "SMS alerts",
    tekst: "Ontvang een sms bij elke nieuwe boeking of betaling. Nooit een reservatie missen, ook niet onderweg.",
    plan: "Pro",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    titel: "Veilig en privé",
    tekst: "Gastgegevens zijn enkel voor jou zichtbaar. De publieke kalender toont alleen beschikbaarheid, nooit namen.",
    plan: null,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    titel: "Gebruikersrollen",
    tekst: "Geef medewerkers of mede-verhuurders toegang tot specifieke kalenders, zonder volledige beheerdersrechten.",
    plan: "Pro",
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
  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Verhuurplanner",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description: "Compleet reserveringssysteem voor vakantieverhuurders. Boekingen, betalingen en communicatie in één platform.",
    url: "https://www.verhuurplanner.be",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />

      {/* Hero — tweekolomslayout */}
      <section className="bg-gradient-to-br from-warm-900 via-warm-800 to-accent px-4 pt-16 pb-8 md:pt-20 md:pb-0 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Tekst */}
          <div className="flex-1 text-white text-center md:text-left pb-4 md:pb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Gratis starten — geen creditcard nodig
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Jouw verhuuradministratie,<br />
              <span className="text-white/70">volledig geautomatiseerd.</span>
            </h1>
            <p className="text-lg text-white/75 mb-8 max-w-lg">
              Geen losse mails, geen manuele opvolging. Boekingen, betalingen en communicatie lopen automatisch via één platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/aanmelden" className="bg-white text-accent font-bold px-8 py-3.5 rounded-xl hover:bg-warm-50 transition-colors text-base shadow-lg">
                Gratis starten
              </Link>
              <Link href="#hoe-het-werkt" className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base">
                Hoe werkt het?
              </Link>
            </div>
            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-white/50 justify-center md:justify-start">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Geen creditcard
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Data opgeslagen in de EU
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                AVG/GDPR-conform
              </span>
            </div>
          </div>

          {/* Kalender mockup — zweeft uit de hero */}
          <div className="flex-1 w-full max-w-md md:max-w-none md:translate-y-10">
            <div className="bg-white rounded-2xl shadow-2xl border border-warm-100 overflow-hidden">
              <div className="bg-warm-50 border-b border-warm-100 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-amber-300" />
                  <div className="w-3 h-3 rounded-full bg-green-300" />
                </div>
                <span className="text-sm font-semibold text-warm-700">Chalet de Ardennen — Mei 2026</span>
                <div className="flex gap-3 text-xs text-warm-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-200 inline-block" />Bezet</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-200 inline-block" />Optie</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-100 border border-green-200 inline-block" />Vrij</span>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
                    <div key={d} className="text-xs text-warm-400 font-medium py-1">{d}</div>
                  ))}
                  {[...Array(3)].map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const bezet = [1,2,3,4,5,6,7,8,16,17,18,19,20,21,22,29,30,31].includes(day);
                    const optie = [13,14,15].includes(day);
                    return (
                      <div key={day} className={`py-2 rounded-lg text-sm font-medium ${
                        bezet ? "bg-red-100 text-red-700" :
                        optie ? "bg-amber-100 text-amber-700" :
                        "text-warm-600 bg-green-50"
                      }`}>
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Boeking detail strip */}
              <div className="border-t border-warm-100 px-5 py-3 flex items-center gap-3 bg-warm-50">
                <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-accent text-xs font-bold shrink-0">JV</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-warm-900">Jan Vermeersch</div>
                  <div className="text-xs text-warm-400">1–8 mei · Aankomst 15u · Huisdier mee</div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full shrink-0">Bevestigd</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">In 3 stappen</span>
          <h2 className="text-3xl font-bold text-warm-900 mt-2 mb-3">Van aanmelden tot live kalender</h2>
          <p className="text-warm-500 max-w-lg mx-auto">Geen handleiding nodig. Je kalender staat online nog voor je koffie klaar is.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-warm-100" />
          {[
            {
              stap: "1",
              titel: "Account aanmaken",
              tekst: "Registreer gratis — enkel je e-mailadres nodig. Geen betaalkaart, geen verplichtingen.",
              kleur: "bg-accent text-white",
            },
            {
              stap: "2",
              titel: "Kalender instellen",
              tekst: "Voeg je woning toe, geef haar een naam en kleur. Boekingen invoeren gaat met twee klikken.",
              kleur: "bg-accent text-white",
            },
            {
              stap: "3",
              titel: "Delen en synchroniseren",
              tekst: "Embed de kalender op je website of deel een link. Koppel Airbnb of Booking.com via iCal.",
              kleur: "bg-accent text-white",
            },
          ].map((s) => (
            <div key={s.stap} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl ${s.kleur} flex items-center justify-center text-2xl font-extrabold mb-5 shadow-md`}>
                {s.stap}
              </div>
              <h3 className="font-bold text-warm-900 text-lg mb-2">{s.titel}</h3>
              <p className="text-warm-500 text-sm leading-relaxed">{s.tekst}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/aanmelden" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
            Nu starten
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* Meer dan een kalender */}
      <section className="bg-warm-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">Pro functies</span>
            <h2 className="text-3xl font-bold text-warm-900 mt-2 mb-3">Meer dan een kalender</h2>
            <p className="text-warm-500 max-w-lg mx-auto">
              Verhuurplanner beheert het volledige traject van eerste aanvraag tot betaling en afreis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Automatische communicatie */}
            <div className="bg-white rounded-2xl border border-warm-100 p-7 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-accent text-white px-2.5 py-0.5 rounded-full">Pro</span>
              </div>
              <h3 className="font-bold text-warm-900 text-lg mb-2">Automatische communicatie</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                Stel e-mailtemplates in voor bevestigingen en herinneringen. Jij configureert, het systeem verstuurt.
              </p>
            </div>

            {/* Online betalingen */}
            <div className="bg-white rounded-2xl border border-warm-100 p-7 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <path d="M1 10h22" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-accent text-white px-2.5 py-0.5 rounded-full">Pro</span>
              </div>
              <h3 className="font-bold text-warm-900 text-lg mb-2">Online betalingen</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                Laat gasten betalen bij het boeken. Automatische opvolging zonder dat jij erachteraan moet.
              </p>
            </div>

            {/* Boekingsmodule */}
            <div className="bg-white rounded-2xl border border-warm-100 p-7 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-accent text-white px-2.5 py-0.5 rounded-full">Pro</span>
              </div>
              <h3 className="font-bold text-warm-900 text-lg mb-2">Boekingsmodule op je site</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                Gasten boeken rechtstreeks via je eigen website. Jij krijgt een melding, zij krijgen een bevestiging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* iCal sync — dubbele boekingen */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hub visual */}
            <div className="relative flex items-center justify-center h-72">
              {/* Center */}
              <div className="absolute z-10 w-24 h-24 bg-warm-900 rounded-2xl flex flex-col items-center justify-center shadow-xl">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
                <span className="text-white text-xs font-semibold mt-1 leading-tight text-center px-1">Verhuur-planner</span>
              </div>
              {/* Platforms — orbiting */}
              {[
                { naam: "Booking", kleur: "bg-[#003580] text-white", pos: "top-0 left-1/2 -translate-x-1/2" },
                { naam: "Airbnb", kleur: "bg-[#FF5A5F] text-white", pos: "top-1/2 right-0 -translate-y-1/2" },
                { naam: "Tripadvisor", kleur: "bg-[#34E0A1] text-warm-900", pos: "bottom-0 left-1/2 -translate-x-1/2" },
                { naam: "Micazu", kleur: "bg-[#0077C8] text-white", pos: "top-1/2 left-0 -translate-y-1/2" },
                { naam: "vakantie-woningen.be", kleur: "bg-accent text-white", pos: "top-6 right-12" },
              ].map(p => (
                <div key={p.naam} className={`absolute ${p.pos} ${p.kleur} rounded-xl px-3 py-2 text-xs font-bold shadow-md text-center leading-tight`}>
                  {p.naam}
                </div>
              ))}
              {/* Connection lines (decorative) */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-warm-100" style={{ width: "85%", height: "85%", top: "7.5%", left: "7.5%" }} />
            </div>

            {/* Text */}
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">iCal synchronisatie</span>
              <h2 className="text-3xl font-bold text-warm-900 mt-2 mb-4">Dubbele boekingen<br />zijn verleden tijd.</h2>
              <p className="text-warm-500 mb-6 leading-relaxed">Verhuur je via Airbnb, Booking.com, Tripadvisor of Micazu? Koppel hun kalender aan Verhuurplanner en alle bezettingen verschijnen automatisch in jouw overzicht. Jij voert niets dubbel in.</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Elke boeking van elk platform in één kalender",
                  "Automatisch gesynchroniseerd via iCal",
                  "Werkt ook met vakantiewoningen-in-belgie.be",
                  "Geen technische kennis nodig",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-warm-700">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
              <a href="/aanmelden" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Gratis koppelen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embed — kalender op je website */}
      <section className="bg-warm-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-widest">Beschikbaarheidswidget</span>
              <h2 className="text-3xl font-bold text-warm-900 mt-2 mb-4">Je kalender op je<br />eigen website.</h2>
              <p className="text-warm-500 mb-6 leading-relaxed">Kopieer één regel code en plak die op je website. Je bezoekers zien direct wanneer je woning vrij is. Altijd up-to-date, geen handmatig aanpassen.</p>
              <ul className="space-y-3 mb-6">
                {[
                  "Werkt op elke website en elk platform",
                  "Automatisch bijgewerkt bij elke wijziging",
                  "Kleur aanpasbaar aan je huisstijl",
                  "Toont enkel beschikbaarheid — geen gastgegevens",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-warm-700">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {t}
                  </li>
                ))}
              </ul>
              {/* Platform badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["WordPress", "Wix", "Squarespace", "Webflow", "HTML", "Joomla"].map(p => (
                  <span key={p} className="bg-white border border-warm-200 text-warm-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">{p}</span>
                ))}
              </div>
              <a href="/aanmelden" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
                Gratis embed instellen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>

            {/* Embed mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-warm-100 overflow-hidden max-w-sm mx-auto w-full">
              <div className="border-t-4 border-accent px-4 py-3 border-b border-warm-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-warm-900 text-sm">Chalet de Ardennen</div>
                  <div className="text-xs text-warm-400">Beschikbaarheidskalender</div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg bg-warm-50 flex items-center justify-center text-warm-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span className="text-xs font-medium text-warm-700 w-24 text-center">mei 2026</span>
                  <button className="w-7 h-7 rounded-lg bg-warm-50 flex items-center justify-center text-warm-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Ma","Di","Wo","Do","Vr","Za","Zo"].map(d => (
                    <div key={d} className="text-center text-xs text-warm-300 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {[...Array(3)].map((_,i) => <div key={`p${i}`} />)}
                  {Array.from({length:31},(_,i)=>i+1).map(day => {
                    const bezet = [1,2,3,4,5,6,7,16,17,18,19,20,21,22,29,30,31].includes(day);
                    const vrij = [8,9,10,11,12,13,14,15,23,24,25,26,27,28].includes(day);
                    return (
                      <div key={day} className={`text-center py-1.5 rounded text-xs font-medium ${
                        bezet ? "bg-red-100 text-red-600" : vrij ? "text-warm-600" : "text-warm-400"
                      }`}>{day}</div>
                    );
                  })}
                </div>
                <div className="flex gap-3 mt-3 pt-3 border-t border-warm-50 text-xs text-warm-400 justify-center">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-100 inline-block"/>Bezet</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-warm-100 inline-block"/>Vrij</span>
                </div>
              </div>
              <div className="border-t border-warm-50 px-4 py-2 text-center">
                <span className="text-xs text-warm-300">verhuurplanner.be</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-warm-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest">Functies</span>
          <h2 className="text-3xl font-bold text-warm-900 mt-2 mb-3">Alles wat je nodig hebt</h2>
          <p className="text-warm-500 max-w-xl mx-auto">
            Van gratis basisbeheer tot volledige automatisering. Kies wat bij jou past.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.titel} className="bg-white rounded-2xl border border-warm-100 p-6 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                  {f.icon}
                </div>
                {f.plan && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    f.plan === "Pro" ? "bg-accent text-white" : "bg-accent-light text-accent"
                  }`}>
                    {f.plan}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">{f.titel}</h3>
              <p className="text-sm text-warm-500 leading-relaxed">{f.tekst}</p>
            </div>
          ))}
        </div>
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

      {/* Veiligheid */}
      <section className="bg-warm-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-warm-900 mb-3">Veiligheid voorop</h2>
            <p className="text-warm-500 max-w-lg mx-auto">Jouw gegevens en die van je gasten zijn veilig bij ons. Alles is versleuteld, opgeslagen in de EU en strikt privé.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                titel: "SSL-versleuteling",
                tekst: "Alle gegevens worden versleuteld verzonden via HTTPS. Geen enkel gegeven gaat over het net zonder beveiliging.",
              },
              {
                icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
                titel: "Opslag in de EU",
                tekst: "Je data wordt opgeslagen op servers binnen de Europese Unie, conform de AVG/GDPR.",
              },
              {
                icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
                titel: "Privé gastgegevens",
                tekst: "Gastnames en notities zijn enkel zichtbaar voor jou. De publieke kalender toont alleen beschikbaarheid.",
              },
              {
                icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
                titel: "AVG/GDPR-conform",
                tekst: "We verwerken enkel de gegevens die noodzakelijk zijn voor de dienst en delen ze nooit voor commerciële doeleinden.",
              },
            ].map((item) => (
              <div key={item.titel} className="bg-white rounded-2xl border border-warm-100 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{item.icon}</svg>
                </div>
                <h3 className="font-semibold text-warm-900 mb-2">{item.titel}</h3>
                <p className="text-sm text-warm-500 leading-relaxed">{item.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-warm-900 to-accent rounded-3xl px-8 py-14 text-center text-white shadow-xl">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-3xl font-extrabold mb-4">Klaar om je verhuuradministratie te automatiseren?</h2>
          <p className="text-white/75 mb-8 text-lg max-w-xl mx-auto">
            Je eerste kalender staat in 2 minuten online. Gratis starten, upgraden wanneer je wil.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/aanmelden" className="bg-white text-accent font-bold px-10 py-4 rounded-xl hover:bg-warm-50 transition-colors text-base shadow-md">
              Gratis account aanmaken
            </Link>
            <Link href="/prijzen" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base">
              Bekijk plannen
            </Link>
          </div>
          <p className="text-white/40 text-sm mt-6">Geen creditcard. Geen verplichtingen. Wanneer je wil upgraden, doe je dat gewoon.</p>
        </div>
      </section>
    </>
  );
}
