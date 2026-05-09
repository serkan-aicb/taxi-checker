"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const CATEGORIES = [
  { key: "question_1", label: "Freundlichkeit", description: "War der Fahrer freundlich und höflich?" },
  { key: "question_2", label: "Sauberkeit", description: "War das Fahrzeug sauber und gepflegt?" },
  { key: "question_3", label: "Fahrstil", description: "Wie war der Fahrstil? Sicher und angenehm?" },
  { key: "question_4", label: "Pünktlichkeit", description: "War der Fahrer pünktlich?" },
  { key: "question_5", label: "Gesamteindruck", description: "Wie war Ihr Gesamteindruck der Fahrt?" },
] as const;

const reviewSchema = z.object({
  overall_rating: z.number().min(1).max(5),
  question_1: z.number().min(1).max(5),
  question_2: z.number().min(1).max(5),
  question_3: z.number().min(1).max(5),
  question_4: z.number().min(1).max(5),
  question_5: z.number().min(1).max(5),
  public_comment: z.string().max(1000).optional(),
  private_comment: z.string().max(500).optional(),
});

interface ReviewFormProps {
  driverId: string;
  driverSlug: string;
  driverName: string;
}

type Ratings = {
  overall_rating: number;
  question_1: number;
  question_2: number;
  question_3: number;
  question_4: number;
  question_5: number;
};

function StarInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label={`${label} bewerten`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} von 5 Sternen`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-taxi-yellow rounded"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              i <= (hovered || value)
                ? "text-taxi-yellow fill-taxi-yellow"
                : "text-gray-300 fill-transparent"
            }`}
            aria-hidden="true"
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-sm text-gray-500">
          {["", "Sehr schlecht", "Schlecht", "Okay", "Gut", "Sehr gut"][value]}
        </span>
      )}
    </div>
  );
}

export default function ReviewForm({ driverId, driverSlug, driverName }: ReviewFormProps) {
  const router = useRouter();
  const [ratings, setRatings] = useState<Ratings>({
    overall_rating: 0,
    question_1: 0,
    question_2: 0,
    question_3: 0,
    question_4: 0,
    question_5: 0,
  });
  const [privateComment, setPrivateComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allRated = Object.values(ratings).every((v) => v > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allRated) {
      setError("Bitte bewerten Sie alle Kategorien.");
      return;
    }

    const parsed = reviewSchema.safeParse({
      ...ratings,
      private_comment: privateComment || undefined,
    });

    if (!parsed.success) {
      setError("Ungültige Eingabe. Bitte prüfen Sie Ihre Angaben.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: dbError } = await (supabase.from("reviews") as any).insert({
        driver_id: driverId,
        ...parsed.data,
      });

      if (dbError) throw new Error(dbError.message);

      setSuccess(true);
      setTimeout(() => router.push(`/fahrer/${driverSlug}`), 3000);
    } catch (err: any) {
      setError(err.message ?? "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-taxi-blue mb-2">
          Vielen Dank für Ihre Bewertung!
        </h2>
        <p className="text-gray-500 text-sm">
          Ihre Bewertung wurde erfolgreich gespeichert.
          Sie werden in Kürze weitergeleitet...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label={`${driverName} bewerten`} noValidate>
      <h2 className="text-xl font-bold text-taxi-blue mb-6">
        Ihre Bewertung
      </h2>

      <fieldset className="mb-6">
        <legend className="font-semibold text-taxi-blue mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-taxi-yellow fill-taxi-yellow" aria-hidden="true" />
          Gesamtbewertung
          <span className="text-red-500" aria-hidden="true">*</span>
        </legend>
        <StarInput
          value={ratings.overall_rating}
          onChange={(v) => setRatings((r) => ({ ...r, overall_rating: v }))}
          label="Gesamtbewertung"
        />
      </fieldset>

      <fieldset className="mb-6">
        <legend className="font-semibold text-taxi-blue mb-4">
          Detailbewertungen
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </legend>
        <div className="space-y-4">
          {CATEGORIES.map(({ key, label, description }) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-taxi-blue text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
                <StarInput
                  value={ratings[key as keyof Ratings]}
                  onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                  label={label}
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mb-6">
        <label htmlFor="private-comment" className="block text-sm font-medium text-taxi-blue mb-2">
          Privater Kommentar{" "}
          <span className="text-gray-400 font-normal">(optional, nur für den Fahrer sichtbar)</span>
        </label>
        <textarea
          id="private-comment"
          value={privateComment}
          onChange={(e) => setPrivateComment(e.target.value)}
          placeholder="Feedback direkt an den Fahrer (wird nicht öffentlich angezeigt)..."
          maxLength={500}
          rows={3}
          className="input-field resize-none"
          aria-describedby="private-comment-hint"
        />
        <p id="private-comment-hint" className="text-xs text-gray-400 mt-1 text-right">
          {privateComment.length}/500 Zeichen
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !allRated}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <span className="w-4 h-4 border-2 border-taxi-blue/30 border-t-taxi-blue rounded-full animate-spin" aria-hidden="true" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Bewertung abschicken
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        <span className="text-red-500">*</span> Pflichtfelder
      </p>
    </form>
  );
}
