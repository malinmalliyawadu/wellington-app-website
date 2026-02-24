import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("renders after mount", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows correct aria-label in light mode", () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to dark mode")).toBeDefined();
  });

  it("toggles to dark mode on click", async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    await waitFor(() => {
      expect(screen.getByLabelText("Switch to light mode")).toBeDefined();
    });
  });

  it("toggles back to light mode on second click", async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByLabelText("Switch to light mode")).toBeDefined();
    });
    fireEvent.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
    await waitFor(() => {
      expect(screen.getByLabelText("Switch to dark mode")).toBeDefined();
    });
  });

  it("reads dark class from document on mount", () => {
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);
    expect(screen.getByLabelText("Switch to light mode")).toBeDefined();
  });

  it("writes theme to localStorage on toggle", async () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("theme")).toBe("dark");
    await waitFor(() => {
      expect(screen.getByLabelText("Switch to light mode")).toBeDefined();
    });
    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
