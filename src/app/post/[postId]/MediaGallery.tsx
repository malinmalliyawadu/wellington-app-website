"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: "photo" | "video";
}

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMultiple = items.length > 1;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  }, []);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full bg-gray-100 dark:bg-gray-800">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
      >
        {items.map((media, i) => (
          <div
            key={media.id}
            className="relative aspect-square w-full shrink-0 snap-center"
          >
            {media.mediaType === "video" ? (
              <video
                src={media.mediaUrl}
                poster={media.thumbnailUrl}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-contain bg-black"
              />
            ) : (
              <Image
                src={media.mediaUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
                priority={i === 0}
              />
            )}
          </div>
        ))}
      </div>

      {/* Arrow controls */}
      {isMultiple && activeIndex > 0 && (
        <button
          onClick={() => scrollTo(activeIndex - 1)}
          className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {isMultiple && activeIndex < items.length - 1 && (
        <button
          onClick={() => scrollTo(activeIndex + 1)}
          className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {isMultiple && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {items.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {isMultiple && (
        <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {activeIndex + 1}/{items.length}
        </span>
      )}
    </div>
  );
}
