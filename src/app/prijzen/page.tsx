import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijzen — Verhuurplanner",
  description: "Bekijk de abonnementen van Verhuurplanner. Start gratis met je eerste kalender.",
  alternates: { canonical: "https://www.verhuurplanner.be/prijzen" },
};

const check = (
  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const cross = (
  <svg className="w-4 h-4 text-warm-300 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function PrijzenPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-warm-900 mb-4">Eenvoudige prijzen</h1>
        <p className="text-warm-500 text-lg">Start gratis. Geen creditcard nodig. Upgrade wanneer je wil.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16 items-start">

        {/* FREE */}
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 flex flex-col">
          <h2 className="text-xl font-bold text-warm-900">Free</h2>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-extrabold text-warm-900">Gratis</span>
          </div>
          <p className="text-sm text-warm-500 mb-6">Voor verhuurders die starten.</p>

          <div className="space-y-4 flex-1 mb-8">
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Boekingen beheren</p>
              <ul className="space-y-2">
                {["Max 100 boekingen", "Overzicht van alle boekingen"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
                <li className="flex items-start gap-2 text-sm text-warm-300">{cross}Onbeperkt boekingen</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Online beschikbaarheid</p>
              <ul className="space-y-2">
                {["Embed op je website", "iCal URL exporteren (Google Agenda, Outlook, Apple)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
                {["iCal importeren (Airbnb, Booking.com...)", "Beschikbaarheid delen via link"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-300">{cross}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Extra</p>
              <ul className="space-y-2">
                {["Gastnaam per periode", "Notities per boeking"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/aanmelden" className="text-center bg-warm-900 hover:bg-warm-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
            Gratis starten
          </Link>
        </div>

        {/* LITE */}
        <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-8 flex flex-col">
          <h2 className="text-xl font-bold text-warm-900">Lite</h2>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-extrabold text-warm-900">€9</span>
            <span className="text-warm-400 text-sm">/maand</span>
          </div>
          <p className="text-sm text-warm-500 mb-6">Onbeperkt kalenders, onbeperkte boekingen.</p>

          <div className="space-y-4 flex-1 mb-8">
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Boekingen beheren</p>
              <ul className="space-y-2">
                {["Onbeperkt boekingen", "Overzicht van alle boekingen"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Online beschikbaarheid</p>
              <ul className="space-y-2">
                {["Onbeperkt kalenders", "Embed op je website", "iCal URL exporteren", "iCal importeren (Airbnb, Booking.com...)", "Beschikbaarheid delen via link"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Extra</p>
              <ul className="space-y-2">
                {["Gastnaam per periode", "Notities per boeking", "Prioritair support"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-warm-400 bg-warm-50 rounded-xl py-3">Binnenkort beschikbaar</div>
        </div>

        {/* PRO */}
        <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-accent shadow-lg p-8 flex flex-col">
          <div className="absolute top-5 -right-8 w-36 bg-accent text-white text-[10px] font-bold text-center py-1 rotate-45 shadow-sm tracking-wide uppercase">
            Meest compleet
          </div>
          <h2 className="text-xl font-bold text-warm-900">Pro</h2>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-extrabold text-warm-900">€15</span>
            <span className="text-warm-400 text-sm">/maand excl. BTW</span>
          </div>
          <p className="text-sm text-warm-500 mb-6">Onbeperkt kalenders en alle functies.</p>

          <div className="space-y-4 flex-1 mb-8">
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Boekingen beheren</p>
              <ul className="space-y-2">
                {["Onbeperkt kalenders", "Onbeperkt boekingen", "Overzicht van alle boekingen"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Online beschikbaarheid</p>
              <ul className="space-y-2">
                {["Embed op je website", "iCal URL exporteren", "iCal importeren", "Beschikbaarheid delen via link", "E-mails versturen"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Betalingen</p>
              <ul className="space-y-2">
                {["Direct betalingen ontvangen", "Betaalverzoeken versturen", "Betaalverzoeken inplannen", "Geen aansluitkosten"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Pro functies</p>
              <ul className="space-y-2">
                {["Gebruikersrollen", "E-mail templates", "E-mails inplannen", "Rapportages uitdraaien", "SMS alerts ontvangen"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-400 uppercase tracking-wide mb-2">Reserveringen ontvangen</p>
              <ul className="space-y-2">
                {["Boekingen ontvangen via website", "Prijzen & services toevoegen", "Persoonlijk contactformulier", "Kortingscodes"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-warm-700">{check}{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-warm-400 bg-warm-50 rounded-xl py-3">Binnenkort beschikbaar</div>
        </div>

      </div>

      <div className="text-center">
        <p className="text-warm-500 text-sm">Vragen over de plannen? <Link href="/contact" className="text-accent hover:underline">Neem contact op</Link></p>
      </div>
    </div>
  );
}
