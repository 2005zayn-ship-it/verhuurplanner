import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde vragen — Verhuurplanner",
  description: "Antwoorden op veelgestelde vragen over Verhuurplanner — de beschikbaarheidskalender voor vakantieverhuurders.",
  alternates: { canonical: "https://www.verhuurplanner.be/faq" },
};

const faqs = [
  { v: "Is Verhuurplanner gratis?", a: "Het Basic plan is volledig gratis. Je krijgt 1 kalender waarmee je beschikbaarheid, gastnamen en notities bijhoudt. Premium en Gold plannen (binnenkort beschikbaar) bieden meer kalenders en extra functies." },
  { v: "Hoe werkt de embed op mijn website?", a: "Je kopieert een regel code uit je kalenderinstellingen en plakt die op je website. De kalender toont automatisch je actuele beschikbaarheid. Bezoekers zien enkel bezet of vrij — geen gastgegevens." },
  { v: "Kunnen bezoekers van mijn website reservaties maken?", a: "Nee. De publieke kalender is enkel ter informatie. Reservaties maak je zelf in je dashboard, na contact met de gast." },
  { v: "Werkt de embed op WordPress, Wix en Squarespace?", a: "Ja. De embed werkt op elke website die custom HTML-code ondersteunt. Dat is WordPress, Wix, Squarespace, Webflow en de meeste andere website-builders." },
  { v: "Is mijn data veilig?", a: "Ja. Gastgegevens zijn enkel zichtbaar voor jou in je dashboard. De publieke embed toont uitsluitend bezet/vrij informatie, zonder namen of notities." },
  { v: "Kan ik meerdere woningen beheren?", a: "Met het Basic plan beheer je 1 kalender. Met Premium (3 kalenders) en Gold (10 kalenders) — binnenkort beschikbaar — beheer je meerdere woningen." },
  { v: "Moet ik een app installeren?", a: "Nee. Verhuurplanner werkt volledig in je webbrowser. Geen app nodig, werkt op computer, tablet en smartphone." },
  { v: "Kan ik mijn account verwijderen?", a: "Ja. Neem contact op via het contactformulier en we verwijderen je account en alle gegevens." },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-warm-900 mb-2">Veelgestelde vragen</h1>
      <p className="text-warm-400 text-sm mb-10">Staat je vraag er niet bij? <a href="/contact" className="text-accent hover:underline">Stuur ons een bericht.</a></p>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white rounded-2xl border border-warm-100 shadow-sm group">
            <summary className="px-6 py-4 font-semibold text-warm-900 cursor-pointer list-none flex items-center justify-between">
              {faq.v}
              <svg className="w-5 h-5 text-warm-400 group-open:rotate-180 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-sm text-warm-600 leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
