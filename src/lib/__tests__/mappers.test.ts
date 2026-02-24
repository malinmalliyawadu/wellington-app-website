import { describe, it, expect } from "vitest";
import {
  mapMediaItem,
  mapPost,
  mapEvent,
  mapPlace,
  mapTrail,
  mapGuide,
  mapGuidePlace,
  mapProfile,
} from "../mappers";

describe("mapMediaItem", () => {
  it("maps snake_case row to camelCase MediaItem", () => {
    const result = mapMediaItem({
      id: "m1",
      media_url: "https://example.com/photo.jpg",
      thumbnail_url: "https://example.com/thumb.jpg",
      media_type: "photo",
      media_width: 1920,
      media_height: 1080,
      sort_order: 0,
    });

    expect(result).toEqual({
      id: "m1",
      mediaUrl: "https://example.com/photo.jpg",
      thumbnailUrl: "https://example.com/thumb.jpg",
      mediaType: "photo",
      mediaWidth: 1920,
      mediaHeight: 1080,
      sortOrder: 0,
    });
  });

  it("converts null optional fields to undefined", () => {
    const result = mapMediaItem({
      id: "m2",
      media_url: "https://example.com/video.mp4",
      thumbnail_url: null,
      media_type: "video",
      media_width: null,
      media_height: null,
      sort_order: 1,
    });

    expect(result.thumbnailUrl).toBeUndefined();
    expect(result.mediaWidth).toBeUndefined();
    expect(result.mediaHeight).toBeUndefined();
  });
});

describe("mapPost", () => {
  const baseRow = {
    id: "p1",
    user_id: "u1",
    place_id: "pl1",
    type: "photo",
    content: "Great coffee!",
    media_url: "https://example.com/photo.jpg",
    thumbnail_url: "https://example.com/thumb.jpg",
    media_width: 800,
    media_height: 600,
    likes: 5,
    created_at: "2025-01-01T00:00:00Z",
  };

  it("maps basic post fields", () => {
    const result = mapPost(baseRow);

    expect(result.id).toBe("p1");
    expect(result.userId).toBe("u1");
    expect(result.placeId).toBe("pl1");
    expect(result.type).toBe("photo");
    expect(result.content).toBe("Great coffee!");
    expect(result.likes).toBe(5);
    expect(result.createdAt).toBe("2025-01-01T00:00:00Z");
  });

  it("converts null media fields to undefined", () => {
    const result = mapPost({
      ...baseRow,
      media_url: null,
      thumbnail_url: null,
      media_width: null,
      media_height: null,
    });

    expect(result.mediaUrl).toBeUndefined();
    expect(result.thumbnailUrl).toBeUndefined();
    expect(result.mediaWidth).toBeUndefined();
    expect(result.mediaHeight).toBeUndefined();
  });

  it("sets media to undefined when post_media is empty", () => {
    const result = mapPost({ ...baseRow, post_media: [] });
    expect(result.media).toBeUndefined();
  });

  it("maps and sorts post_media by sort_order", () => {
    const result = mapPost({
      ...baseRow,
      post_media: [
        {
          id: "m2",
          media_url: "https://example.com/2.jpg",
          thumbnail_url: null,
          media_type: "photo",
          media_width: null,
          media_height: null,
          sort_order: 2,
        },
        {
          id: "m1",
          media_url: "https://example.com/1.jpg",
          thumbnail_url: null,
          media_type: "photo",
          media_width: null,
          media_height: null,
          sort_order: 1,
        },
      ],
    });

    expect(result.media).toHaveLength(2);
    expect(result.media![0].id).toBe("m1");
    expect(result.media![1].id).toBe("m2");
  });

  it("sets media to undefined when post_media is absent", () => {
    const result = mapPost(baseRow);
    expect(result.media).toBeUndefined();
  });
});

describe("mapEvent", () => {
  it("maps event row with all fields", () => {
    const result = mapEvent({
      id: "e1",
      title: "Jazz Night",
      description: "Live jazz at the bar",
      place_id: "pl1",
      date: "2025-03-01",
      start_time: "19:00",
      end_time: "22:00",
      image_url: "https://example.com/jazz.jpg",
      category: "music",
      ticket_url: "https://tickets.example.com",
      price: 25,
    });

    expect(result).toEqual({
      id: "e1",
      title: "Jazz Night",
      description: "Live jazz at the bar",
      placeId: "pl1",
      date: "2025-03-01",
      startTime: "19:00",
      endTime: "22:00",
      imageUrl: "https://example.com/jazz.jpg",
      category: "music",
      ticketUrl: "https://tickets.example.com",
      price: 25,
    });
  });

  it("converts null optional fields to undefined", () => {
    const result = mapEvent({
      id: "e2",
      title: "Free Gig",
      description: "A free show",
      place_id: "pl2",
      date: "2025-04-01",
      start_time: "20:00",
      end_time: null,
      image_url: null,
      category: "music",
      ticket_url: null,
      price: null,
    });

    expect(result.endTime).toBeUndefined();
    expect(result.imageUrl).toBeUndefined();
    expect(result.ticketUrl).toBeUndefined();
    expect(result.price).toBeNull();
  });
});

