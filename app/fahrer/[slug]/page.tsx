import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import {
  MapPin, Phone, Mail, Globe, Star, MessageSquare,
  Send, ExternalLink, QrCode, Share2, Link2,
} from "lucide-react";
import type { Metadata } from "next";
import type { DriverProfile, DriverWithStats, Review } from "@/types/database";

const SITE_URL = "https://taxi-checker.de";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const REVIEW_CATEGORIES = [
  { key: "avg_q1", label: "Freundlichkeit" },
  { key: "avg_q2", label: "Sauberkeit" },
  { key: "avg_q3", label: "Fahrstil" },
  { key: "avg_q4", label: "Pünktlichkeit" },
  { key: "avg_q5", label: "Gesamteindruck" },
];

async function getDriverData(slug: string): Promise<{
  driver: DriverWithStats;
  reviews: Review[];
} | null> {
  const supabase = await createClient();

  const { data: profileRaw } = await supabase
    .from("driver_profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  const profile = profileRaw as DriverProfile | null;
  if (!profile) return null;

  const subStatus = (profile as any).subscription_status ?? "none";
  const isActive = subStatus === "active" || subStatus === "trialing";
  if (!isActive) return { inactive: true, driver: null, reviews: [] } as any;

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("*")
    .eq("driver_id", profile.id)
    .order("created_at", { ascending: false });

  const allReviews = (reviewsRaw ?? []) as Review[];
  const count = allReviews.length;
  const avg = (key: keyof Review) =>
    count > 0
      ? allReviews.reduce((s, r) => s + ((r[key] as number) ?? 0), 0) / count
      : 0;

  const driver: DriverWithStats = {
    ...profile,
    avg_rating: avg("overall_rating"),
    review_count: count,
    avg_q1: avg("question_1"),
    avg_q2: avg("question_2"),
    avg_q3: avg("question_3"),
    avg_q4: avg("question_4"),
    avg_q5: avg("question_5"),
  };

  return { driver, reviews: allReviews };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDriverData(slug);
  if (!data || (data as any).inactive) return { title: "Fahrer nicht gefunden" };

  const { driver } = data;
  const fullName = `${driver.first_name} ${driver.last_name}`;
  const location = [driver.city, driver.region].filter(Boolean).join(", ");
  const title = `${fullName} – Taxifahrer${location ? ` in ${location}` : ""} | TaxiChecker`;
  const description = driver.bio
    ? driver.bio.slice(0, 155)
    : `Bewertungen und Profil von Taxifahrer ${fullName}${location ? ` in ${location}` : ""}. Gesamtbewertung: ${driver.avg_rating.toFixed(1)} / 5.`;

  const profileUrl = `${SITE_URL}/fahrer/${slug}`;
  const imageUrl = driver.profile_image ?? `${SITE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical: profileUrl },
    openGraph: {
      type: "profile",
      url: profileUrl,
      title,
      description,
      images: [{ url: imageUrl, width: 400, height: 400, alt: `Profilbild von ${fullName}` }],
      locale: "de_DE",
      siteName: "TaxiChecker",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

function buildJsonLd(driver: DriverWithStats, reviews: Review[], slug: string) {
  const fullName = `${driver.first_name} ${driver.last_name}`;
  const profileUrl = `${SITE_URL}/fahrer/${slug}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": ["Person", "LocalBusiness"],
    "@id": profileUrl,
    name: fullName,
    url: profileUrl,
    image: driver.profile_image ?? undefined,
    description: driver.bio ?? undefined,
    address: driver.city
      ? {
          "@type": "PostalAddress",
          addressLocality: driver.city,
          addressRegion: driver.region ?? undefined,
          postalCode: driver.postal_area ?? undefined,
          addressCountry: "DE",
        }
      : undefined,
    telephone: driver.phone ?? driver.mobile ?? undefined,
    email: driver.email ?? undefined,
    worksFor: driver.company
      ? { "@type": "Organization", name: driver.company }
      : undefined,
    aggregateRating:
      driver.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: driver.avg_rating.toFixed(1),
            reviewCount: driver.review_count,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      "@id": `${SITE_URL}/bewertungen/${r.id}`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.overall_rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.public_comment ?? undefined,
      datePublished: r.created_at,
      itemReviewed: { "@type": "Person", name: fullName },
    })),
  };

  return JSON.stringify(personSchema, null, 0);
}

