import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mapProfile, mapPost } from "@/lib/mappers";
import { SITE_URL, getUserDeepLink } from "@/lib/constants";
import { OpenInAppButton } from "@/components/OpenInAppButton";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 300;

async function getUser(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data ? mapProfile(data) : null;
}

async function getUserPosts(userId: string) {
  const { data } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);
  return (data ?? []).map(mapPost);
}

async function getFollowerCount(userId: string) {
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);
  return count ?? 0;
}

type Props = { params: Promise<{ userId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUser(userId);
  if (!user) return { title: "User not found" };

  const [posts, followers] = await Promise.all([
    getUserPosts(userId),
    getFollowerCount(userId),
  ]);

  const title = `${user.displayName} (@${user.username}) - Welly`;
  const description = user.bio
    ? `${user.bio} - ${posts.length} recommendation${posts.length !== 1 ? "s" : ""}`
    : `${posts.length} recommendation${posts.length !== 1 ? "s" : ""} - ${followers} follower${followers !== 1 ? "s" : ""}`;

  const imageUrl = user.avatarUrl
    ? user.avatarUrl
    : `${SITE_URL}/api/og?${new URLSearchParams({ title: user.displayName, subtitle: `@${user.username}`, type: "user" })}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${SITE_URL}/user/${userId}`,
      images: [{ url: imageUrl, width: 400, height: 400 }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function UserPage({ params }: Props) {
  const { userId } = await params;
  const user = await getUser(userId);
  if (!user) notFound();

  const [posts, followers] = await Promise.all([
    getUserPosts(userId),
    getFollowerCount(userId),
  ]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white dark:bg-gray-950">
      {/* Profile Header */}
      <div className="flex flex-col items-center border-b border-gray-100 px-4 py-6 dark:border-gray-800">
        {user.avatarUrl && (
          <Image
            src={user.avatarUrl}
            alt={user.displayName}
            width={80}
            height={80}
            className="mb-3 rounded-full"
            priority
          />
        )}
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {user.displayName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
        {user.bio && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
        )}
        <div className="mt-3 flex gap-6 text-sm">
          <div className="text-center">
            <span className="font-semibold text-gray-900 dark:text-white">{posts.length}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">posts</span>
          </div>
          <div className="text-center">
            <span className="font-semibold text-gray-900 dark:text-white">{followers}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">followers</span>
          </div>
        </div>
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
              <a
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
              </a>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 px-4 py-6 dark:border-gray-800">
        <div className="text-center">
          <OpenInAppButton deepLink={getUserDeepLink(userId)} />
        </div>
        <AppStoreBanner />
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
