import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artikelen } from "@/lib/blog-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return artikelen.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artikel = artikelen.find((a) => a.slug === slug);
  if (!artikel) return {};

  return {
    title: artikel.metaTitle,
    description: artikel.metaDescription,
    alternates: {
      canonical: `https://www.verhuurplanner.be/blog/${artikel.slug}`,
    },
    openGraph: {
      title: artikel.metaTitle,
      description: artikel.metaDescription,
      url: `https://www.verhuurplanner.be/blog/${artikel.slug}`,
      type: "article",
      publishedTime: artikel.datum,
      modifiedTime: artikel.gewijzigd,
    },
  };
}

function formatDatum(datum: string): string {
  const d = new Date(datum);
  return d.toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogArtikelPagina({ params }: Props) {
  const { slug } = await params;
  const artikel = artikelen.find((a) => a.slug === slug);

  if (!artikel) notFound();

  const andereArtikelen = artikelen
    .filter((a) => a.slug !== slug)
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: artikel.titel,
    description: artikel.metaDescription,
    url: `https://www.verhuurplanner.be/blog/${artikel.slug}`,
    datePublished: artikel.datum,
    dateModified: artikel.gewijzigd,
    author: {
      "@type": "Organization",
      name: "Verhuurplanner",
      url: "https://www.verhuurplanner.be",
    },
    publisher: {
      "@type": "Organization",
      name: "Verhuurplanner",
      url: "https://www.verhuurplanner.be",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.verhuurplanner.be/blog/${artikel.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + meta */}
      <div className="bg-warm-50 border-b border-warm-100 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-warm-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-warm-600 truncate max-w-xs">{artikel.titel}</span>
          </nav>
        </div>
      </div>

      {/* Artikel */}
      <article className="max-w-2xl mx-auto px-4 py-14">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs text-warm-400 mb-4">
            <time dateTime={artikel.datum}>{formatDatum(artikel.datum)}</time>
            <span>&middot;</span>
            <span>{artikel.leestijd} min leestijd</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-warm-900 leading-tight mb-4">
            {artikel.titel}
          </h1>
          <p className="text-warm-500 text-base leading-relaxed border-l-4 border-accent-light pl-4">
            {artikel.excerpt}
          </p>
        </header>

        {/* Inhoud */}
        <div
          className="prose-artikel"
          dangerouslySetInnerHTML={{ __html: artikel.inhoud }}
        />

        {/* CTA onderaan */}
        <div className="mt-16 bg-accent-light rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-warm-900 mb-2">
            Probeer Verhuurplanner gratis
          </h2>
          <p className="text-warm-600 text-sm mb-5">
            Beschikbaarheidskalender met iCal-synchronisatie en embed voor je website.
            Gratis voor één woning, geen creditcard nodig.
          </p>
          <Link
            href="/aanmelden"
            className="bg-accent hover:bg-accent-hover text-white font-semibold px-7 py-3 rounded-xl transition-colors inline-block"
          >
            Gratis starten
          </Link>
        </div>
      </article>

      {/* Andere artikelen */}
      {andereArtikelen.length > 0 && (
        <section className="bg-warm-50 border-t border-warm-100 py-14 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-warm-900">Meer artikelen</h2>
              <Link href="/blog" className="text-sm text-accent hover:underline font-medium">
                Alle artikelen
              </Link>
            </div>
            <div className="space-y-4">
              {andereArtikelen.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl border border-warm-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-warm-400 mb-1">
                      <time dateTime={a.datum}>{formatDatum(a.datum)}</time>
                      <span className="mx-2">&middot;</span>
                      <span>{a.leestijd} min</span>
                    </div>
                    <p className="font-semibold text-warm-900 group-hover:text-accent transition-colors text-sm leading-snug truncate">
                      {a.titel}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-warm-300 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
