"use client";

import { GuideCard } from "@/components/GuideCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { PAGE_SIZE } from "@/lib/constants";
import type { GuideItem } from "@/lib/queries";

interface GuidesGridProps {
  initialItems: GuideItem[];
  initialNextOffset: number;
}

export function GuidesGrid({ initialItems, initialNextOffset }: GuidesGridProps) {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<GuideItem>({
    initialItems,
    initialNextOffset,
    pageSize: PAGE_SIZE,
    fetchUrl: "/api/guides",
  });

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No guides found.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ guide, author, placeCount }) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            author={author}
            placeCount={placeCount}
          />
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
