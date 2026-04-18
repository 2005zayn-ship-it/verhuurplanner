import { Metadata } from "next";
import Link from "next/link";
import { artikelen } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog — Tips voor vakantieverhuurders | Verhuurplanner",
  description:
    "Praktische tips en uitleg voor vakantieverhuurders in België en Nederland. Beschikbaarheidskalender, iCal synchronisatie, dubbele boekingen vermijden en meer.",
  alternates: { canonical: "https://www.verhuurplanner.be/blog" },
  openGraph: {
    title: "Blog — Tips voor vakantieverhuurders | Verhuurplanner",
    description:
      "Praktische tips en uitleg voor vakantieverhuurders. Beschikbaarheidskalender, iCal synchronisatie, dubbele boekingen en meer.",
    url: "https://www.verhuurplanner.be/blog",
    type: "website",
  },
};

function formatDatum(datum: string): string {
  const d = new Date(datum);
  return d.toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogOverzicht() {
  const gesorteerd = [...artikelen].sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  return (
    <>
      {/* JSON-LD Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Verhuurplanner Blog",
            description: "Tips en uitleg voor vakantieverhuurders",
            url: "https://www.verhuurplanner.be/blog",
            publisher: {
              "@type": "Organization",
              name: "Verhuurplanner",
              url: "https://www.verhuurplanner.be",
            },
            blogPost: gesorteerd.map((a) => ({
              "@type": "BlogPosting",
              headline: a.titel,
              url: `https://www.verhuurplanner.be/blog/${a.slug}`,
              datePublished: a.datum,
              dateModified: a.gewijzigd,
            })),
          }),
        }}
      />

      {/* Header */}
      <section className="bg-warm-50 border-b border-warm-100 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-warm-900 mb-3">Blog</h1>
          <p className="text-warm-500 text-lg max-w-xl mx-auto">
            Praktische tips voor vakantieverhuurders in België en Nederland.
            Over kalenders, synchronisatie, boekingsbeheer en meer.
          </p>
        </div>
      </section>

      {/* Artikelen grid */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        {gesorteerd.length === 0 ? (
          <div className="text-center py-20 text-warm-400">
            Nog geen artikelen. Kom binnenkort terug.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {gesorteerd.map((artikel) => (
              <Link
                key={artikel.slug}
                href={`/blog/${artikel.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-warm-400 mb-3">
                    <time dateTime={artikel.datum}>{formatDatum(artikel.datum)}</time>
                    <span>&middot;</span>
                    <span>{artikel.leestijd} min leestijd</span>
                  </div>
                  <h2 className="text-lg font-bold text-warm-900 mb-3 group-hover:text-accent transition-colors leading-snug">
                    {artikel.titel}
                  </h2>
                  <p className="text-sm text-warm-500 leading-relaxed flex-1 line-clamp-3">
                    {artikel.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Lees artikel
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-warm-50 border-t border-warm-100 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-warm-900 mb-3">
            Klaar om je kalender te beheren?
          </h2>
          <p className="text-warm-500 mb-6">
            Maak je gratis account aan en heb je eerste kalender in minder dan 2 minuten klaar.
          </p>
          <Link
            href="/aanmelden"
            className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-block"
          >
            Gratis starten
          </Link>
        </div>
      </section>
    </>
  );
}
