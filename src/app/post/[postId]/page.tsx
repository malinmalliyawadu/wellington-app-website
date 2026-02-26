import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapPost, mapPlace, mapProfile } from "@/lib/mappers";
import { SITE_URL, APP_STORE_ID, getPostDeepLink } from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  post: { mediaUrl?: string; thumbnailUrl?: string; media?: { mediaUrl: string; thumbnailUrl?: string }[]; content: string },
  user: { displayName: string } | null,
  place: { name: string } | null,
): string {
  // Use post image if available
  const image = post.media?.[0]?.mediaUrl ?? post.media?.[0]?.thumbnailUrl ?? post.mediaUrl ?? post.thumbnailUrl;
  if (image) return image;
  // Fall back to dynamic OG image
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

  const image =
    post.media?.[0]?.mediaUrl ?? post.mediaUrl;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Header */}
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
            <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
          )}
        </div>
      </header>

      {/* Image */}
      {image && (
        <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={image}
            alt={post.content}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-3 px-4 py-4">
        <p className="text-sm leading-relaxed text-gray-900 dark:text-white">{post.content}</p>

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

        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>{post.likes} likes</span>
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
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
