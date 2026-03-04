import Image from "next/image";
import Link from "next/link";
import type { Guide, User } from "@/lib/types";

interface GuideCardProps {
  guide: Guide;
  author?: User;
  placeCount?: number;
}

export function GuideCard({ guide, author, placeCount }: GuideCardProps) {
  return (
    <Link
      href={`/guide/${guide.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-[3/2] bg-gray-100 dark:bg-gray-800">
        {guide.coverImageUrl ? (
          <Image
            src={guide.coverImageUrl}
            alt={guide.title}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#00A5E0] to-[#0086B8]">
            <span className="px-4 text-center text-lg font-bold text-white">
              {guide.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {guide.title}
        </h3>
        {guide.description && (
          <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {guide.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1">
          {author?.avatarUrl && (
            <Image
              src={author.avatarUrl}
              alt={author.displayName}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          {author && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {author.displayName}
            </span>
          )}
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {placeCount !== undefined && `${placeCount} places`}
            {placeCount !== undefined && guide.likes > 0 && " · "}
            {guide.likes > 0 && `${guide.likes} likes`}
          </span>
        </div>
      </div>
    </Link>
  );
}
