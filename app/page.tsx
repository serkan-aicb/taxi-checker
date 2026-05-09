import { createClient } from "@/lib/supabase/server";
import HeroSearch, { HeroSearchTabs } from "@/components/home/HeroSearch";
import DriverCard from "@/components/drivers/DriverCard";
import Link from "next/link";
import {
  Star, Shield, QrCode, Search, ChevronRight,
  TrendingUp, Eye, Users, CheckCircle,
  MapPin, Clock, ThumbsUp, BadgeCheck,
  ArrowRight, Play,
} from "lucide-react";
import type { DriverWithStats } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaxiChecker – Bewertungen für Taxifahrer in Deutschland",
  description:
    "Finden und bewerten Sie Taxifahrer in Ihrer Stadt. Echte Bewertungen, verifizierte Profile und QR-Code-System. TaxiChecker – Vertrauen im Taxi.",
};

async function getTopDrivers(): Promise<DriverWithStats[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("driver_profiles")
    .select("*, reviews(overall_rating, question_1, question_2, question_3, question_4, question_5)")
    .limit(6);

  if (!data) return [];

  return data.map((driver: any) => {
    const reviews = driver.reviews ?? [];
    const count = reviews.length;
    const avg = (key: string) =>
      count > 0 ? reviews.reduce((s: number, r: any) => s + (r[key] ?? 0), 0) / count : 0;

    return {
      ...driver,
      reviews: undefined,
      avg_rating: avg("overall_rating"),
      review_count: count,
      avg_q1: avg("question_1"),
      avg_q2: avg("question_2"),
      avg_q3: avg("question_3"),
      avg_q4: avg("question_4"),
      avg_q5: avg("question_5"),
    };
  });
}

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: QrCode,
    title: "QR-Code erhalten",
    desc: "Nach der Registrierung erhalten Sie sofort Ihren persönlichen QR-Code zum Ausdrucken.",
  },
  {
    step: "02",
    icon: BadgeCheck,
    title: "Profil vervollständigen",
    desc: "Tragen Sie Foto, Bio, Unternehmen und Social-Media-Links ein – in wenigen Minuten.",
  },
  {
    step: "03",
    icon: Star,
    title: "Bewertungen sammeln",
    desc: "Fahrgäste scannen den QR-Code und bewerten Sie direkt nach der Fahrt.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Reputation aufbauen",
    desc: "Ihre Bewertungen sind online sichtbar – für neue Kunden und Google gleichermaßen.",
  },
];

const DRIVER_BENEFITS = [
  {
    icon: Eye,
    title: "Mehr Sichtbarkeit",
    desc: "Werde von potenziellen Fahrgästen in deiner Region online gefunden.",
  },
  {
    icon: Shield,
    title: "Vertrauen aufbauen",
    desc: "Gute Bewertungen stärken deine Reputation und Kundenbindung nachhaltig.",
  },
  {
    icon: BadgeCheck,
    title: "Verifiziertes Profil",
    desc: "Ein professionelles, verifiziertes Profil schafft Vertrauen bei Fahrgästen.",
  },
  {
    icon: ThumbsUp,
    title: "Wertvolles Feedback",
    desc: "Erhalte ehrliches Feedback – auch privat – um deinen Service zu verbessern.",
  },
];

const PASSENGER_BENEFITS = [
  {
    icon: Search,
    title: "Bessere Orientierung",
    desc: "Finde schnell den richtigen Fahrer mit allen relevanten Informationen.",
  },
  {
    icon: Shield,
    title: "Mehr Transparenz",
    desc: "Echte Bewertungen und verifizierte Profile für mehr Sicherheit.",
  },
  {
    icon: Clock,
    title: "Schnelle Suche",
    desc: "Finde in Sekunden passende Fahrer in deiner Umgebung.",
  },
  {
    icon: Star,
    title: "Qualitätsprüfung",
    desc: "Vergleiche Fahrer basierend auf echten Kundenbewertungen.",
  },
];

const TESTIMONIALS = [
  {
    text: "Endlich kann ich vor der Fahrt sehen, wer mich abholt. Das gibt ein wirklich gutes Gefühl!",
    name: "Lisa M.",
    role: "Fahrgast · Berlin",
    initials: "LM",
  },
  {
    text: "Seit ich mein Profil habe, bekomme ich regelmäßig Stammkunden. Die guten Bewertungen helfen enorm.",
    name: "Markus K.",
    role: "Fahrer · München",
    initials: "MK",
  },
  {
    text: "Meine Kinder nehmen oft das Taxi. Mit TaxiChecker fühle ich mich viel sicherer.",
    name: "Petra S.",
    role: "Fahrgast · Hamburg",
    initials: "PS",
  },
];

