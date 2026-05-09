import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import {
  Star, MessageSquare, QrCode, TrendingUp, ArrowRight,
  User, Eye, Zap,
} from "lucide-react";
import type { Review } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Übersicht" };

const REVIEW_CATEGORIES = [
  { key: "question_1", label: "Freundlichkeit" },
  { key: "question_2", label: "Sauberkeit" },
  { key: "question_3", label: "Fahrstil" },
  { key: "question_4", label: "Pünktlichkeit" },
  { key: "question_5", label: "Gesamteindruck" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profileRaw } = await (supabase
    .from("driver_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single() as any);

  if (!profileRaw) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Kein Fahrerprofil gefunden.</p>
        <Link href="/dashboard/profil" className="btn-primary">Profil erstellen</Link>
      </div>
    );
  }

  const { data: reviewsRaw } = await (supabase
    .from("reviews")
    .select("*")
    .eq("driver_id", profileRaw.id)
    .order("created_at", { ascending: false })
    .limit(5) as any);

  const { data: totalRaw } = await (supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("driver_id", profileRaw.id) as any);

  const reviews: Review[] = reviewsRaw ?? [];
  const totalCount = (totalRaw as any)?.length ?? reviews.length;
  const count = reviews.length;

  const avg = (key: string) =>
    count > 0
      ? reviews.reduce((s, r: any) => s + (r[key] ?? 0), 0) / count
      : 0;

  const avgRating = avg("overall_rating");
  const fullName = `${profileRaw.first_name} ${profileRaw.last_name}`;

  const profileComplete = [
    profileRaw.bio, profileRaw.city, profileRaw.profile_image,
    profileRaw.phone || profileRaw.mobile,
  ].filter(Boolean).length;
  const profilePct = Math.round((profileComplete / 4) * 100);

  const isActive = profileRaw.subscription_status === "active" || profileRaw.subscription_status === "trialing";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-taxi-blue">
          Guten Tag, {profileRaw.first_name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Hier ist eine Übersicht Ihres Profils und Ihrer Bewertungen.
        </p>
      </div>

      {/* Subscription banner */}
      {!isActive && (
        <div className="bg-taxi-yellow/10 border border-taxi-yellow rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-taxi-yellow rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-taxi-blue" />
            </div>
            <div>
              <p className="font-semibold text-taxi-blue text-sm">Profil noch nicht öffentlich sichtbar</p>
              <p className="text-gray-500 text-xs">Aktivieren Sie Ihr Abo für 9,90 €/Monat – dann ist Ihr Profil sofort live.</p>
            </div>
          </div>
          <Link href="/dashboard/abo" className="btn-primary text-sm shrink-0">
            Jetzt aktivieren
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Gesamtbewertung",
            value: avgRating > 0 ? avgRating.toFixed(1) : "–",
            sub: avgRating > 0 ? "von 5,0 Sternen" : "Noch keine Bewertungen",
            icon: Star,
            accent: "text-taxi-yellow",
            bg: "bg-taxi-yellow/10",
          },
          {
            label: "Bewertungen",
            value: totalCount,
            sub: "Insgesamt erhalten",
            icon: MessageSquare,
            accent: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Profil",
            value: `${profilePct}%`,
            sub: "Vollständigkeit",
            icon: User,
            accent: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Profilaufrufe",
            value: "–",
            sub: "Demnächst verfügbar",
            icon: Eye,
            accent: "text-purple-500",
            bg: "bg-purple-50",
          },
        ].map(({ label, value, sub, icon: Icon, accent, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${accent}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-taxi-blue">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-5 shadow-card mb-4">
            <h2 className="font-semibold text-taxi-blue mb-4 text-sm uppercase tracking-wider">
              Kategorien
            </h2>
            {count > 0 ? (
              <ul className="space-y-3">
                {REVIEW_CATEGORIES.map(({ key, label }) => {
                  const val = avg(key);
                  return (
                    <li key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{label}</span>
                        <span className="text-xs font-semibold text-taxi-blue">{val.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-taxi-yellow rounded-full transition-all duration-500"
                          style={{ width: `${(val / 5) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Noch keine Bewertungen vorhanden.</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 shadow-card">
            <h2 className="font-semibold text-taxi-blue mb-4 text-sm uppercase tracking-wider">
              Schnellzugriff
            </h2>
            <ul className="space-y-2">
              {[
                { href: "/dashboard/profil", label: "Profil bearbeiten", icon: User },
                { href: `/fahrer/${profileRaw.slug}`, label: "Öffentliches Profil", icon: Eye, external: true },
                { href: "/dashboard/qr-code", label: "QR-Code herunterladen", icon: QrCode },
                { href: "/dashboard/bewertungen", label: "Alle Bewertungen", icon: MessageSquare },
              ].map(({ href, label, icon: Icon, external }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-taxi-blue transition-colors py-1.5"
                  >
                    <Icon className="w-4 h-4 text-taxi-yellow shrink-0" />
                    {label}
                    <ArrowRight className="w-3 h-3 ml-auto text-gray-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent reviews */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-taxi-blue text-sm uppercase tracking-wider">
                Neueste Bewertungen
              </h2>
              <Link
                href="/dashboard/bewertungen"
                className="text-xs text-taxi-yellow hover:underline flex items-center gap-1"
              >
                Alle ansehen <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">
                  Noch keine Bewertungen erhalten.
                </p>
                <Link href={`/fahrer/${profileRaw.slug}`} className="btn-primary text-sm">
                  Profil ansehen
                </Link>
              </div>
            ) : (
              <ol className="space-y-4">
                {reviews.map((r: any) => (
                  <li key={r.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.overall_rating} size="sm" />
                        <span className="text-sm font-semibold text-taxi-blue">
                          {r.overall_rating.toFixed(1)}
                        </span>
                      </div>
                      <time dateTime={r.created_at} className="text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleDateString("de-DE")}
                      </time>
                    </div>
                    {r.private_comment && (
                      <p className="text-gray-500 text-sm italic border-l-2 border-taxi-yellow pl-3">
                        {r.private_comment}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {[
                        { q: r.question_1, l: "Freundlichkeit" },
                        { q: r.question_2, l: "Sauberkeit" },
                        { q: r.question_3, l: "Fahrstil" },
                        { q: r.question_4, l: "Pünktlichkeit" },
                        { q: r.question_5, l: "Eindruck" },
                      ].map(({ q, l }) => (
                        <span key={l} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                          {l}: <span className="font-semibold text-taxi-blue">{q}</span>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
