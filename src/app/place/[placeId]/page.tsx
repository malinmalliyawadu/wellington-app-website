import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapPlace, mapPost, mapProfile } from "@/lib/mappers";
import {
  SITE_URL,
  APP_STORE_ID,
  getPlaceDeepLink,
  CATEGORY_LABELS,
} from "@/lib/constants";
import { cacheLife } from "next/cache";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";

async function getPlace(placeId: string) {
  "use cache";
  cacheLife("infrequent");
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();
  return data ? mapPlace(data) : null;
}

async function getPostsForPlace(placeId: string) {
  "use cache";
  cacheLife("infrequent");
  const { data } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("place_id", placeId)
    .order("likes", { ascending: false })
    .limit(12);
  return (data ?? []).map(mapPost);
}

async function getUsersByIds(ids: string[]) {
  "use cache";
  cacheLife("infrequent");
  if (ids.length === 0) return [];
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);
  return (data ?? []).map(mapProfile);
}

export async function generateStaticParams() {
  const { data } = await supabase.from("places").select("id");
  return (data ?? []).map((row) => ({ placeId: row.id }));
}

type Props = { params: Promise<{ placeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  cacheLife("infrequent");
  const { placeId } = await params;
  const place = await getPlace(placeId);
  if (!place) return { title: "Place not found" };

  const allPosts = await getPostsForPlace(placeId);
  const postUserIds = [...new Set(allPosts.map((p) => p.userId))];
  const postUsers = await getUsersByIds(postUserIds);
  const publicUserIds = new Set(
    postUsers.filter((u) => u.profileVisibility !== "private").map((u) => u.id)
  );
  const posts = allPosts.filter((p) => publicUserIds.has(p.userId));
  const title = `${place.name} - Welly`;
  const categoryLabel = CATEGORY_LABELS[place.category] ?? place.category;
  const description = `${categoryLabel} in Wellington - ${posts.length} recommendation${posts.length !== 1 ? "s" : ""}`;

  const firstImage =
    posts[0]?.media?.[0]?.mediaUrl ?? posts[0]?.mediaUrl;
  const imageUrl =
    firstImage ??
    `${SITE_URL}/api/og?${new URLSearchParams({ title: place.name, subtitle: `${categoryLabel} - ${place.address}`, type: "place" })}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/place/${placeId}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${SITE_URL}/place/${placeId}`,
    },
  };
}

export default async function PlacePage({ params }: Props) {
  "use cache";
  cacheLife("infrequent");
  const { placeId } = await params;
  const place = await getPlace(placeId);
  if (!place) notFound();

  const allPosts = await getPostsForPlace(placeId);
  const userIds = [...new Set(allPosts.map((p) => p.userId))];
  const users = await getUsersByIds(userIds);
  const publicUsers = users.filter((u) => u.profileVisibility !== "private");
  const publicUserIds = new Set(publicUsers.map((u) => u.id));
  const posts = allPosts.filter((p) => publicUserIds.has(p.userId));
  const userMap = Object.fromEntries(publicUsers.map((u) => [u.id, u]));

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-100 px-4 py-5 dark:border-gray-800">
        <span className="mb-2 inline-block rounded-full bg-[#00A5E0]/10 px-3 py-1 text-xs font-semibold text-[#00A5E0] capitalize dark:bg-[#00A5E0]/20">
          {CATEGORY_LABELS[place.category] ?? place.category}
        </span>
        <ViewTransition name={`place-name-${place.id}`}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{place.name}</h1>
        </ViewTransition>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{place.address}</p>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          {posts.length} recommendation{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Post Grid */}
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {posts.map((post) => {
            const image =
              post.media?.[0]?.mediaUrl ??
              post.media?.[0]?.thumbnailUrl ??
              post.mediaUrl ??
              post.thumbnailUrl;
            return (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="relative aspect-square bg-gray-100 dark:bg-gray-800"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={post.content}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 33vw, 170px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-2">
                    <p className="line-clamp-3 text-xs text-gray-500 dark:text-gray-400">
                      {post.content}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Recent reviews */}
      {posts.slice(0, 3).map((post) => {
        const user = userMap[post.userId];
        return (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex gap-3 border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            {user?.avatarUrl && (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {user?.displayName}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                {post.content}
              </p>
            </div>
          </Link>
        );
      })}

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getPlaceDeepLink(placeId)} />
        </div>
        <AppStoreBanner />
      </div>
    </div>
  );
}