const STATS = [
  { value: "9,90 €", label: "Pro Monat für Fahrer" },
  { value: "5", label: "Bewertungskategorien" },
  { value: "DSGVO", label: "Konform & sicher" },
  { value: "KI", label: "Optimiert & findbar" },
];

export default async function HomePage() {
  const topDrivers = await getTopDrivers();

  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="bg-taxi-blue text-white relative overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Subtle radial glow top-right */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(255,193,7,0.07)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left column: text ── */}
            <div>
              <div className="inline-flex items-center gap-2 bg-taxi-yellow/10 border border-taxi-yellow/20 rounded-full px-4 py-1.5 mb-7">
                <Star className="w-3.5 h-3.5 text-taxi-yellow fill-taxi-yellow shrink-0" aria-hidden="true" />
                <span className="text-taxi-yellow text-xs font-medium tracking-wide">
                  Vertrauen &amp; Transparenz im Taxi-Bereich
                </span>
              </div>

              <h1
                id="hero-title"
                className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-6"
              >
                Finde den{" "}
                <span className="text-taxi-yellow">perfekten Fahrer</span>
                {" "}in deiner Nähe
              </h1>

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Entdecke verifizierte Fahrerprofile, echte Bewertungen und
                finde den idealen Fahrer für deine nächste Fahrt.
                Transparent, zuverlässig und lokal.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/fahrer" className="btn-primary text-base px-7 py-3.5">
                  Fahrer finden
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 text-base"
                >
                  Mehr erfahren
                </Link>
              </div>
            </div>

            {/* ── Right column: search card ── */}
            <div className="lg:justify-self-end w-full max-w-md lg:max-w-none lg:w-[420px]">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                {/* Card header */}
                <div className="mb-5">
                  <h2 className="text-taxi-blue font-bold text-lg">Fahrer finden</h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Suche nach Name oder Stadt
                  </p>
                </div>

                {/* Tab bar – 2 tabs only */}
                <HeroSearchTabs />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-taxi-blue-light border-t border-taxi-blue-muted" aria-label="Kennzahlen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-taxi-yellow font-bold text-2xl md:text-3xl">{value}</p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SO FUNKTIONIERT'S ─── */}
      <section id="how-it-works" className="py-20 bg-white" aria-labelledby="how-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-taxi-yellow text-xs font-semibold uppercase tracking-widest mb-3">
              Prozess
            </p>
            <h2 id="how-title" className="section-title text-3xl md:text-4xl mb-4">
              So funktioniert's
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              In vier einfachen Schritten zum professionellen Online-Profil.
              Schnell, transparent und unkompliziert.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full z-0">
                    <ArrowRight className="w-5 h-5 text-gray-300 -ml-2.5" aria-hidden="true" />
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-6 h-full relative z-10 hover:shadow-card transition-shadow">
                  <p className="text-taxi-yellow font-bold text-sm mb-4">{step}</p>
                  <div className="w-12 h-12 bg-taxi-yellow rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-taxi-blue" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-taxi-blue mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAHRER CARDS PREVIEW ─── */}
      {topDrivers.length > 0 && (
        <section className="py-20 bg-gray-50" aria-labelledby="drivers-preview-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-taxi-yellow text-xs font-semibold uppercase tracking-widest mb-3">
                Vorschau
              </p>
              <h2 id="drivers-preview-title" className="section-title text-3xl md:text-4xl mb-4">
                Entdecke Fahrerprofile
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                So sieht ein typisches Fahrerprofil auf TaxiChecker aus.
                Alle wichtigen Informationen auf einen Blick.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {topDrivers.slice(0, 3).map((driver) => (
                <DriverCard key={driver.id} driver={driver} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/fahrer" className="btn-primary">
                Alle Fahrer ansehen
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── FÜR WEN IST TAXICHECKER? ─── */}
      <section className="py-20 bg-white" aria-labelledby="benefits-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-taxi-yellow text-xs font-semibold uppercase tracking-widest mb-3">
              Vorteile
            </p>
            <h2 id="benefits-title" className="section-title text-3xl md:text-4xl mb-4">
              Für wen ist TaxiChecker?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Ob Fahrgast oder Fahrer – unsere Plattform bringt beide Seiten zusammen
              und schafft Mehrwert für alle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Für Fahrgäste */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-taxi-yellow/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-taxi-yellow" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-taxi-blue">Für Fahrgäste</h3>
              </div>
              <ul className="space-y-4">
                {PASSENGER_BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Icon className="w-4 h-4 text-taxi-yellow" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-taxi-blue text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/fahrer" className="btn-primary text-sm">
                  Fahrer finden
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Für Fahrer */}
            <div className="bg-taxi-blue rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-taxi-yellow/10 rounded-xl flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-taxi-yellow" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold">Für Fahrer</h3>
              </div>
              <ul className="space-y-4">
                {DRIVER_BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-taxi-blue-muted rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-taxi-yellow" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/auth/register" className="btn-primary">
                  Kostenlos registrieren
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WARUM TAXICHECKER ─── */}
      <section className="py-20 bg-gray-50" aria-labelledby="why-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-taxi-yellow text-xs font-semibold uppercase tracking-widest mb-3">
              Warum TaxiChecker
            </p>
            <h2 id="why-title" className="section-title text-3xl md:text-4xl mb-4">
              Vertrauen durch Transparenz
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Wir schaffen eine vertrauensvolle Verbindung zwischen Fahrern und Fahrgästen
              durch echte Bewertungen und verifizierte Informationen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Verifizierte Profile",
                desc: "Jeder Fahrer wird sorgfältig geprüft und verifiziert.",
              },
              {
                icon: Star,
                title: "Echte Bewertungen",
                desc: "Authentisches Feedback von echten Fahrgästen – kein Fake.",
              },
              {
                icon: Eye,
                title: "Transparente Infos",
                desc: "Alle relevanten Informationen auf einen Blick – vor der Fahrt.",
              },
              {
                icon: MapPin,
                title: "Lokale Suche",
                desc: "Finde Fahrer in deiner unmittelbaren Umgebung nach PLZ oder Stadt.",
              },
              {
                icon: Clock,
                title: "Schnelle Orientierung",
                desc: "Übersichtliche Profile für schnelle, informierte Entscheidungen.",
              },
              {
                icon: BadgeCheck,
                title: "Qualitätsstandards",
                desc: "Hohe Anforderungen an Service, Freundlichkeit und Zuverlässigkeit.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 bg-taxi-yellow/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-taxi-yellow" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-taxi-blue mb-2 text-sm">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-white" aria-labelledby="testimonials-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-taxi-yellow text-xs font-semibold uppercase tracking-widest mb-3">
              Social Proof
            </p>
            <h2 id="testimonials-title" className="section-title text-3xl md:text-4xl">
              Das sagen unsere Nutzer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ text, name, role, initials }) => (
              <figure key={name} className="bg-gray-50 rounded-xl p-6 shadow-card">
                <div className="text-taxi-yellow text-3xl font-serif leading-none mb-4" aria-hidden="true">
                  &bdquo;
                </div>
                <blockquote className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                  &bdquo;{text}&ldquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-taxi-blue flex items-center justify-center shrink-0">
                    <span className="text-taxi-yellow text-xs font-bold">{initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-taxi-blue text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KI-KOMPATIBILITÄT HIGHLIGHT ─── */}
      <section className="py-16 bg-taxi-blue-light border-y border-taxi-blue-muted" aria-labelledby="ai-title">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-taxi-yellow/10 border border-taxi-yellow/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-taxi-yellow text-xs font-medium">Strategischer Vorteil</span>
          </div>
          <h2 id="ai-title" className="text-2xl md:text-3xl font-bold text-white mb-4">
            Von KI-Assistenten <span className="text-taxi-yellow">gefunden werden</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto text-sm">
            TaxiChecker ist von Anfang an für KI-Agenten optimiert. Wenn jemand fragt
            „Welcher Taxifahrer in Bamberg hat die beste Bewertung?" – dann sollen
            unsere Fahrer als erste gefunden werden. Durch strukturierte Daten (Schema.org),
            optimierte SEO und KI-Crawler-Freigabe.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {["Google", "ChatGPT", "Claude AI", "Perplexity", "Apple Intelligence"].map((ai) => (
              <span
                key={ai}
                className="px-3 py-1.5 bg-taxi-blue-muted text-gray-300 rounded-full border border-taxi-blue"
              >
                {ai}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FAHRER ─── */}
      <section className="bg-taxi-yellow py-20" aria-labelledby="cta-title">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold text-taxi-blue mb-4">
            Bereit, Ihren Ruf aufzubauen?
          </h2>
          <p className="text-taxi-blue/70 mb-8 leading-relaxed">
            Erstellen Sie Ihr Fahrerprofil, erhalten Sie Ihren persönlichen QR-Code und
            sammeln Sie echte Bewertungen von Fahrgästen. In weniger als 5 Minuten online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="bg-taxi-blue text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-taxi-blue-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Jetzt Profil erstellen
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/fahrer"
              className="bg-white/50 text-taxi-blue font-semibold px-8 py-3.5 rounded-lg hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
            >
              Fahrer entdecken
            </Link>
          </div>
          <p className="text-taxi-blue/60 text-xs mt-4">
            Nur 9,90 €/Monat für Fahrer · Für Fahrgäste immer kostenlos · DSGVO-konform
          </p>
        </div>
      </section>
    </>
  );
}
