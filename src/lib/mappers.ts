import type { Post, MediaItem, Event, Place, User, Trail, Guide, GuidePlace } from "./types";

export function mapMediaItem(row: {
  id: string;
  media_url: string;
  thumbnail_url: string | null;
  media_type: string;
  media_width: number | null;
  media_height: number | null;
  sort_order: number;
}): MediaItem {
  return {
    id: row.id,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    mediaType: row.media_type as MediaItem["mediaType"],
    mediaWidth: row.media_width ?? undefined,
    mediaHeight: row.media_height ?? undefined,
    sortOrder: row.sort_order,
  };
}

export function mapPost(row: {
  id: string;
  user_id: string;
  place_id: string;
  type: string;
  content: string;
  media_url: string | null;
  thumbnail_url: string | null;
  media_width?: number | null;
  media_height?: number | null;
  likes: number;
  created_at: string;
  post_media?: Array<{
    id: string;
    media_url: string;
    thumbnail_url: string | null;
    media_type: string;
    media_width: number | null;
    media_height: number | null;
    sort_order: number;
  }>;
}): Post {
  const mediaRows = row.post_media ?? [];
  const media = mediaRows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapMediaItem);

  return {
    id: row.id,
    userId: row.user_id,
    placeId: row.place_id,
    type: row.type as Post["type"],
    content: row.content,
    mediaUrl: row.media_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    mediaWidth: row.media_width ?? undefined,
    mediaHeight: row.media_height ?? undefined,
    likes: row.likes,
    createdAt: row.created_at,
    media: media.length > 0 ? media : undefined,
  };
}

export function mapEvent(row: {
  id: string;
  title: string;
  description: string;
  place_id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  image_url: string | null;
  category: string;
  ticket_url: string | null;
  price: number | null;
}): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    placeId: row.place_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time ?? undefined,
    imageUrl: row.image_url ?? undefined,
    category: row.category as Event["category"],
    ticketUrl: row.ticket_url ?? undefined,
    price: row.price,
  };
}

export function mapPlace(row: {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
}): Place {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Place["category"],
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export function mapTrail(row: {
  id: string;
  name: string;
  description: string;
  elevation: string;
  distance: string;
  duration: string;
  difficulty: string;
  highlights: string[] | unknown;
  place_id: string;
}): Trail {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    elevation: row.elevation,
    distance: row.distance,
    duration: row.duration,
    difficulty: row.difficulty as Trail["difficulty"],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    placeId: row.place_id,
  };
}

export function mapGuide(row: {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  likes: number;
  created_at: string;
}): Guide {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    likes: row.likes,
    createdAt: row.created_at,
  };
}

export function mapGuidePlace(row: {
  place_id: string;
  sort_order: number;
  note: string | null;
  places:
    | {
        id: string;
        name: string;
        category: string;
        address: string;
        latitude: number;
        longitude: number;
      }
    | {
        id: string;
        name: string;
        category: string;
        address: string;
        latitude: number;
        longitude: number;
      }[];
}): GuidePlace {
  const placeData = Array.isArray(row.places) ? row.places[0] : row.places;
  return {
    placeId: row.place_id,
    sortOrder: row.sort_order,
    note: row.note ?? undefined,
    place: mapPlace(placeData),
  };
}

export function mapProfile(row: {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string | null;
}): User {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio ?? undefined,
  };
}
