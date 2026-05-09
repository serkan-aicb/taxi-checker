import Link from "next/link";
import { Star, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-taxi-blue text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="TaxiChecker">
              <div className="w-8 h-8 bg-taxi-yellow rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-taxi-blue fill-taxi-blue" aria-hidden="true" />
              </div>
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
            <address className="not-italic space-y-2">
              <p className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-taxi-yellow" aria-hidden="true" />
                Siemensstr. 33, 96050 Bamberg
              </p>
              <p className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 shrink-0 text-taxi-yellow" aria-hidden="true" />
                <a href="tel:+4995112063382" className="hover:text-taxi-yellow transition-colors">
                  +49 (0) 951 12063382
                </a>
              </p>
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
          <p className="text-gray-500 text-xs">
            USt-ID: DE334642224
          </p>
        </div>
      </div>
    </footer>
  );
}
