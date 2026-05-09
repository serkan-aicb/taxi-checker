import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | TaxiChecker",
  description: "Datenschutzerklärung von TaxiChecker gemäß DSGVO.",
  robots: { index: true, follow: false },
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card p-8 md:p-10">
          <h1 className="text-2xl font-bold text-taxi-blue mb-2 pb-4 border-b border-gray-100">
            Datenschutzerklärung
          </h1>
          <p className="text-xs text-gray-400 mb-8">
            Stand: Mai 2026 · Gemäß DSGVO, BDSG und TTDSG
          </p>

          <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
            <section aria-labelledby="verantwortlicher-title">
              <h2 id="verantwortlicher-title" className="font-semibold text-taxi-blue mb-3 text-base">
                1. Verantwortlicher
              </h2>
              <address className="not-italic">
                <strong className="text-taxi-blue">Serkan Sahin</strong><br />
                Siemensstr. 33, 96050 Bamberg<br />
                Tel.: +49 (0) 951 12063382<br />
                E-Mail:{" "}
                <a href="mailto:info@taxi-checker.de" className="text-taxi-yellow hover:underline">
                  info@taxi-checker.de
                </a>
              </address>
            </section>

            <section aria-labelledby="erhebung-title">
              <h2 id="erhebung-title" className="font-semibold text-taxi-blue mb-3 text-base">
                2. Erhebung und Verarbeitung personenbezogener Daten
              </h2>
              <p className="mb-3">
                Beim Besuch unserer Website werden automatisch folgende Daten erhoben und in
                Server-Logfiles gespeichert:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                <li>IP-Adresse (anonymisiert)</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Besuchte Seite / URL</li>
                <li>Browser-Typ und -Version</li>
                <li>Referrer-URL</li>
              </ul>
              <p className="mt-3">
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
                Sicherheit und Funktionsfähigkeit der Website). Die Daten werden nach 7 Tagen
                automatisch gelöscht.
              </p>
            </section>

            <section aria-labelledby="bewertungen-title">
              <h2 id="bewertungen-title" className="font-semibold text-taxi-blue mb-3 text-base">
                3. Bewertungen und Kommentare
              </h2>
              <p className="mb-3">
                Wenn Sie eine Bewertung abgeben, speichern wir:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Sternebewertungen (1–5) in den einzelnen Kategorien</li>
                <li>Öffentliche Kommentare (werden auf dem Fahrerprofil angezeigt)</li>
                <li>Private Kommentare (nur für den bewerteten Fahrer sichtbar)</li>
                <li>Zeitpunkt der Bewertung</li>
              </ul>
              <p className="mt-3">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Abgabe der
                Bewertung). Eine Bewertung kann auf Anfrage gelöscht werden.
              </p>
            </section>

            <section aria-labelledby="fahrerprofile-title">
              <h2 id="fahrerprofile-title" className="font-semibold text-taxi-blue mb-3 text-base">
                4. Fahrerprofile
              </h2>
              <p>
                Fahrerprofile werden nur mit ausdrücklicher Einwilligung des jeweiligen Fahrers
                angelegt. Die angezeigten Kontaktdaten, Fotos und Social-Media-Links wurden vom
                Fahrer selbst hinterlegt. Fahrer können ihr Profil jederzeit vollständig löschen
                lassen (Art. 17 DSGVO).
              </p>
            </section>

            <section aria-labelledby="supabase-title">
              <h2 id="supabase-title" className="font-semibold text-taxi-blue mb-3 text-base">
                5. Hosting und Datenbankdienste
              </h2>
              <p className="mb-3">
                Diese Website wird bei <strong>Vercel Inc.</strong> (USA) gehostet.
                Die Datenbank wird bei <strong>Supabase Inc.</strong> betrieben. Beide Anbieter
                verfügen über EU-konforme Datenverarbeitungsverträge (DPA) und sind nach
                EU-US Data Privacy Framework zertifiziert.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Vercel: EU-Region (Frankfurt)</li>
                <li>Supabase: EU-Region (Frankfurt, eu-central-1)</li>
              </ul>
            </section>

            <section aria-labelledby="cookies-title">
              <h2 id="cookies-title" className="font-semibold text-taxi-blue mb-3 text-base">
                6. Cookies
              </h2>
              <p className="mb-3">
                Wir verwenden technisch notwendige Cookies für:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Sitzungsverwaltung (Authentifizierung für Fahrer)</li>
                <li>Speicherung Ihrer Cookie-Einwilligung</li>
              </ul>
              <p className="mt-3">
                Rechtsgrundlage für technisch notwendige Cookies: § 25 Abs. 2 TTDSG.
                Analytische oder Marketing-Cookies werden nur nach Ihrer Einwilligung gesetzt.
              </p>
            </section>

            <section aria-labelledby="rechte-title">
              <h2 id="rechte-title" className="font-semibold text-taxi-blue mb-3 text-base">
                7. Ihre Rechte (DSGVO Art. 15–22)
              </h2>
              <ul className="space-y-2">
                {[
                  ["Auskunft (Art. 15)", "Welche Daten wir über Sie gespeichert haben"],
                  ["Berichtigung (Art. 16)", "Korrektur falscher Daten"],
                  ["Löschung (Art. 17)", "Löschung Ihrer Daten (Recht auf Vergessenwerden)"],
                  ["Einschränkung (Art. 18)", "Einschränkung der Verarbeitung"],
                  ["Datenübertragbarkeit (Art. 20)", "Erhalt Ihrer Daten in maschinenlesbarem Format"],
                  ["Widerspruch (Art. 21)", "Widerspruch gegen die Datenverarbeitung"],
                ].map(([right, desc]) => (
                  <li key={right} className="flex gap-2">
                    <span className="text-taxi-yellow font-semibold shrink-0">→</span>
                    <span>
                      <strong className="text-taxi-blue">{right}:</strong> {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Anfragen richten Sie bitte an:{" "}
                <a href="mailto:info@taxi-checker.de" className="text-taxi-yellow hover:underline">
                  info@taxi-checker.de
                </a>
              </p>
            </section>

            <section aria-labelledby="beschwerde-title">
              <h2 id="beschwerde-title" className="font-semibold text-taxi-blue mb-3 text-base">
                8. Beschwerderecht
              </h2>
              <p>
                Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu
                beschweren. In Bayern ist dies das{" "}
                <strong>Bayerische Landesamt für Datenschutzaufsicht (BayLDA)</strong>,
                Promenade 18, 91522 Ansbach.
              </p>
            </section>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex gap-4">
            <Link href="/" className="text-sm text-taxi-yellow hover:text-taxi-yellow-dark transition-colors">
              ← Startseite
            </Link>
            <Link href="/impressum" className="text-sm text-taxi-yellow hover:text-taxi-yellow-dark transition-colors">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
