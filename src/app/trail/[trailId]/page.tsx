import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapTrail, mapPlace } from "@/lib/mappers";
import {
  SITE_URL,
  getTrailDeepLink,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
} from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 300;

async function getTrail(trailId: string) {
  const { data } = await supabase
    .from("trails")
    .select("*")
    .eq("id", trailId)
    .single();
  return data ? mapTrail(data) : null;
}

async function getPlace(placeId: string) {
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();
  return data ? mapPlace(data) : null;
}

type Props = { params: Promise<{ trailId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trailId } = await params;
  const trail = await getTrail(trailId);
  if (!trail) return { title: "Trail not found" };

  const title = `${trail.name} - Welly`;
  const description = `${trail.distance} · ${trail.elevation} elevation · ${trail.difficulty} — ${trail.description.slice(0, 150)}`;

  const ogUrl = `${SITE_URL}/api/og?${new URLSearchParams({ title: trail.name, subtitle: `${trail.distance} · ${trail.elevation} elevation`, type: "trail" })}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/trail/${trailId}`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function TrailPage({ params }: Props) {
  const { trailId } = await params;
  const trail = await getTrail(trailId);
  if (!trail) notFound();

  const place = await getPlace(trail.placeId);
  const difficultyColor =
    DIFFICULTY_COLORS[trail.difficulty] ?? DIFFICULTY_COLORS.moderate;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-5">
        <span
          className="inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: difficultyColor }}
        >
          {DIFFICULTY_LABELS[trail.difficulty] ?? trail.difficulty}
        </span>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{trail.name}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-y border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center gap-1 py-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-500"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {trail.distance}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Distance</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-gray-100 py-4 dark:border-gray-800">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-500"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {trail.elevation}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Elevation</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-4">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-gray-500"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {trail.duration}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Duration</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4 px-4 py-5">
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line dark:text-gray-300">
          {trail.description}
        </p>

        {/* Location */}
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

        {/* Highlights */}
        {trail.highlights.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Highlights
            </h2>
            <ul className="space-y-1">
              {trail.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="mt-1 text-gray-300 dark:text-gray-600">-</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getTrailDeepLink(trailId)} />
        </div>
        <AppStoreBanner />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
