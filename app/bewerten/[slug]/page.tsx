import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/reviews/ReviewForm";
import StarRating from "@/components/ui/StarRating";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { DriverProfile } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDriver(slug: string): Promise<DriverProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("driver_profiles")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const driver = await getDriver(slug);
  if (!driver) return { title: "Fahrer nicht gefunden" };
  const fullName = `${driver.first_name} ${driver.last_name}`;
  return {
    title: `${fullName} bewerten | TaxiChecker`,
    description: `Bewerten Sie Ihren Fahrer ${fullName}. Teilen Sie Ihre Erfahrung mit anderen Fahrgästen.`,
    robots: { index: false, follow: false },
  };
}

export default async function BewertenPage({ params }: PageProps) {
  const { slug } = await params;
  const driver = await getDriver(slug);

  if (!driver) notFound();

  const fullName = `${driver.first_name} ${driver.last_name}`;
  const initials = `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase();
  const location = [driver.city, driver.region].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-taxi-blue py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Link
            href={`/fahrer/${slug}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-taxi-yellow transition-colors text-sm mb-4"
            aria-label="Zurück zum Fahrerprofil"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Zurück zum Profil
          </Link>

          <div className="flex items-center gap-4">
            {driver.profile_image ? (
              <Image
                src={driver.profile_image}
                alt={`Profilbild von ${fullName}`}
                width={56}
                height={56}
                className="rounded-full object-cover ring-2 ring-taxi-yellow/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-taxi-blue-muted ring-2 ring-taxi-yellow/30 flex items-center justify-center">
                <span className="text-taxi-yellow font-bold text-xl">{initials}</span>
              </div>
            )}
            <div>
              <h1 className="text-white font-bold text-lg">{fullName} bewerten</h1>
              {driver.company && (
                <p className="text-gray-400 text-sm">{driver.company}</p>
              )}
              {location && (
                <p className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-card p-6 md:p-8">
          <ReviewForm driverId={driver.id} driverSlug={slug} driverName={fullName} />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          Ihre Bewertung ist anonym. Private Kommentare sind nur für den Fahrer sichtbar.
          Alle Angaben sind freiwillig.
          Missbrauch wird gemäß unserer{" "}
          <Link href="/datenschutz" className="underline hover:text-taxi-blue">
            Datenschutzerklärung
          </Link>{" "}
          behandelt.
        </p>
      </div>
    </div>
  );
}
