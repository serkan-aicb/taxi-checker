"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto bg-taxi-blue border border-taxi-blue-muted rounded-xl shadow-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-taxi-yellow/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-taxi-yellow" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="cookie-title" className="text-white font-semibold mb-1">
              Cookie-Einstellungen
            </h2>
            <p id="cookie-desc" className="text-gray-400 text-sm leading-relaxed">
              Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten.
              Notwendige Cookies sind für den Betrieb erforderlich. Weitere Informationen
              finden Sie in unserer{" "}
              <Link href="/datenschutz" className="text-taxi-yellow underline hover:no-underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
          <button
            onClick={decline}
            className="text-gray-500 hover:text-white transition-colors shrink-0 p-1"
            aria-label="Cookie-Banner schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 ml-14">
          <button
            onClick={accept}
            className="btn-primary justify-center"
            aria-label="Alle Cookies akzeptieren"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={decline}
            className="btn-secondary justify-center"
            aria-label="Nur notwendige Cookies"
          >
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
