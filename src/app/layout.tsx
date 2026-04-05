import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.verhuurplanner.be"),
  title: {
    default: "Verhuurplanner | Beschikbaarheidskalender voor vakantieverhuurders",
    template: "%s | Verhuurplanner",
  },
  description:
    "Beheer je beschikbaarheid, reservaties en gasten in één eenvoudige kalender. De slimste planningstool voor vakantieverhuurders in België en Nederland.",
  keywords: [
    "beschikbaarheidskalender verhuurder",
    "vakantiewoning kalender",
    "reservatiesysteem verhuurder",
    "verhuurkalender",
    "beschikbaarheid bijhouden vakantiewoning",
    "kalender vakantieverhuur",
    "boekingskalender vakantiewoning",
    "verhuurplanner",
    "vakantiewoning beheer",
  ],
  authors: [{ name: "Verhuurplanner" }],
  creator: "Verhuurplanner",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: "https://www.verhuurplanner.be",
    siteName: "Verhuurplanner",
    title: "Verhuurplanner | Beschikbaarheidskalender voor vakantieverhuurders",
    description:
      "Beheer je beschikbaarheid, reservaties en gasten in één eenvoudige kalender.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Verhuurplanner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verhuurplanner",
    description: "Beschikbaarheidskalender voor vakantieverhuurders.",
  },
  alternates: {
    canonical: "https://www.verhuurplanner.be",
    languages: { "nl-BE": "https://www.verhuurplanner.be" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE">
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-readable site description" />
      </head>
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner gaId={GA_ID} />
      </body>
    </html>
  );
}