describe("mapPlace", () => {
  it("maps place row", () => {
    const result = mapPlace({
      id: "pl1",
      name: "Fidel's Cafe",
      category: "cafe",
      address: "234 Cuba St",
      latitude: -41.2924,
      longitude: 174.7732,
    });

    expect(result).toEqual({
      id: "pl1",
      name: "Fidel's Cafe",
      category: "cafe",
      address: "234 Cuba St",
      latitude: -41.2924,
      longitude: 174.7732,
    });
  });
});

describe("mapTrail", () => {
  it("maps trail with array highlights", () => {
    const result = mapTrail({
      id: "t1",
      name: "Skyline Track",
      description: "A beautiful ridge walk",
      elevation: "450m",
      distance: "12km",
      duration: "4-5 hours",
      difficulty: "moderate",
      highlights: ["Views", "Native bush"],
      place_id: "pl1",
    });

    expect(result.highlights).toEqual(["Views", "Native bush"]);
    expect(result.placeId).toBe("pl1");
    expect(result.difficulty).toBe("moderate");
  });

  it("returns empty array when highlights is not an array", () => {
    const result = mapTrail({
      id: "t2",
      name: "Short Walk",
      description: "Quick loop",
      elevation: "50m",
      distance: "1km",
      duration: "30 min",
      difficulty: "easy",
      highlights: "not-an-array" as unknown,
      place_id: "pl2",
    });

    expect(result.highlights).toEqual([]);
  });
});

describe("mapGuide", () => {
  it("maps guide row with all fields", () => {
    const result = mapGuide({
      id: "g1",
      user_id: "u1",
      title: "Best Cafes",
      description: "Top picks in Wellington",
      cover_image_url: "https://example.com/cover.jpg",
      likes: 10,
      created_at: "2025-01-15T00:00:00Z",
    });

    expect(result).toEqual({
      id: "g1",
      userId: "u1",
      title: "Best Cafes",
      description: "Top picks in Wellington",
      coverImageUrl: "https://example.com/cover.jpg",
      likes: 10,
      createdAt: "2025-01-15T00:00:00Z",
    });
  });

  it("converts null optional fields to undefined", () => {
    const result = mapGuide({
      id: "g2",
      user_id: "u2",
      title: "Hidden Gems",
      description: null,
      cover_image_url: null,
      likes: 0,
      created_at: "2025-02-01T00:00:00Z",
    });

    expect(result.description).toBeUndefined();
    expect(result.coverImageUrl).toBeUndefined();
  });
});

describe("mapGuidePlace", () => {
  const placeData = {
    id: "pl1",
    name: "Fidel's Cafe",
    category: "cafe",
    address: "234 Cuba St",
    latitude: -41.2924,
    longitude: 174.7732,
  };

  it("maps guide place with single place object", () => {
    const result = mapGuidePlace({
      place_id: "pl1",
      sort_order: 0,
      note: "Great vibes",
      places: placeData,
    });

    expect(result.placeId).toBe("pl1");
    expect(result.sortOrder).toBe(0);
    expect(result.note).toBe("Great vibes");
    expect(result.place.name).toBe("Fidel's Cafe");
  });

  it("maps guide place with array of places (takes first)", () => {
    const result = mapGuidePlace({
      place_id: "pl1",
      sort_order: 1,
      note: null,
      places: [placeData],
    });

    expect(result.note).toBeUndefined();
    expect(result.place.id).toBe("pl1");
  });
});

describe("mapProfile", () => {
  it("maps profile row", () => {
    const result = mapProfile({
      id: "u1",
      username: "janej",
      display_name: "Jane J",
      avatar_url: "https://example.com/avatar.jpg",
      bio: "Wellington local",
    });

    expect(result).toEqual({
      id: "u1",
      username: "janej",
      displayName: "Jane J",
      avatarUrl: "https://example.com/avatar.jpg",
      bio: "Wellington local",
    });
  });

  it("converts null bio to undefined", () => {
    const result = mapProfile({
      id: "u2",
      username: "doe",
      display_name: "Doe",
      avatar_url: "https://example.com/avatar2.jpg",
      bio: null,
    });

    expect(result.bio).toBeUndefined();
  });
});
