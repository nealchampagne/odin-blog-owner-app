import { describe, it, expect, vi } from "vitest";
import { getDashboardStats } from "../../src/api/admin.js";
import * as client from "../../src/api/client.js";

describe("getDashboardStats", () => {
  it("calls api with correct endpoint and method", async () => {
    const mockApi = vi.spyOn(client, "default").mockResolvedValue({
      totalPosts: 10,
      draftPosts: 2,
      publishedPosts: 8,
      totalComments: 5,
      totalUsers: 3,
    });

    const result = await getDashboardStats();

    expect(mockApi).toHaveBeenCalledWith("/posts/stats", { method: "GET" });
    expect(result.totalPosts).toBe(10);
    expect(result.publishedPosts).toBe(8);
  });

  it("propagates errors from api", async () => {
    vi.spyOn(client, "default").mockRejectedValue(new Error("Network error"));
    await expect(getDashboardStats()).rejects.toThrow("Network error");
  });
});