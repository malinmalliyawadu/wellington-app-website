import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapPost, mapPlace, mapProfile } from "@/lib/mappers";
import {
  SITE_URL,
  APP_STORE_ID,
  getPostDeepLink,
  CATEGORY_LABELS,
  PLACE_CATEGORY_COLORS,
} from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { MediaGallery } from "./MediaGallery";

export const revalidate = 60;

async function getPost(postId: string) {
  const { data } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("id", postId)
    .single();
  return data ? mapPost(data) : null;
}

async function getPlace(placeId: string) {
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();
  return data ? mapPlace(data) : null;
}

async function getUser(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data ? mapProfile(data) : null;
}

type Props = { params: Promise<{ postId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);
  if (!post) return { title: "Post not found" };

  const [user, place] = await Promise.all([
    getUser(post.userId),
    getPlace(post.placeId),
  ]);
  if (user?.profileVisibility === "private") return { title: "Post not found" };

  const truncatedContent =
    post.content.length > 100
      ? post.content.slice(0, 100) + "..."
      : post.content;
  const title = `"${truncatedContent}" - ${user?.displayName ?? "Someone"} on Welly`;
  const description = place
    ? `Recommendation at ${place.name}, ${place.address}`
    : "A recommendation on Welly";

  const imageUrl = getOgImageUrl(post, user, place);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/post/${postId}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${SITE_URL}/post/${postId}`,
    },
  };
}

function getOgImageUrl(
  post: {
    mediaUrl?: string;
    thumbnailUrl?: string;
    media?: { mediaUrl: string; thumbnailUrl?: string }[];
    content: string;
  },
  user: { displayName: string } | null,
  place: { name: string } | null
): string {
  const image =
    post.media?.[0]?.mediaUrl ??
    post.media?.[0]?.thumbnailUrl ??
    post.mediaUrl ??
    post.thumbnailUrl;
  if (image) return image;
  const params = new URLSearchParams({
    title: post.content.slice(0, 120),
    subtitle: [user?.displayName, place?.name].filter(Boolean).join(" at "),
  });
  return `${SITE_URL}/api/og?${params}`;
}

export default async function PostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);
  if (!post) notFound();

  const [user, place] = await Promise.all([
    getUser(post.userId),
    getPlace(post.placeId),
  ]);
  if (user?.profileVisibility === "private") notFound();

  const mediaItems =
    post.media && post.media.length > 0
      ? post.media.map((m) => ({
          id: m.id,
          mediaUrl: m.mediaUrl,
          thumbnailUrl: m.thumbnailUrl,
          mediaType: m.mediaType,
        }))
      : post.mediaUrl
        ? [
            {
              id: post.id,
              mediaUrl: post.mediaUrl,
              thumbnailUrl: post.thumbnailUrl,
              mediaType:
                post.type === "video"
                  ? ("video" as const)
                  : ("photo" as const),
            },
          ]
        : [];

  const hasMedia = mediaItems.length > 0;
  const categoryColor = place
    ? (PLACE_CATEGORY_COLORS[place.category] ?? "#6B7280")
    : "#6B7280";
  const categoryLabel = place
    ? (CATEGORY_LABELS[place.category] ?? place.category)
    : undefined;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Author header */}
      <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        {user?.avatarUrl && (
          <Image
            src={user.avatarUrl}
            alt={user.displayName}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.displayName}
          </p>
          {user?.username && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          )}
        </div>
      </header>

      {/* Media */}
      {hasMedia && (
        <ViewTransition name={`post-image-${post.id}`}>
          <MediaGallery items={mediaItems} />
        </ViewTransition>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 px-4 py-5">
        {/* Caption */}
        {post.content && (
          <p className="text-sm leading-relaxed text-gray-900 dark:text-white">
            {post.content}
          </p>
        )}

        {/* Place */}
        {place && (
          <Link
            href={`/place/${place.id}`}
            className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={categoryColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {place.name}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {categoryLabel} · {place.address}
              </p>
            </div>
          </Link>
        )}

        {/* Likes & date */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          {post.likes > 0 && (
            <span className="flex items-center gap-1">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-red-400"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </span>
          )}
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getPostDeepLink(postId)} />
        </div>
        <AppStoreBanner />
      </div>
    </div>
  );
}
