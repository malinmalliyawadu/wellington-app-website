import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_COLORS } from "@/lib/constants";

interface EventCardProps {
  event: Event;
  venueName?: string;
}

export function EventCard({ event, venueName }: EventCardProps) {
  const categoryLabel =
    EVENT_CATEGORY_LABELS[event.category] ?? event.category;
  const categoryColor = EVENT_CATEGORY_COLORS[event.category] ?? "#6B7280";

  const formattedDate = new Date(event.date).toLocaleDateString("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  function formatTime(time: string) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return m ? `${hour}:${String(m).padStart(2, "0")}${period}` : `${hour}${period}`;
  }

  return (
    <Link
      href={`/event/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <ViewTransition name={`event-image-${event.id}`}>
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ backgroundColor: `${categoryColor}15` }}
            >
              <span className="text-3xl font-bold" style={{ color: categoryColor }}>
                {categoryLabel}
              </span>
            </div>
          )}
          <span
            className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </span>
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <ViewTransition name={`event-title-${event.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h3>
        </ViewTransition>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate} · {formatTime(event.startTime)}
        </p>
        {venueName && (
          <p className="line-clamp-1 text-xs text-gray-400 dark:text-gray-500">
            {venueName}
          </p>
        )}
        {event.price !== undefined && event.price !== null && (
          <p className="mt-auto pt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
          </p>
        )}
      </div>
    </Link>
  );
}
