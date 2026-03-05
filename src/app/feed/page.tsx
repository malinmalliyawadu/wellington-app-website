import type { Metadata } from "next";
import { fetchFeedPage } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/constants";
import { FeedGrid } from "./FeedGrid";
import { cacheLife } from "next/cache";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "See what locals are recommending in Wellington — recent posts from the Welly community.",
};

export default async function FeedPage() {
  "use cache";
  cacheLife("frequent");
  const { items, nextOffset } = await fetchFeedPage(0, PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Feed
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recent posts from the Welly community
        </p>

        <FeedGrid initialItems={items} initialNextOffset={nextOffset} />

        <div className="mt-12">
          <AppStoreBanner />
        </div>
      </div>
      <Footer />
    </div>
  );
}
