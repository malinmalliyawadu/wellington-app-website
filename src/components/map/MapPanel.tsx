"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useMapStore } from "@/store/map-store";
import {
  CATEGORY_LABELS,
  PLACE_CATEGORY_COLORS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
} from "@/lib/constants";
import {
  Coffee,
  UtensilsCrossed,
  Wine,
  Camera,
  TreePine,
  Theater,
  Mountain,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Place, PlaceCategory, Post, User } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  cafe: Coffee,
  restaurant: UtensilsCrossed,
  bar: Wine,
  attraction: Camera,
  park: TreePine,
  venue: Theater,
  trail: Mountain,
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}


const CATEGORIES: { id: PlaceCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cafe", label: "Cafes" },
  { id: "restaurant", label: "Restaurants" },
  { id: "bar", label: "Bars" },
  { id: "attraction", label: "Attractions" },
  { id: "park", label: "Parks" },
  { id: "venue", label: "Venues" },
  { id: "trail", label: "Trails" },
];

interface PlaceDetails {
  posts: Post[];
  users: User[];
}

function PlaceDetailCard({
  place,
  distance,
  onClose,
}: {
  place: Place;
  distance: number | null;
  onClose: () => void;
}) {
  const {
    routeDestinationId,
    setRouteDestination,
    clearRoute,
    userLocation,
    setUserLocation,
    eventsByPlaceId,
  } = useMapStore();
  const placeEvents = eventsByPlaceId.get(place.id) ?? [];
  const [isLoadingRoute, setIsLoadingRoute] = React.useState(false);
  const isRouteActive = routeDestinationId === place.id;

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isRouteActive) {
      clearRoute();
      return;
    }

    if (userLocation) {
      setIsLoadingRoute(true);
      setRouteDestination(place.id);
      setTimeout(() => setIsLoadingRoute(false), 1500);
      return;
    }

    // Request location first
    if (!("geolocation" in navigator)) return;
    setIsLoadingRoute(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setRouteDestination(place.id);
        setTimeout(() => setIsLoadingRoute(false), 1500);
      },
      () => {
        setIsLoadingRoute(false);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  };
  const color = PLACE_CATEGORY_COLORS[place.category] ?? "#6b7280";
  const categoryLabel = CATEGORY_LABELS[place.category] ?? place.category;
  const { data: details, isLoading: loading } = useSWR<PlaceDetails>(
    `/api/places?id=${place.id}`,
    fetcher
  );

  const userMap = React.useMemo(() => {
    if (!details) return {};
    return Object.fromEntries(details.users.map((u) => [u.id, u]));
  }, [details]);

  // Get first post image for hero
  const heroImage =
    details?.posts[0]?.media?.[0]?.mediaUrl ??
    details?.posts[0]?.media?.[0]?.thumbnailUrl ??
    details?.posts[0]?.mediaUrl ??
    details?.posts[0]?.thumbnailUrl;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* Hero image or colored header */}
      {loading ? (
        <div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-700" />
      ) : heroImage ? (
        <div className="relative h-32">
          <Image
            src={heroImage}
            alt={place.name}
            fill
            className="object-cover"
            sizes="380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <button
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/30 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: color, color: "white" }}
              >
                {categoryLabel}
              </span>
              {distance !== null && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {formatDistance(distance)}
                </span>
              )}
            </div>
            <h3 className="mt-1 text-[15px] font-bold leading-tight text-white">
              {place.name}
            </h3>
          </div>
        </div>
      ) : (
        <div className="relative px-3.5 pb-3 pt-3.5" style={{ backgroundColor: `${color}10` }}>
          <button
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {categoryLabel}
            </span>
            {distance !== null && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {formatDistance(distance)}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-[15px] font-bold leading-tight text-gray-900 dark:text-white">
            {place.name}
          </h3>
        </div>
      )}

      {/* Address + stats */}
      <div className="flex items-center gap-2 px-3.5 pt-3 pb-1">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-400">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
          {place.address}
        </p>
      </div>

      {!loading && details && (
        <div className="flex items-center gap-3 px-3.5 pb-3 pt-1">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {details.posts.length} recommendation{details.posts.length !== 1 ? "s" : ""}
          </span>
          {placeEvents.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#8B5CF6]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {placeEvents.length} event{placeEvents.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Upcoming events */}
      {placeEvents.length > 0 && (
        <div className="mx-3.5 mb-3 overflow-hidden rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10">
          {placeEvents.slice(0, 2).map((event, i) => {
            const eventColor =
              EVENT_CATEGORY_COLORS[event.category] ?? "#6b7280";
            const eventLabel =
              EVENT_CATEGORY_LABELS[event.category] ?? event.category;
            const eventDate = new Date(event.date + "T00:00:00");
            const dateStr = eventDate.toLocaleDateString("en-NZ", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            return (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-[#8B5CF6]/10 ${
                  i > 0 ? "border-t border-[#8B5CF6]/10" : ""
                }`}
              >
                <div className="flex size-8 shrink-0 flex-col items-center justify-center rounded-md bg-white text-center dark:bg-gray-800">
                  <span className="text-[9px] font-medium uppercase leading-none text-gray-400">
                    {eventDate.toLocaleDateString("en-NZ", { month: "short" })}
                  </span>
                  <span className="text-sm font-bold leading-none text-gray-900 dark:text-white">
                    {eventDate.getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                    <span>{dateStr} · {event.startTime}</span>
                    <span
                      className="rounded px-1 py-px font-medium"
                      style={{ backgroundColor: `${eventColor}15`, color: eventColor }}
                    >
                      {eventLabel}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {placeEvents.length > 2 && (
            <div className="border-t border-[#8B5CF6]/10 px-3 py-1.5 text-center">
              <span className="text-[10px] font-medium text-[#8B5CF6]">
                +{placeEvents.length - 2} more
              </span>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="px-3.5 pb-3">
          <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      )}

      {/* Photo grid */}
      {!loading && details && details.posts.length > 0 && (
        <div className="px-3.5 pb-3">
          <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
            {details.posts.slice(0, 6).map((post) => {
              const image =
                post.media?.[0]?.mediaUrl ??
                post.media?.[0]?.thumbnailUrl ??
                post.mediaUrl ??
                post.thumbnailUrl;
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="relative aspect-square overflow-hidden rounded bg-gray-100 transition-opacity hover:opacity-80 dark:bg-gray-800"
                >
                  {image ? (
                    <Image src={image} alt={post.content} fill className="object-cover" sizes="110px" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-1.5">
                      <p className="line-clamp-3 text-[9px] text-gray-400">{post.content}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews */}
      {!loading && details && details.posts.length > 0 && (
        <div className="mx-3.5 mb-3 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800/50">
          {details.posts.slice(0, 2).map((post, i) => {
            const user = userMap[post.userId];
            return (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={`flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-700/40 ${
                  i > 0 ? "border-t border-gray-200/60 dark:border-gray-700/60" : ""
                }`}
              >
                {user?.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.displayName}
                    width={24}
                    height={24}
                    className="size-6 shrink-0 rounded-full"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[11px] font-semibold text-gray-900 dark:text-white">
                      {user?.displayName}
                    </p>
                    {post.likes > 0 && (
                      <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-gray-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#EF4444" stroke="none">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {post.likes}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400">
                    {post.content}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && details && details.posts.length === 0 && (
        <div className="px-3.5 pb-3">
          <div className="rounded-lg bg-gray-50 py-4 text-center dark:bg-gray-800/50">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No recommendations yet
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-3.5 py-2.5 dark:border-gray-800">
        <Link
          href={`/place/${place.id}`}
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          View all
        </Link>
        <button
          onClick={handleGetDirections}
          disabled={isLoadingRoute}
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
            isRouteActive
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#00A5E0] hover:bg-[#0086B8]"
          } disabled:opacity-50`}
        >
          {isLoadingRoute ? (
            <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          )}
          {isRouteActive ? "Clear route" : "Directions"}
        </button>
      </div>
    </div>
  );
}

export function MapPanel() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const {
    selectedPlaceId,
    searchQuery,
    sortBy,
    selectedCategory,
    selectPlace,
    setSearchQuery,
    setSortBy,
    setSelectedCategory,
    getFilteredPlaces,
    userLocation,
    isPanelVisible,
    setPanelVisible,
    eventsByPlaceId,
  } = useMapStore();

  const places = getFilteredPlaces();

  React.useEffect(() => {
    if (selectedPlaceId && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedPlaceId]);

  const orderedPlaces = React.useMemo(() => {
    if (!selectedPlaceId) return places;
    const selected = places.find((p) => p.id === selectedPlaceId);
    if (!selected) return places;
    return [selected, ...places.filter((p) => p.id !== selectedPlaceId)];
  }, [places, selectedPlaceId]);

  const getDistance = React.useCallback(
    (place: Place) => {
      if (!userLocation) return null;
      return calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.latitude,
        place.longitude
      );
    },
    [userLocation]
  );

  const handlePlaceClick = (place: Place) => {
    selectPlace(selectedPlaceId === place.id ? null : place.id);
  };

  if (!isPanelVisible) {
    return (
      <button
        className="absolute left-4 top-4 z-20 flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-xl sm:hidden dark:border-gray-700 dark:bg-gray-900"
        onClick={() => setPanelVisible(true)}
        aria-label="Show places"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 top-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-[380px] dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-3 dark:border-gray-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Places
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {places.length} place{places.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="flex size-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 sm:hidden dark:hover:bg-gray-800"
          onClick={() => setPanelVisible(false)}
          aria-label="Hide panel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search & Sort */}
      <div className="border-b border-gray-100 p-2 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white py-1 pl-8 pr-8 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#00A5E0] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 shrink-0 rounded-lg border border-gray-200 bg-white px-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            aria-label="Sort order"
          >
            <option value="alpha-az">A-Z</option>
            <option value="alpha-za">Z-A</option>
            <option value="nearest">Nearest</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-100 p-2 scrollbar-none dark:border-gray-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-[#00A5E0] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Place List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="space-y-1.5 p-2">
          {orderedPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-2 text-gray-300 dark:text-gray-600"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No places found
              </p>
            </div>
          ) : (
            orderedPlaces.map((place) => {
              const color =
                PLACE_CATEGORY_COLORS[place.category] ?? "#6b7280";
              const categoryLabel =
                CATEGORY_LABELS[place.category] ?? place.category;
              const isSelected = selectedPlaceId === place.id;
              const distance = getDistance(place);
              const eventCount = eventsByPlaceId.get(place.id)?.length ?? 0;

              if (isSelected) {
                return (
                  <PlaceDetailCard
                    key={place.id}
                    place={place}
                    distance={distance}
                    onClose={() => selectPlace(null)}
                  />
                );
              }

              return (
                <div
                  key={place.id}
                  className="group flex cursor-pointer flex-col gap-1.5 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  onClick={() => handlePlaceClick(place)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {React.createElement(
                        CATEGORY_ICON_MAP[place.category] ?? MapPin,
                        { size: 16, color, strokeWidth: 2 }
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {place.name}
                      </h3>
                      <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                        {place.address}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                      }}
                    >
                      {categoryLabel}
                    </span>
                  </div>

                  {(distance !== null || eventCount > 0) && (
                    <div className="flex items-center gap-3 pl-12">
                      {distance !== null && (
                        <div className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-400"
                          >
                            <polygon points="3 11 22 2 13 21 11 13 3 11" />
                          </svg>
                          <span className="text-xs font-medium text-gray-400">
                            {formatDistance(distance)}
                          </span>
                        </div>
                      )}
                      {eventCount > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span className="text-xs font-medium text-[#8B5CF6]">
                            {eventCount} event{eventCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
