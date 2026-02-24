import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapEvent, mapPlace } from "@/lib/mappers";
import { SITE_URL, getEventDeepLink, CATEGORY_LABELS } from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 300;

async function getEvent(eventId: string) {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  return data ? mapEvent(data) : null;
}

async function getPlace(placeId: string) {
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();
  return data ? mapPlace(data) : null;
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  const description = place
    ? `${formattedDate} at ${place.name} - ${event.description.slice(0, 150)}`
    : `${formattedDate} - ${event.description.slice(0, 150)}`;

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
  };
}

export default async function EventPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) notFound();

  const place = await getPlace(event.placeId);
  const formattedDate = new Date(event.date).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 px-4 py-5">
        <div>
          <span className="mb-2 inline-block rounded-full bg-[#00A5E0]/10 px-3 py-1 text-xs font-semibold text-[#00A5E0] capitalize dark:bg-[#00A5E0]/20">
            {CATEGORY_LABELS[event.category] ?? event.category}
          </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-medium">{formattedDate}</span>
          <span className="text-gray-400 dark:text-gray-500">
            {event.startTime}
            {event.endTime ? ` - ${event.endTime}` : ""}
          </span>
        </div>

        {/* Place */}
        {place && (
          <a
            href={`/place/${place.id}`}
            className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-medium">{place.name}</span>
            <span className="text-gray-400 dark:text-gray-500">{place.address}</span>
          </a>
        )}

        {/* Price */}
        {event.price !== undefined && event.price !== null && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {event.price === 0 ? "Free" : `$${event.price}`}
          </p>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line dark:text-gray-300">
          {event.description}
        </p>

        {/* Ticket link */}
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[#00A5E0] px-5 py-2.5 text-sm font-semibold text-[#00A5E0] transition-colors hover:bg-[#00A5E0]/5"
          >
            Get Tickets
          </a>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getEventDeepLink(eventId)} />
        </div>
        <AppStoreBanner />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
