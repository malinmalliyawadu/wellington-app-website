import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapEvent, mapPlace } from "@/lib/mappers";
import {
  SITE_URL,
  APP_STORE_ID,
  getEventDeepLink,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
} from "@/lib/constants";
import { cacheLife } from "next/cache";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { Markdown } from "@/components/Markdown";

async function getEvent(eventId: string) {
  "use cache";
  cacheLife("moderate");
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  return data ? mapEvent(data) : null;
}

async function getPlace(placeId: string) {
  "use cache";
  cacheLife("moderate");
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();
  return data ? mapPlace(data) : null;
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  cacheLife("moderate");
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) return { title: "Event not found" };

  const place = await getPlace(event.placeId);

  const title = `${event.title} - Welly`;
  const formattedDate = new Date(event.date).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const eventDescription = event.aiDescription ?? event.description;
  const description = place
    ? `${formattedDate} at ${place.name} - ${eventDescription.slice(0, 150)}`
    : `${formattedDate} - ${eventDescription.slice(0, 150)}`;

  const imageUrl = event.imageUrl
    ? event.imageUrl
    : `${SITE_URL}/api/og?${new URLSearchParams({ title: event.title, subtitle: `${formattedDate}${place ? ` at ${place.name}` : ""}`, type: "event" })}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/event/${eventId}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${SITE_URL}/event/${eventId}`,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();

  const place = await getPlace(event.placeId);
  const eventDate = new Date(event.date);

  const dayName = eventDate.toLocaleDateString("en-NZ", { weekday: "short" }).toUpperCase();
  const dayNum = eventDate.getDate();
  const monthName = eventDate.toLocaleDateString("en-NZ", { month: "short" }).toUpperCase();
  const yearNum = eventDate.getFullYear();

  const formattedDateLong = eventDate.toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function formatTime(time: string) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return m ? `${hour}:${String(m).padStart(2, "0")}${period}` : `${hour}${period}`;
  }

  const categoryColor = EVENT_CATEGORY_COLORS[event.category] ?? "#00A5E0";
  const categoryLabel = EVENT_CATEGORY_LABELS[event.category] ?? event.category;

  const isFree = event.price === 0;
  const hasPrice = event.price !== undefined && event.price !== null;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="relative">
        <ViewTransition name={`event-image-${event.id}`}>
          {event.imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ) : (
            <div
              className="relative aspect-[3/2] w-full"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}18 0%, ${categoryColor}08 50%, ${categoryColor}18 100%)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 dark:text-white">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                </svg>
              </div>
            </div>
          )}
        </ViewTransition>

        {/* Overlaid content on hero */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          {/* Category pill */}
          <span
            className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase backdrop-blur-md"
            style={{
              backgroundColor: `${categoryColor}cc`,
              color: "#fff",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-white"
            />
            {categoryLabel}
          </span>

          {/* Title */}
          {event.imageUrl && (
            <ViewTransition name={`event-title-${event.id}`}>
              <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-white drop-shadow-lg">
                {event.title}
              </h1>
            </ViewTransition>
          )}
        </div>
      </div>

      {/* Title (when no image) */}
      {!event.imageUrl && (
        <div className="px-5 pt-5">
          <ViewTransition name={`event-title-${event.id}`}>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {event.title}
            </h1>
          </ViewTransition>
        </div>
      )}

      {/* Info strip */}
      <div className="flex gap-3 px-5 pt-5">
        {/* Date block */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor: `${categoryColor}10`,
          }}
        >
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: categoryColor }}
          >
            {dayName}
          </span>
          <span className="text-2xl font-extrabold leading-none text-gray-900 dark:text-white">
            {dayNum}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            {monthName} {yearNum}
          </span>
        </div>

        {/* Details column */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              style={{ color: categoryColor }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-semibold">
              {formatTime(event.startTime)}
              {event.endTime && (
                <span className="font-normal text-gray-400 dark:text-gray-500">
                  {" "}&ndash; {formatTime(event.endTime)}
                </span>
              )}
            </span>
          </div>

          {/* Price */}
          {hasPrice && (
            <div className="flex items-center gap-2 text-sm">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                style={{ color: categoryColor }}
              >
                {isFree ? (
                  <>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </>
                )}
              </svg>
              {isFree ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Free</span>
              ) : (
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  ${event.price!.toFixed(2)}
                </span>
              )}
            </div>
          )}

          {/* Date long form */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formattedDateLong}
          </p>
        </div>
      </div>

      {/* Place card */}
      {place && (
        <Link
          href={`/place/${place.id}`}
          className="group mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 transition-all hover:border-gray-200 hover:bg-gray-100/80 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${categoryColor}15` }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: categoryColor }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
              {place.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {place.address}
            </p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}

      {/* Description */}
      <div className="px-5 pt-5">
        <div className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
          <Markdown>{event.aiDescription ?? event.description}</Markdown>
        </div>
      </div>

      {/* Ticket CTA */}
      {event.ticketUrl && (
        <div className="px-5 pt-5">
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: categoryColor }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 17v2" />
              <path d="M13 11v2" />
            </svg>
            Get Tickets
          </a>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 px-5 pt-8 pb-6">
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${categoryColor}30, transparent)`,
          }}
        />
        <div className="text-center">
          <OpenInAppButton deepLink={getEventDeepLink(eventId)} />
        </div>
        <AppStoreBanner />
      </div>
    </div>
  );
}
