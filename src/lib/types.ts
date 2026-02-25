export type PostType = "photo" | "video" | "text";

export type MediaType = "photo" | "video";

export interface MediaItem {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: MediaType;
  mediaWidth?: number;
  mediaHeight?: number;
  sortOrder: number;
}

export interface Post {
  id: string;
  userId: string;
  placeId: string;
  type: PostType;
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  likes: number;
  createdAt: string;
  media?: MediaItem[];
}

export type PlaceCategory =
  | "cafe"
  | "restaurant"
  | "bar"
  | "attraction"
  | "park"
  | "venue"
  | "trail";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  latitude: number;
  longitude: number;
}

export type EventCategory =
  | "music"
  | "comedy"
  | "art"
  | "food"
  | "market"
  | "community"
  | "quiz"
  | "craft"
  | "kids"
  | "cultural";

export interface Event {
  id: string;
  title: string;
  description: string;
  placeId: string;
  date: string;
  startTime: string;
  endTime?: string;
  imageUrl?: string;
  category: EventCategory;
  attendeeIds?: string[];
  ticketUrl?: string;
  price?: number | null;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
}

export type TrailDifficulty = "easy" | "moderate" | "hard";

export interface Trailhead {
  latitude: number;
  longitude: number;
  label: string;
}

export interface TrailCoordinate {
  latitude: number;
  longitude: number;
}

export interface Trail {
  id: string;
  name: string;
  description: string;
  elevation: string;
  distance: string;
  duration: string;
  difficulty: TrailDifficulty;
  highlights: string[];
  placeId: string;
  trailhead?: Trailhead;
  coordinates?: TrailCoordinate[];
}

export interface Guide {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  likes: number;
  createdAt: string;
}

export interface GuidePlace {
  placeId: string;
  sortOrder: number;
  note?: string;
  place: Place;
}

export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'other';
export type ReportContentType = 'post' | 'user' | 'comment';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  contentType: ReportContentType;
  contentId?: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}
