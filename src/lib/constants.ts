export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wellyapp.nz";

export const DEEP_LINK_SCHEME = "wellington://";

export const APP_NAME = "Welly";

export const APP_STORE_ID = "6758979767";
export const APP_STORE_URL = `https://apps.apple.com/app/welly-go-local/id${APP_STORE_ID}`;
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.welly.app"; // TODO: replace with real ID

export const BRAND_COLOR = "#00A5E0";

export const CATEGORY_LABELS: Record<string, string> = {
  cafe: "Cafe",
  restaurant: "Restaurant",
  bar: "Bar",
  attraction: "Attraction",
  park: "Park",
  venue: "Venue",
  trail: "Trail",
};

export function getDeepLink(path: string): string {
  return `${DEEP_LINK_SCHEME}/${path}`;
}

export function getPostDeepLink(postId: string): string {
  return getDeepLink(`feed/post/${postId}`);
}

export function getEventDeepLink(eventId: string): string {
  return getDeepLink(`events/${eventId}`);
}

export function getPlaceDeepLink(placeId: string): string {
  return getDeepLink(`feed/place/${placeId}`);
}

export function getUserDeepLink(userId: string): string {
  return getDeepLink(`feed/user/${userId}`);
}

export function getTrailDeepLink(trailId: string): string {
  return getDeepLink(`map/trail/${trailId}`);
}

export function getGuideDeepLink(guideId: string): string {
  return getDeepLink(`feed/guide/${guideId}`);
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#22C55E",
  moderate: "#F59E0B",
  hard: "#EF4444",
};
