import { describe, it, expect, vi } from "vitest";
import loginRequest from "../../src/api/auth.js";
import * as client from "../../src/api/client.js";

describe("loginRequest", () => {
  it("calls api with correct payload", async () => {
    const mockApi = vi.spyOn(client, "default").mockResolvedValue({ token: "abc" });

    const result = await loginRequest("user@example.com", "secret");

    expect(mockApi).toHaveBeenCalledWith("/users/login", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com", password: "secret" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual({ token: "abc" });
  });
});