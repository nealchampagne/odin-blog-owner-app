import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "../../src/pages/Dashboard.tsx";
import * as adminApi from "../../src/api/admin.js";

describe("Dashboard page", () => {
  it("shows loading state initially", () => {
    // Mock a promise that never resolves immediately
    vi.spyOn(adminApi, "getDashboardStats").mockImplementation(
      () => new Promise(() => {})
    );

    render(<Dashboard />);
    expect(screen.getByText(/loading…/i)).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    vi.spyOn(adminApi, "getDashboardStats").mockRejectedValue(
      new Error("Network error")
    );

    render(<Dashboard />);
    expect(await screen.findByText(/failed to load dashboard stats/i))
      .toBeInTheDocument();
  });

  it("renders stats when API succeeds", async () => {
    vi.spyOn(adminApi, "getDashboardStats").mockResolvedValue({
      totalPosts: 10,
      draftPosts: 2,
      publishedPosts: 8,
      totalComments: 5,
      totalUsers: 3,
    });

    render(<Dashboard />);

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(await screen.findByText(/total posts/i)).toBeInTheDocument();
    expect(await screen.findByText("10")).toBeInTheDocument();
    expect(await screen.findByText(/users/i)).toBeInTheDocument();
    expect(await screen.findByText("3")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\+ create post/i }))
      .toHaveAttribute("href", "/posts/new");
  });
});