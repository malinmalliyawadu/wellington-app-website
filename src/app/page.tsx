import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  mapEvent,
  mapPost,
  mapPlace,
  mapGuide,
  mapProfile,
} from "@/lib/mappers";
import { APP_STORE_URL } from "@/lib/constants";
import { EventCard } from "@/components/EventCard";
import { PostCard } from "@/components/PostCard";
import { PlaceCard } from "@/components/PlaceCard";
import { GuideCard } from "@/components/GuideCard";
import { Footer } from "@/components/Footer";
import { cacheLife } from "next/cache";
import type { User, Place } from "@/lib/types";

async function getUpcomingEvents() {
  const { data } = await supabase
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("ai_score", { ascending: false, nullsFirst: false })
    .order("date", { ascending: true })
    .limit(6);
  return (data ?? []).map(mapEvent);
}

async function getPlaceNamesByIds(ids: string[]) {
  if (ids.length === 0) return new Map<string, string>();
  const { data } = await supabase.from("places").select("*").in("id", ids);
  const places = (data ?? []).map(mapPlace);
  return new Map(places.map((p) => [p.id, p.name]));
}

async function getRecentPosts() {
  const { data: postRows } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .order("created_at", { ascending: false })
    .limit(12);

  const posts = (postRows ?? []).map(mapPost);

  const userIds = [...new Set(posts.map((p) => p.userId))];
  const placeIds = [...new Set(posts.map((p) => p.placeId))];

  const [profileRows, placeRows] = await Promise.all([
    userIds.length > 0
      ? supabase
          .from("profiles")
          .select("*")
          .in("id", userIds)
          .then((r) => r.data)
      : Promise.resolve([]),
    placeIds.length > 0
      ? supabase
          .from("places")
          .select("*")
          .in("id", placeIds)
          .then((r) => r.data)
      : Promise.resolve([]),
  ]);

  const users = new Map<string, User>(
    (profileRows ?? []).map(mapProfile).map((u) => [u.id, u])
  );
  const places = new Map<string, Place>(
    (placeRows ?? []).map(mapPlace).map((p) => [p.id, p])
  );

  // Filter out private profiles, take first 6
  const visiblePosts = posts
    .filter((p) => {
      const author = users.get(p.userId);
      return author && author.profileVisibility !== "private";
    })
    .slice(0, 6);

  return { posts: visiblePosts, users, places };
}

async function getPopularPlaces() {
  const { data: postData } = await supabase.from("posts").select("place_id");
  const counts = new Map<string, number>();
  for (const row of postData ?? []) {
    counts.set(row.place_id, (counts.get(row.place_id) ?? 0) + 1);
  }
  const topPlaceIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id);

  if (topPlaceIds.length === 0) return { places: [], postCounts: counts };

  const { data } = await supabase
    .from("places")
    .select("*")
    .in("id", topPlaceIds);
  const places = (data ?? []).map(mapPlace);
  places.sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0));
  return { places, postCounts: counts };
}

async function getTopGuides() {
  const { data } = await supabase
    .from("guides")
    .select("*")
    .order("likes", { ascending: false })
    .limit(6);
  return (data ?? []).map(mapGuide);
}

async function getAuthors(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, User>();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);
  const users = (data ?? []).map(mapProfile);
  return new Map(users.map((u) => [u.id, u]));
}

async function getGuidePlaceCounts(guideIds: string[]) {
  if (guideIds.length === 0) return new Map<string, number>();
  const { data } = await supabase
    .from("guide_places")
    .select("guide_id")
    .in("guide_id", guideIds);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.guide_id, (counts.get(row.guide_id) ?? 0) + 1);
  }
  return counts;
}

export default async function HomePage() {
  "use cache";
  cacheLife("moderate");
  const [events, recentPosts, { places, postCounts }, guides] =
    await Promise.all([
      getUpcomingEvents(),
      getRecentPosts(),
      getPopularPlaces(),
      getTopGuides(),
    ]);

  // Batch-fetch venue names for events
  const eventPlaceIds = [...new Set(events.map((e) => e.placeId))];
  const placeNames = await getPlaceNamesByIds(eventPlaceIds);

  // Fetch guide authors and place counts
  const guideUserIds = [...new Set(guides.map((g) => g.userId))];
  const [authors, guidePlaceCounts] = await Promise.all([
    getAuthors(guideUserIds),
    getGuidePlaceCounts(guides.map((g) => g.id)),
  ]);

  const visibleGuides = guides
    .filter((g) => {
      const author = authors.get(g.userId);
      return author && author.profileVisibility !== "private";
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
        <Image
          src="/logo.png"
          alt="Welly"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Discover Wellington
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-gray-500 dark:text-gray-400">
          Follow locals you trust. See their favourite spots on a map. Find
          what&apos;s happening around town.
        </p>
        <div className="mt-8">
          <a
            href={APP_STORE_URL}
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Download for iOS
          </a>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-sm font-medium text-[#00A5E0] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                venueName={placeNames.get(event.placeId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.posts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <Link
              href="/feed"
              className="text-sm font-medium text-[#00A5E0] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={recentPosts.users.get(post.userId)}
                place={recentPosts.places.get(post.placeId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Places */}
      {places.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Popular Places
            </h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                postCount={postCounts.get(place.id) ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Local Guides */}
      {visibleGuides.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Local Guides
            </h2>
            <Link
              href="/guides"
              className="text-sm font-medium text-[#00A5E0] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                author={authors.get(guide.userId)}
                placeCount={guidePlaceCounts.get(guide.id) ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Feature Highlights */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10 dark:bg-[#00A5E0]/20">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Follow Locals
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Friends, food bloggers, event promoters — follow the people who
              know Wellington best.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10 dark:bg-[#00A5E0]/20">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Map-Based Discovery
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See recommendations on a map. Browse what&apos;s nearby or explore
              different neighbourhoods.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A5E0]/10 dark:bg-[#00A5E0]/20">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00A5E0"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Events
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gigs, markets, comedy nights — find what&apos;s on in Wellington
              this week.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#00A5E0] to-[#0086B8] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Get the full experience
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Download Welly to follow locals, discover hidden spots, and stay in
            the loop on what&apos;s happening.
          </p>
          <a
            href={APP_STORE_URL}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-[#00A5E0] transition-colors hover:bg-gray-100"
          >
            Download for iOS
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
