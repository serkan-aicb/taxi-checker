"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Star } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-taxi-blue sticky top-0 z-50 shadow-lg" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="TaxiChecker Startseite"
          >
            <div className="w-8 h-8 bg-taxi-yellow rounded-lg flex items-center justify-center group-hover:bg-taxi-yellow-dark transition-colors">
              <Star className="w-4 h-4 text-taxi-blue fill-taxi-blue" aria-hidden="true" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Taxi<span className="text-taxi-yellow">Checker</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Hauptnavigation">
            <Link href="/fahrer" className="btn-ghost">
              Fahrer
            </Link>
            <Link href="/impressum" className="btn-ghost">
              Impressum
            </Link>
            <Link href="/datenschutz" className="btn-ghost">
              Datenschutz
            </Link>
          </nav>

          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-taxi-blue-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav
            className="md:hidden pb-4 border-t border-taxi-blue-muted mt-2 pt-4 flex flex-col gap-3"
            aria-label="Mobile Navigation"
          >
            <Link
              href="/fahrer"
              className="text-white hover:text-taxi-yellow transition-colors py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Fahrer entdecken
            </Link>
            <Link
              href="/impressum"
              className="text-white hover:text-taxi-yellow transition-colors py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-white hover:text-taxi-yellow transition-colors py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Datenschutz
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
