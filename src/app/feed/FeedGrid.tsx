"use client";

import { PostCard } from "@/components/PostCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { PAGE_SIZE } from "@/lib/constants";
import type { FeedItem } from "@/lib/queries";

interface FeedGridProps {
  initialItems: FeedItem[];
  initialNextOffset: number;
}

export function FeedGrid({ initialItems, initialNextOffset }: FeedGridProps) {
  const { items, isLoading, hasMore, sentinelRef } = useInfiniteScroll<FeedItem>({
    initialItems,
    initialNextOffset,
    pageSize: PAGE_SIZE,
    fetchUrl: "/api/feed",
  });

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ post, author, place }) => (
          <PostCard key={post.id} post={post} author={author} place={place} />
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
