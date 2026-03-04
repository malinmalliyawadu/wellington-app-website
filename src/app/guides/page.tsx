import type { Metadata } from "next";
import { fetchGuidesPage } from "@/lib/queries";
import { PAGE_SIZE } from "@/lib/constants";
import { GuidesGrid } from "./GuidesGrid";
import { AppStoreBanner } from "@/components/AppStoreBanner";
import { Footer } from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Local guides to the best of Wellington — curated by people who live here.",
};

export default async function GuidesPage() {
  const { items, nextOffset } = await fetchGuidesPage(0, PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Guides
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Local guides to the best of Wellington
        </p>

        <GuidesGrid initialItems={items} initialNextOffset={nextOffset} />

        <div className="mt-12">
          <AppStoreBanner />
        </div>
      </div>
      <Footer />
    </div>
  );
}
