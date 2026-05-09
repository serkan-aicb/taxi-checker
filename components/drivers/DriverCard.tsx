import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, MessageSquare } from "lucide-react";
import type { DriverWithStats } from "@/types/database";
import StarRating from "@/components/ui/StarRating";

interface DriverCardProps {
  driver: DriverWithStats;
}

export default function DriverCard({ driver }: DriverCardProps) {
  const fullName = `${driver.first_name} ${driver.last_name}`;
  const initials = `${driver.first_name[0]}${driver.last_name[0]}`.toUpperCase();

  return (
    <Link
      href={`/fahrer/${driver.slug}`}
      className="card group block"
      aria-label={`Profil von ${fullName} ansehen`}
    >
      <article>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {driver.profile_image ? (
                <Image
                  src={driver.profile_image}
                  alt={`Profilbild von ${fullName}`}
                  width={60}
                  height={60}
                  className="rounded-full object-cover w-15 h-15 ring-2 ring-taxi-yellow/20"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full bg-taxi-blue flex items-center justify-center ring-2 ring-taxi-yellow/20"
                  aria-label={`Initialen von ${fullName}`}
                >
                  <span className="text-taxi-yellow font-bold text-lg" aria-hidden="true">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-taxi-blue text-base group-hover:text-taxi-yellow transition-colors truncate">
                {fullName}
              </h3>
              {driver.company && (
                <p className="text-gray-500 text-xs mt-0.5 truncate">{driver.company}</p>
              )}
              {driver.city && (
                <p className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {driver.city}
                  {driver.region && `, ${driver.region}`}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating rating={driver.avg_rating} size="sm" />
              <span className="text-sm font-semibold text-taxi-blue">
                {driver.avg_rating.toFixed(1)}
              </span>
            </div>
            <span className="flex items-center gap-1 text-gray-400 text-xs">
              <MessageSquare className="w-3 h-3" aria-hidden="true" />
              {driver.review_count} {driver.review_count === 1 ? "Bewertung" : "Bewertungen"}
            </span>
          </div>
        </div>

        <div className="px-5 py-3 bg-taxi-yellow/5 border-t border-taxi-yellow/10 flex items-center justify-between">
          <span className="text-xs text-taxi-yellow font-medium group-hover:underline">
            Profil ansehen →
          </span>
          {driver.avg_rating >= 4.5 && (
            <span className="badge bg-taxi-yellow/10 text-taxi-yellow">
              <Star className="w-3 h-3 mr-1 fill-taxi-yellow" aria-hidden="true" />
              Top bewertet
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
