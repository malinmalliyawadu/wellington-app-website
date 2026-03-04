"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseInfiniteScrollOptions<T> {
  initialItems: T[];
  initialNextOffset: number;
  pageSize: number;
  fetchUrl: string;
  extraParams?: Record<string, string>;
}

interface UseInfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll<T>({
  initialItems,
  initialNextOffset,
  pageSize,
  fetchUrl,
  extraParams,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [nextOffset, setNextOffset] = useState(initialNextOffset);
  const [hasMore, setHasMore] = useState(initialItems.length >= pageSize);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);
  const nextOffsetRef = useRef(initialNextOffset);
  const hasMoreRef = useRef(initialItems.length >= pageSize);

  // Keep refs in sync
  useEffect(() => {
    nextOffsetRef.current = nextOffset;
  }, [nextOffset]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    const params = new URLSearchParams({
      offset: String(nextOffsetRef.current),
      pageSize: String(pageSize),
      ...extraParams,
    });

    try {
      const res = await fetch(`${fetchUrl}?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setItems((prev) => [...prev, ...data.items]);
      setNextOffset(data.nextOffset);
      setHasMore(data.hasMore);
    } catch {
      // Stop trying on error
      setHasMore(false);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchUrl, pageSize, extraParams]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: "200px" }
      );
      observerRef.current.observe(node);
    },
    [loadMore]
  );

  return { items, isLoading, hasMore, sentinelRef };
}
