import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meine Bewertungen" };

export default async function DashboardBewertungenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await (supabase
    .from("driver_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() as any);

  const { data: reviewsRaw } = profile
    ? await (supabase
        .from("reviews")
        .select("*")
        .eq("driver_id", profile.id)
        .order("created_at", { ascending: false }) as any)
    : { data: [] };

  const reviews = (reviewsRaw ?? []) as any[];
  const count = reviews.length;
  const avgRating = count > 0
    ? reviews.reduce((s: number, r: any) => s + r.overall_rating, 0) / count
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-taxi-blue">Meine Bewertungen</h1>
        <p className="text-gray-500 text-sm mt-1">
          {count > 0
            ? `${count} Bewertung${count !== 1 ? "en" : ""} · Ø ${avgRating.toFixed(1)} von 5,0`
            : "Noch keine Bewertungen erhalten"}
        </p>
      </div>

      {count > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
          {[
            { key: "question_1", label: "Freundlichkeit" },
            { key: "question_2", label: "Sauberkeit" },
            { key: "question_3", label: "Fahrstil" },
            { key: "question_4", label: "Pünktlichkeit" },
            { key: "question_5", label: "Gesamteindruck" },
          ].map(({ key, label }) => {
            const val = reviews.reduce((s: number, r: any) => s + (r[key] ?? 0), 0) / count;
            return (
              <div key={key} className="bg-white rounded-xl p-4 shadow-card text-center">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-xl font-bold text-taxi-blue">{val.toFixed(1)}</p>
                <StarRating rating={val} size="sm" />
              </div>
            );
          })}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-10 shadow-card text-center">
          <p className="text-gray-400 text-sm">
            Noch keine Bewertungen. Teilen Sie Ihren QR-Code mit Fahrgästen!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <ol>
            {reviews.map((r: any, i: number) => (
              <li
                key={r.id}
                className={`p-5 ${i < reviews.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.overall_rating} size="sm" />
                    <span className="font-semibold text-taxi-blue text-sm">
                      {r.overall_rating.toFixed(1)}
                    </span>
                  </div>
                  <time dateTime={r.created_at} className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </time>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { q: r.question_1, l: "Freundlichkeit" },
                    { q: r.question_2, l: "Sauberkeit" },
                    { q: r.question_3, l: "Fahrstil" },
                    { q: r.question_4, l: "Pünktlichkeit" },
                    { q: r.question_5, l: "Eindruck" },
                  ].map(({ q, l }) => (
                    <span
                      key={l}
                      className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2 py-1 rounded-full"
                    >
                      {l}: <span className="font-semibold text-taxi-blue">{q}</span>/5
                    </span>
                  ))}
                </div>

                {r.private_comment && (
                  <blockquote className="text-sm text-gray-600 italic border-l-2 border-taxi-yellow pl-3 mt-2">
                    {r.private_comment}
                  </blockquote>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
