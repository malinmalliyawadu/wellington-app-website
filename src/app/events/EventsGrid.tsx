"use client";

import { EventCard } from "@/components/EventCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { PAGE_SIZE, EVENT_CATEGORY_LABELS } from "@/lib/constants";
import type { EventItem } from "@/lib/queries";
import type { EventCategory } from "@/lib/types";

interface EventsGridProps {
  initialItems: EventItem[];
  initialNextOffset: number;
  category?: string;
}

export function EventsGrid({ initialItems, initialNextOffset, category }: EventsGridProps) {
  const extraParams = category ? { category } : undefined;

  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<EventItem>({
    initialItems,
    initialNextOffset,
    pageSize: PAGE_SIZE,
    fetchUrl: "/api/events",
    extraParams,
  });

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No upcoming events found
          {category ? ` for ${EVENT_CATEGORY_LABELS[category as EventCategory] ?? category}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ event, venueName }) => (
          <EventCard key={event.id} event={event} venueName={venueName} />
        ))}
      </div>
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-8"
        >
          {isLoading && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#00A5E0]" />
          )}
        </div>
      )}
    </>
  );
}
