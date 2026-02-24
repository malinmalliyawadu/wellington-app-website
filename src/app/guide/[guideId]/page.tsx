import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapGuide, mapGuidePlace, mapProfile } from "@/lib/mappers";
import {
  SITE_URL,
  getGuideDeepLink,
  CATEGORY_LABELS,
} from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 60;

async function getGuide(guideId: string) {
  const { data } = await supabase
    .from("guides")
    .select("*")
    .eq("id", guideId)
    .single();
  return data ? mapGuide(data) : null;
}

async function getGuidePlaces(guideId: string) {
  const { data } = await supabase
    .from("guide_places")
    .select("place_id, sort_order, note, places(id, name, category, address, latitude, longitude)")
    .eq("guide_id", guideId)
    .order("sort_order");
  if (!data) return [];
  return data.map((row) =>
    mapGuidePlace(row as Parameters<typeof mapGuidePlace>[0])
  );
}

async function getUser(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data ? mapProfile(data) : null;
}

type Props = { params: Promise<{ guideId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guideId } = await params;
  const guide = await getGuide(guideId);
  if (!guide) return { title: "Guide not found" };

  const user = await getUser(guide.userId);
  const title = `${guide.title} - Welly`;
  const description = guide.description
    ? guide.description.slice(0, 150)
    : `A local guide by ${user?.displayName ?? "someone"} on Welly`;

  const imageUrl = guide.coverImageUrl
    ? guide.coverImageUrl
    : `${SITE_URL}/api/og?${new URLSearchParams({ title: guide.title, subtitle: `Guide by ${user?.displayName ?? "a local"}`, type: "guide" })}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/guide/${guideId}`,
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

export default async function GuidePage({ params }: Props) {
  const { guideId } = await params;
  const guide = await getGuide(guideId);
  if (!guide) notFound();

  const [user, places] = await Promise.all([
    getUser(guide.userId),
    getGuidePlaces(guideId),
  ]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Cover Image */}
      {guide.coverImageUrl && (
        <div className="relative aspect-video w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={guide.coverImageUrl}
            alt={guide.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 px-4 py-5">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{guide.title}</h1>

        {/* Author */}
        {user && (
          <div className="flex items-center gap-2">
            {user.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              by <span className="font-medium text-gray-700 dark:text-gray-200">{user.displayName}</span>
            </span>
          </div>
        )}

        {guide.description && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {guide.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>{places.length} places</span>
          <span>{guide.likes} likes</span>
        </div>
      </div>

      {/* Places */}
      {places.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <h2 className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Places in this guide
          </h2>
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {places.map((gp, i) => (
              <li key={gp.placeId}>
                <a
                  href={`/place/${gp.placeId}`}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {gp.place.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <span className="capitalize">
                        {CATEGORY_LABELS[gp.place.category] ?? gp.place.category}
                      </span>
                      <span>{gp.place.address}</span>
                    </div>
                    {gp.note && (
                      <p className="mt-1 text-xs text-gray-500 italic dark:text-gray-400">
                        &ldquo;{gp.note}&rdquo;
                      </p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getGuideDeepLink(guideId)} />
        </div>
        <AppStoreBanner />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
