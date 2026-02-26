import { describe, it, expect } from "vitest";
import {
  getDeepLink,
  getPostDeepLink,
  getEventDeepLink,
  getPlaceDeepLink,
  getUserDeepLink,
  getTrailDeepLink,
  getGuideDeepLink,
  DEEP_LINK_SCHEME,
  APP_STORE_ID,
  APP_STORE_URL,
} from "../constants";

describe("APP_STORE_ID", () => {
  it("equals the known App Store ID", () => {
    expect(APP_STORE_ID).toBe("6758979767");
  });

  it("is included in APP_STORE_URL", () => {
    expect(APP_STORE_URL).toContain(APP_STORE_ID);
  });
});

describe("getDeepLink", () => {
  it("prefixes path with deep link scheme and slash", () => {
    expect(getDeepLink("some/path")).toBe(`${DEEP_LINK_SCHEME}/some/path`);
  });

  it("handles empty path", () => {
    expect(getDeepLink("")).toBe(`${DEEP_LINK_SCHEME}/`);
  });
});

describe("getPostDeepLink", () => {
  it("returns deep link for a post", () => {
    expect(getPostDeepLink("abc-123")).toBe("wellington:///feed/post/abc-123");
  });
});

describe("getEventDeepLink", () => {
  it("returns deep link for an event", () => {
    expect(getEventDeepLink("evt-1")).toBe("wellington:///events/evt-1");
  });
});

describe("getPlaceDeepLink", () => {
  it("returns deep link for a place", () => {
    expect(getPlaceDeepLink("place-1")).toBe("wellington:///feed/place/place-1");
  });
});

describe("getUserDeepLink", () => {
  it("returns deep link for a user", () => {
    expect(getUserDeepLink("user-1")).toBe("wellington:///feed/user/user-1");
  });
});

describe("getTrailDeepLink", () => {
  it("returns deep link for a trail", () => {
    expect(getTrailDeepLink("trail-1")).toBe("wellington:///map/trail/trail-1");
  });
});

describe("getGuideDeepLink", () => {
  it("returns deep link for a guide", () => {
    expect(getGuideDeepLink("guide-1")).toBe("wellington:///feed/guide/guide-1");
  });
});
