import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | TaxiChecker",
  description: "Impressum und Anbieterkennzeichnung von TaxiChecker – taxi-checker.de",
  robots: { index: true, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card p-8 md:p-10">
          <h1 className="text-2xl font-bold text-taxi-blue mb-8 pb-4 border-b border-gray-100">
            Impressum
          </h1>

          <section className="mb-8" aria-labelledby="angaben-title">
            <h2 id="angaben-title" className="font-semibold text-taxi-blue mb-4 text-lg">
              Angaben gemäß § 5 TMG
            </h2>
            <address className="not-italic text-gray-600 space-y-1 text-sm leading-relaxed">
              <p className="font-semibold text-taxi-blue">Serkan Sahin</p>
              <p>Siemensstr. 33</p>
              <p>96050 Bamberg</p>
              <p>Deutschland</p>
            </address>
          </section>

          <section className="mb-8" aria-labelledby="kontakt-title">
            <h2 id="kontakt-title" className="font-semibold text-taxi-blue mb-4 text-lg">
              Kontakt
            </h2>
            <dl className="text-sm text-gray-600 space-y-2">
              <div className="flex gap-2">
                <dt className="font-medium text-taxi-blue w-24 shrink-0">Telefon:</dt>
                <dd>
                  <a href="tel:+4995112063382" className="hover:text-taxi-blue transition-colors">
                    +49 (0) 951 12063382
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-taxi-blue w-24 shrink-0">E-Mail:</dt>
                <dd>
                  <a href="mailto:info@taxi-checker.de" className="hover:text-taxi-blue transition-colors">
                    info@taxi-checker.de
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-taxi-blue w-24 shrink-0">Website:</dt>
                <dd>taxi-checker.de</dd>
              </div>
            </dl>
          </section>

          <section className="mb-8" aria-labelledby="ust-title">
            <h2 id="ust-title" className="font-semibold text-taxi-blue mb-4 text-lg">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p className="text-gray-600 text-sm">
              Gemäß § 27a Umsatzsteuergesetz: <strong>DE334642224</strong>
            </p>
          </section>

          <section className="mb-8" aria-labelledby="haftung-title">
            <h2 id="haftung-title" className="font-semibold text-taxi-blue mb-4 text-lg">
              Haftung für Inhalte
            </h2>
            <div className="text-gray-600 text-sm space-y-3 leading-relaxed">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
                die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
                umgehend entfernen.
              </p>
            </div>
          </section>

          <section className="mb-8" aria-labelledby="urheberrecht-title">
            <h2 id="urheberrecht-title" className="font-semibold text-taxi-blue mb-4 text-lg">
              Urheberrecht
            </h2>
            <div className="text-gray-600 text-sm space-y-3 leading-relaxed">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/"
              className="text-sm text-taxi-yellow hover:text-taxi-yellow-dark transition-colors"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
