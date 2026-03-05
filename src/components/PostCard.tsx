import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post, User, Place } from "@/lib/types";

interface PostCardProps {
  post: Post;
  author?: User;
  place?: Place;
}

function getPostImage(post: Post): string | undefined {
  const firstMedia = post.media?.[0];
  if (firstMedia) {
    // For videos, use thumbnail; for photos, use the media URL
    if (firstMedia.mediaType === "video") {
      return firstMedia.thumbnailUrl ?? post.thumbnailUrl;
    }
    return firstMedia.mediaUrl ?? firstMedia.thumbnailUrl;
  }
  // Fallback to legacy post-level fields
  if (post.type === "video") {
    return post.thumbnailUrl;
  }
  return post.mediaUrl ?? post.thumbnailUrl;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
  });
}

export function PostCard({ post, author, place }: PostCardProps) {
  const image = getPostImage(post);

  return (
    <Link
      href={`/post/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Image or text placeholder */}
      {image ? (
        <ViewTransition name={`post-image-${post.id}`}>
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
            <Image
              src={image}
              alt={post.content}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </ViewTransition>
      ) : (
        <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 p-4 dark:from-gray-800 dark:to-gray-900">
          <p className="line-clamp-6 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {post.content}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Author */}
        {author && (
          <div className="flex items-center gap-2">
            {author.avatarUrl && (
              <Image
                src={author.avatarUrl}
                alt={author.displayName}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
              {author.displayName}
            </span>
          </div>
        )}

        {/* Content (only if we showed an image above) */}
        {image && post.content && (
          <p className="line-clamp-2 text-sm text-gray-900 dark:text-white">
            {post.content}
          </p>
        )}

        {/* Place name */}
        {place && (
          <p className="line-clamp-1 text-xs text-gray-400 dark:text-gray-500">
            {place.name}
          </p>
        )}

        {/* Likes + date */}
        <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-gray-400 dark:text-gray-500">
          {post.likes > 0 && <span>{post.likes} likes</span>}
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
