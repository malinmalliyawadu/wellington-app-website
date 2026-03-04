import Link from "next/link";
import type { Place } from "@/lib/types";
import { CATEGORY_LABELS, PLACE_CATEGORY_COLORS } from "@/lib/constants";

interface PlaceCardProps {
  place: Place;
  postCount?: number;
}

export function PlaceCard({ place, postCount }: PlaceCardProps) {
  const categoryLabel = CATEGORY_LABELS[place.category] ?? place.category;
  const categoryColor = PLACE_CATEGORY_COLORS[place.category] ?? "#6B7280";

  return (
    <Link
      href={`/place/${place.id}`}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: categoryColor }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
          {place.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {categoryLabel}
          </span>
          <span className="line-clamp-1">{place.address}</span>
        </div>
      </div>
      {postCount !== undefined && postCount > 0 && (
        <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
          {postCount} post{postCount !== 1 ? "s" : ""}
        </span>
      )}
    </Link>
  );
}
