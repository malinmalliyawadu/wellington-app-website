import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchEventsPage } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/constants";
import {
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_COLORS,
} from "@/lib/constants";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EventsGrid } from "./EventsGrid";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { Footer } from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover what's on in Wellington — gigs, markets, comedy nights, and more.",
};

const categories = Object.entries(EVENT_CATEGORY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
    color: EVENT_CATEGORY_COLORS[value] ?? "#6B7280",
  })
);

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { items, nextOffset } = await fetchEventsPage(0, PAGE_SIZE, category);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Events
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          What&apos;s on in Wellington
        </p>

        <div className="mt-6">
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        <div className="mt-6">
          <EventsGrid
            key={category ?? "all"}
            initialItems={items}
            initialNextOffset={nextOffset}
            category={category}
          />
        </div>

        <div className="mt-12">
          <AppStoreBanner />
        </div>
      </div>
      <Footer />
    </div>
  );
}
