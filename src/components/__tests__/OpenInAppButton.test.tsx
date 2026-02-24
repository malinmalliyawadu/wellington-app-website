import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OpenInAppButton } from "../OpenInAppButton";

describe("OpenInAppButton", () => {
  it("renders button with 'Open in Welly' text", () => {
    render(<OpenInAppButton deepLink="wellington:///feed/post/123" />);
    const button = screen.getByRole("button", { name: /open in welly/i });
    expect(button).toBeDefined();
  });

  it("navigates to deep link on click", () => {
    const deepLink = "wellington:///feed/post/123";

    // Track assignments to window.location.href
    const assigned: string[] = [];
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost"),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window.location, "href", {
      set(value: string) {
        assigned.push(value);
      },
      get() {
        return "http://localhost";
      },
      configurable: true,
    });

    render(<OpenInAppButton deepLink={deepLink} />);
    fireEvent.click(screen.getByRole("button", { name: /open in welly/i }));
    expect(assigned[0]).toBe(deepLink);
  });
});
