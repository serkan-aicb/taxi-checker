import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-taxi-blue text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4" aria-label="TaxiChecker">
              <span className="font-bold text-lg">
                Taxi<span className="text-taxi-yellow">Checker</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Die Bewertungs- und Vertrauensplattform für Taxi- und Fahrdienstfahrer in Deutschland.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-taxi-yellow mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-2">
                {[
                  { href: "/fahrer", label: "Fahrer entdecken" },
                  { href: "/impressum", label: "Impressum" },
                  { href: "/datenschutz", label: "Datenschutz" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gray-400 hover:text-taxi-yellow transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-taxi-yellow mb-4 text-sm uppercase tracking-wider">
              Kontakt
            </h3>
            <address className="not-italic">
              <p className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 shrink-0 text-taxi-yellow" aria-hidden="true" />
                <a href="mailto:info@taxi-checker.de" className="hover:text-taxi-yellow transition-colors">
                  info@taxi-checker.de
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-taxi-blue-muted pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {currentYear} TaxiChecker · taxi-checker.de · Alle Rechte vorbehalten
          </p>
        </div>
      </div>
    </footer>
  );
}