export default async function DriverProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getDriverData(slug);

  if (!data) notFound();

  if ((data as any).inactive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-md text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-gray-300" />
          </div>
          <h1 className="text-xl font-bold text-taxi-blue mb-2">Profil nicht aktiv</h1>
          <p className="text-gray-500 text-sm mb-6">
            Dieses Fahrerprofil ist derzeit nicht öffentlich sichtbar.
          </p>
          <Link href="/fahrer" className="btn-primary">
            Andere Fahrer entdecken
          </Link>
        </div>
      </div>
    );
  }

  const { driver, reviews } = data;
  const fullName = `${driver.first_name} ${driver.last_name}`;
  const initials = `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase();
  const location = [driver.city, driver.region].filter(Boolean).join(", ");
  const jsonLd = buildJsonLd(driver, reviews, slug);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socialLinks: { url: string | null; icon: React.ComponentType<any>; label: string }[] = [
    { url: driver.facebook_url, icon: Share2, label: "Facebook" },
    { url: driver.instagram_url, icon: Link2, label: "Instagram" },
    { url: driver.linkedin_url, icon: ExternalLink, label: "LinkedIn" },
    { url: driver.telegram_url, icon: Send, label: "Telegram" },
    { url: driver.tiktok_url, icon: Link2, label: "TikTok" },
    { url: driver.whatsapp_url, icon: MessageSquare, label: "WhatsApp" },
  ].filter((s) => s.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-taxi-blue text-white py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-taxi-yellow transition-colors">
                    Startseite
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/fahrer" className="hover:text-taxi-yellow transition-colors">
                    Fahrer
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white" aria-current="page">
                  {fullName}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                {driver.profile_image ? (
                  <Image
                    src={driver.profile_image}
                    alt={`Profilbild von ${fullName}`}
                    width={96}
                    height={96}
                    className="rounded-full object-cover ring-4 ring-taxi-yellow/30"
                    priority
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full bg-taxi-blue-muted ring-4 ring-taxi-yellow/30 flex items-center justify-center"
                    aria-label={`Initialen von ${fullName}`}
                  >
                    <span className="text-taxi-yellow font-bold text-3xl">{initials}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold" itemProp="name">
                  {fullName}
                </h1>
                {driver.company && (
                  <p className="text-gray-400 mt-1" itemProp="worksFor">
                    {driver.company}
                  </p>
                )}
                {location && (
                  <p className="flex items-center gap-1.5 text-gray-400 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-taxi-yellow" aria-hidden="true" />
                    <span itemProp="address">{location}</span>
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={driver.avg_rating} size="md" />
                  <span className="text-white font-bold">
                    {driver.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({driver.review_count} {driver.review_count === 1 ? "Bewertung" : "Bewertungen"})
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <Link
                  href={`/bewerten/${slug}`}
                  className="btn-primary"
                  aria-label={`${fullName} jetzt bewerten`}
                >
                  <Star className="w-4 h-4" aria-hidden="true" />
                  Jetzt bewerten
                </Link>
                <Link
                  href={`/qr/${slug}`}
                  className="btn-secondary text-xs py-2"
                  aria-label="QR-Code anzeigen"
                >
                  <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                  QR-Code
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 space-y-4" aria-label="Fahrerdetails">
            {driver.bio && (
              <div className="bg-white rounded-xl p-5 shadow-card">
                <h2 className="font-semibold text-taxi-blue mb-3 text-sm uppercase tracking-wider">
                  Über mich
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed" itemProp="description">
                  {driver.bio}
                </p>
              </div>
            )}

            {(driver.phone || driver.mobile || driver.email || driver.website) && (
              <div className="bg-white rounded-xl p-5 shadow-card">
                <h2 className="font-semibold text-taxi-blue mb-3 text-sm uppercase tracking-wider">
                  Kontakt
                </h2>
                <ul className="space-y-2.5">
                  {driver.phone && (
                    <li className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-taxi-yellow shrink-0" aria-hidden="true" />
                      <a
                        href={`tel:${driver.phone}`}
                        className="text-gray-600 hover:text-taxi-blue transition-colors"
                        itemProp="telephone"
                      >
                        {driver.phone}
                      </a>
                    </li>
                  )}
                  {driver.email && (
                    <li className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-taxi-yellow shrink-0" aria-hidden="true" />
                      <a
                        href={`mailto:${driver.email}`}
                        className="text-gray-600 hover:text-taxi-blue transition-colors truncate"
                        itemProp="email"
                      >
                        {driver.email}
                      </a>
                    </li>
                  )}
                  {driver.website && (
                    <li className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-taxi-yellow shrink-0" aria-hidden="true" />
                      <a
                        href={driver.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-taxi-blue transition-colors truncate"
                        itemProp="url"
                      >
                        {driver.website.replace(/^https?:\/\//, "")}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-card">
                <h2 className="font-semibold text-taxi-blue mb-3 text-sm uppercase tracking-wider">
                  Social Media
                </h2>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-taxi-blue flex items-center justify-center hover:bg-taxi-yellow transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-white group-hover:text-taxi-blue transition-colors" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {driver.review_count > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-card">
                <h2 className="font-semibold text-taxi-blue mb-4 text-sm uppercase tracking-wider">
                  Kategorien
                </h2>
                <ul className="space-y-3" aria-label="Bewertungskategorien">
                  {REVIEW_CATEGORIES.map(({ key, label }) => {
                    const val = driver[key as keyof DriverWithStats] as number;
                    return (
                      <li key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{label}</span>
                          <span className="text-xs font-semibold text-taxi-blue">
                            {val.toFixed(1)}
                          </span>
                        </div>
                        <div
                          className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={val}
                          aria-valuemin={0}
                          aria-valuemax={5}
                          aria-label={`${label}: ${val.toFixed(1)} von 5`}
                        >
                          <div
                            className="h-full bg-taxi-yellow rounded-full transition-all duration-500"
                            style={{ width: `${(val / 5) * 100}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>

          <section className="md:col-span-2" aria-labelledby="reviews-title">
            <div className="flex items-center justify-between mb-4">
              <h2 id="reviews-title" className="section-title text-xl">
                <MessageSquare className="inline w-5 h-5 mr-2 text-taxi-yellow" aria-hidden="true" />
                Bewertungen ({driver.review_count})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-card text-center">
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-500 text-sm mb-4">
                  Noch keine Bewertungen vorhanden.
                </p>
                <Link href={`/bewerten/${slug}`} className="btn-primary text-sm">
                  Jetzt als Erster bewerten
                </Link>
              </div>
            ) : (
              <ol className="space-y-4" aria-label="Bewertungsliste">
                {reviews.map((review) => (
                  <li key={review.id} className="bg-white rounded-xl p-5 shadow-card">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full bg-taxi-blue flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <span className="text-taxi-yellow text-xs font-bold">F</span>
                        </div>
                        <span className="text-sm font-medium text-taxi-blue">Fahrgast</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StarRating rating={review.overall_rating} size="sm" />
                        <time
                          dateTime={review.created_at}
                          className="text-xs text-gray-400"
                        >
                          {new Date(review.created_at).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1 mb-3" aria-label="Detailbewertungen">
                      {[
                        { q: review.question_1, label: "Freundlichkeit" },
                        { q: review.question_2, label: "Sauberkeit" },
                        { q: review.question_3, label: "Fahrstil" },
                        { q: review.question_4, label: "Pünktlichkeit" },
                        { q: review.question_5, label: "Eindruck" },
                      ].map(({ q, label }) => (
                        <div key={label} className="text-center">
                          <div className="text-xs text-gray-400 mb-0.5 truncate">{label}</div>
                          <StarRating rating={q} size="sm" maxStars={1} />
                          <div className="text-xs font-semibold text-taxi-blue">{q}</div>
                        </div>
                      ))}
                    </div>

                    {review.public_comment && (
                      <blockquote className="text-gray-600 text-sm leading-relaxed border-l-2 border-taxi-yellow pl-3 mt-3">
                        {review.public_comment}
                      </blockquote>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
