import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijzen — Verhuurplanner",
  description: "Bekijk de abonnementen van Verhuurplanner. Start gratis met je eerste kalender.",
  alternates: { canonical: "https://www.verhuurplanner.be/prijzen" },
};

export default function PrijzenPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-warm-900 mb-4">Eenvoudige prijzen</h1>
        <p className="text-warm-500 text-lg">Start gratis. Geen creditcard nodig. Upgrade wanneer je wil.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            naam: "Basic",
            prijs: "Gratis",
            periode: "",
            desc: "Voor verhuurders die starten.",
            features: ["1 kalender", "Beschikbaarheid (bezet/vrij/optie)", "Gastnaam per periode", "Notities per boeking", "Embed op je website"],
            cta: "Gratis starten",
            href: "/aanmelden",
            highlight: false,
            binnenkort: false,
          },
          {
            naam: "Premium",
            prijs: "€9",
            periode: "/maand",
            desc: "Volledige controle.",
            features: ["3 kalenders", "Alles van Basic", "Inkomsten bijhouden", "Exporteren PDF/Excel", "Seizoensprijzen", "Prioritair support"],
            cta: "Binnenkort beschikbaar",
            href: "#",
            highlight: true,
            binnenkort: true,
          },
          {
            naam: "Gold",
            prijs: "€19",
            periode: "/maand",
            desc: "Meerdere woningen.",
            features: ["Tot 10 kalenders", "Alles van Premium", "Overzicht alle woningen", "Statistieken", "Geavanceerde rapportage"],
            cta: "Binnenkort beschikbaar",
            href: "#",
            highlight: false,
            binnenkort: true,
          },
        ].map(plan => (
          <div key={plan.naam} className={`relative overflow-hidden bg-white rounded-2xl border shadow-sm p-8 flex flex-col ${plan.highlight ? "border-accent ring-2 ring-accent/20" : "border-warm-100"}`}>
            {plan.binnenkort && (
              <div className="absolute top-5 -right-8 w-36 bg-amber-400 text-white text-[10px] font-bold text-center py-1 rotate-45 shadow-sm tracking-wide uppercase">
                Binnenkort
              </div>
            )}
            {plan.highlight && <span className="text-xs font-semibold text-accent bg-accent-light px-3 py-1 rounded-full self-start mb-4">Populairste keuze</span>}
            <h2 className="text-xl font-bold text-warm-900">{plan.naam}</h2>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-extrabold text-warm-900">{plan.prijs}</span>
              <span className="text-warm-400 text-sm">{plan.periode}</span>
            </div>
            <p className="text-sm text-warm-500 mb-6">{plan.desc}</p>
            <ul className="space-y-2.5 flex-1 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-warm-700">
                  <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan.binnenkort ? (
              <div className="text-center text-sm text-warm-400 bg-warm-50 rounded-xl py-3">Binnenkort beschikbaar</div>
            ) : (
              <Link href={plan.href} className="text-center bg-warm-900 hover:bg-warm-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-warm-500 text-sm">Vragen over de plannen? <Link href="/contact" className="text-accent hover:underline">Neem contact op</Link></p>
      </div>
    </div>
  );
}
