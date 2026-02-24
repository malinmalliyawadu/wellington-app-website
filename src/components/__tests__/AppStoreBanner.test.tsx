import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppStoreBanner } from "../AppStoreBanner";
import { APP_STORE_URL } from "@/lib/constants";

describe("AppStoreBanner", () => {
  it("renders download link with correct URL", () => {
    render(<AppStoreBanner />);
    const link = screen.getByRole("link", { name: /download the app/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe(APP_STORE_URL);
  });

  it("renders expected text content", () => {
    render(<AppStoreBanner />);
    expect(screen.getByText("Welly")).toBeDefined();
    expect(screen.getByText("Discover Wellington with")).toBeDefined();
  });
});
