import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-warm-900 text-warm-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-warm-300">
                <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
              </svg>
              <span className="font-bold text-warm-50">Verhuurplanner</span>
            </div>
            <p className="text-sm text-warm-400 leading-relaxed">
              De eenvoudigste beschikbaarheidskalender voor vakantieverhuurders.
            </p>
          </div>

          <div>
            <h3 className="text-warm-50 font-semibold text-sm uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/prijzen" className="hover:text-warm-50 transition-colors">Prijzen</Link></li>
              <li><Link href="/aanmelden" className="hover:text-warm-50 transition-colors">Gratis starten</Link></li>
              <li><Link href="/faq" className="hover:text-warm-50 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-warm-50 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-warm-50 font-semibold text-sm uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/login" className="hover:text-warm-50 transition-colors">Inloggen</Link></li>
              <li><Link href="/aanmelden" className="hover:text-warm-50 transition-colors">Aanmelden</Link></li>
              <li><Link href="/dashboard" className="hover:text-warm-50 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-warm-50 font-semibold text-sm uppercase tracking-wider mb-4">Juridisch</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-warm-50 transition-colors">Privacybeleid</Link></li>
              <li><Link href="/voorwaarden" className="hover:text-warm-50 transition-colors">Algemene voorwaarden</Link></li>
              <li><Link href="/cookiebeleid" className="hover:text-warm-50 transition-colors">Cookiebeleid</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-warm-800 mt-10 pt-6 text-center text-xs text-warm-500">
          &copy; {year} verhuurplanner.be — Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
