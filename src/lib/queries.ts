import { supabase } from "./supabase";
import { mapPost, mapProfile, mapPlace, mapEvent, mapGuide } from "./mappers";
import type { Post, User, Place, Event, Guide } from "./types";

export interface FeedItem {
  post: Post;
  author: User;
  place?: Place;
}

export interface EventItem {
  event: Event;
  venueName?: string;
}

export interface GuideItem {
  guide: Guide;
  author: User;
  placeCount: number;
}

interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  nextOffset: number;
}

const OVERFETCH_EXTRA = 12;

export async function fetchFeedPage(
  rawOffset: number,
  pageSize: number
): Promise<PaginatedResult<FeedItem>> {
  const fetchCount = pageSize + OVERFETCH_EXTRA;
  const { data: postRows } = await supabase
    .from("posts")
    .select("*, post_media(*)")
    .order("created_at", { ascending: false })
    .range(rawOffset, rawOffset + fetchCount - 1);

  const posts = (postRows ?? []).map(mapPost);

  // Batch-fetch profiles and places
  const userIds = [...new Set(posts.map((p) => p.userId))];
  const placeIds = [...new Set(posts.map((p) => p.placeId))];

  const [profileRows, placeRows] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profiles").select("*").in("id", userIds).then((r) => r.data)
      : Promise.resolve([]),
    placeIds.length > 0
      ? supabase.from("places").select("*").in("id", placeIds).then((r) => r.data)
      : Promise.resolve([]),
  ]);

  const users = new Map<string, User>(
    (profileRows ?? []).map(mapProfile).map((u) => [u.id, u])
  );
  const places = new Map<string, Place>(
    (placeRows ?? []).map(mapPlace).map((p) => [p.id, p])
  );

  // Walk rows, filter private profiles, track consumed count
  const items: FeedItem[] = [];
  let consumed = 0;
  for (const post of posts) {
    consumed++;
    const author = users.get(post.userId);
    if (!author || author.profileVisibility === "private") continue;
    items.push({ post, author, place: places.get(post.placeId) });
    if (items.length >= pageSize) break;
  }

  const nextOffset = rawOffset + consumed;
  const hasMore = consumed < posts.length || items.length === pageSize;

  return { items, hasMore, nextOffset };
}

export async function fetchEventsPage(
  rawOffset: number,
  pageSize: number,
  category?: string
): Promise<PaginatedResult<EventItem>> {
  let query = supabase
    .from("events")
    .select("*")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("ai_score", { ascending: false, nullsFirst: false })
    .order("date", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  query = query.range(rawOffset, rawOffset + pageSize - 1);

  const { data } = await query;
  const events = (data ?? []).map(mapEvent);

  // Fetch venue names
  const placeIds = [...new Set(events.map((e) => e.placeId))];
  let placeNames = new Map<string, string>();
  if (placeIds.length > 0) {
    const { data: placeData } = await supabase
      .from("places")
      .select("*")
      .in("id", placeIds);
    placeNames = new Map(
      (placeData ?? []).map(mapPlace).map((p) => [p.id, p.name])
    );
  }

  const items: EventItem[] = events.map((event) => ({
    event,
    venueName: placeNames.get(event.placeId),
  }));

  const nextOffset = rawOffset + events.length;
  const hasMore = events.length === pageSize;

  return { items, hasMore, nextOffset };
}

export async function fetchGuidesPage(
  rawOffset: number,
  pageSize: number
): Promise<PaginatedResult<GuideItem>> {
  const fetchCount = pageSize + OVERFETCH_EXTRA;
  const { data: guideRows } = await supabase
    .from("guides")
    .select("*")
    .order("likes", { ascending: false })
    .range(rawOffset, rawOffset + fetchCount - 1);

  const guides = (guideRows ?? []).map(mapGuide);

  // Batch-fetch authors and place counts
  const userIds = [...new Set(guides.map((g) => g.userId))];
  const guideIds = guides.map((g) => g.id);

  const [profileRows, guidePlaceRows] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profiles").select("*").in("id", userIds).then((r) => r.data)
      : Promise.resolve([]),
    guideIds.length > 0
      ? supabase.from("guide_places").select("guide_id").in("guide_id", guideIds).then((r) => r.data)
      : Promise.resolve([]),
  ]);

  const authors = new Map<string, User>(
    (profileRows ?? []).map(mapProfile).map((u) => [u.id, u])
  );

  const placeCounts = new Map<string, number>();
  for (const row of guidePlaceRows ?? []) {
    placeCounts.set(row.guide_id, (placeCounts.get(row.guide_id) ?? 0) + 1);
  }

  // Walk rows, filter private profiles, track consumed count
  const items: GuideItem[] = [];
  let consumed = 0;
  for (const guide of guides) {
    consumed++;
    const author = authors.get(guide.userId);
    if (!author || author.profileVisibility === "private") continue;
    items.push({ guide, author, placeCount: placeCounts.get(guide.id) ?? 0 });
    if (items.length >= pageSize) break;
  }

  const nextOffset = rawOffset + consumed;
  const hasMore = consumed < guides.length || items.length === pageSize;

  return { items, hasMore, nextOffset };
}
