import { createClient } from "@/lib/supabase/server";
import DriverCard from "@/components/drivers/DriverCard";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import type { DriverWithStats } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taxifahrer in Deutschland – Alle Profile",
  description:
    "Alle bewerteten Taxifahrer auf TaxiChecker. Filtern nach Stadt und Bewertung.",
};

const CITIES = [
  "Bamberg", "München", "Berlin", "Hamburg", "Frankfurt", "Köln",
  "Stuttgart", "Düsseldorf", "Leipzig", "Dresden", "Nürnberg",
  "Hannover", "Bremen", "Dortmund", "Essen", "Bonn",
];

interface PageProps {
  searchParams: Promise<{ q?: string; city?: string; sort?: string }>;
}

async function getDrivers(params: {
  q?: string;
  city?: string;
  sort?: string;
}): Promise<DriverWithStats[]> {
  const supabase = await createClient();

  let query = supabase
    .from("driver_profiles")
    .select("*, reviews(overall_rating, question_1, question_2, question_3, question_4, question_5)");

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  if (params.q) {
    query = query.or(
      `first_name.ilike.%${params.q}%,last_name.ilike.%${params.q}%,company.ilike.%${params.q}%`
    );
  }

  const { data } = await query.limit(50);
  if (!data) return [];

  const drivers: DriverWithStats[] = data.map((driver: any) => {
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

  if (params.sort === "rating") {
    drivers.sort((a, b) => b.avg_rating - a.avg_rating);
  } else if (params.sort === "reviews") {
    drivers.sort((a, b) => b.review_count - a.review_count);
  }

  return drivers;
}

export default async function FahrerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const drivers = await getDrivers(params);

  const activeCity = params.city ?? "";
  const activeQuery = params.q ?? "";
  const activeSort = params.sort ?? "recent";

  const hasFilters = activeCity || activeQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-taxi-blue text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Taxifahrer entdecken
          </h1>
          <p className="text-gray-400 text-sm">
            {drivers.length} Fahrer
            {activeCity ? ` in ${activeCity}` : " in Deutschland"}
            {activeQuery ? ` · Suche: „${activeQuery}"` : ""}
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form
            method="GET"
            action="/fahrer"
            className="flex flex-wrap items-center gap-3"
            role="search"
            aria-label="Fahrer filtern"
          >
            <div className="relative flex-1 min-w-48">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={activeQuery}
                placeholder="Name, Unternehmen..."
                aria-label="Fahrer suchen"
                className="input-field pl-9 py-2 text-sm"
              />
            </div>

            <div className="relative w-44">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <select
                name="city"
                defaultValue={activeCity}
                aria-label="Stadt filtern"
                className="input-field pl-9 py-2 text-sm appearance-none"
              >
                <option value="">Alle Städte</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-44">
              <SlidersHorizontal
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <select
                name="sort"
                defaultValue={activeSort}
                aria-label="Sortierung"
                className="input-field pl-9 py-2 text-sm appearance-none"
              >
                <option value="recent">Neueste</option>
                <option value="rating">Beste Bewertung</option>
                <option value="reviews">Meiste Bewertungen</option>
              </select>
            </div>

            <button type="submit" className="btn-primary py-2">
              Filtern
            </button>

            {hasFilters && (
              <a
                href="/fahrer"
                className="text-sm text-gray-500 hover:text-taxi-blue transition-colors"
                aria-label="Filter zurücksetzen"
              >
                Zurücksetzen
              </a>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {drivers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-taxi-blue mb-2">
              Keine Fahrer gefunden
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Versuchen Sie eine andere Suche oder entfernen Sie die Filter.
            </p>
            <a href="/fahrer" className="btn-primary">
              Alle Fahrer anzeigen
            </a>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label={`${drivers.length} Fahrer gefunden`}
          >
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
