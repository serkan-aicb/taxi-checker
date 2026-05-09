"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const starSize = sizeMap[size];

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Bewertung: ${rating} von ${maxStars} Sternen`}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={`${starSize} transition-colors ${
              filled
                ? "text-taxi-yellow fill-taxi-yellow"
                : "text-gray-300 fill-transparent"
            } ${interactive ? "cursor-pointer hover:text-taxi-yellow hover:fill-taxi-yellow" : ""}`}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
            aria-hidden="true"
          />
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-taxi-blue">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
