import { vi } from "vitest";
import { act } from "@testing-library/react";
import { useAuth } from "../../src/store/auth.js";
import type { User } from "../../src/types/user.js";
import * as api from "../../src/api/auth.js";

describe("useAuth store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has initial state", () => {
    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("login success updates state and localStorage", async () => {
    const fakeUser: User = {
      id: "user1",
      name: "Test User",
      email: "test@example.com",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const fakeToken = "abc123";

    vi.spyOn(api, "default").mockResolvedValue({ user: fakeUser, token: fakeToken });

    await act(async () => {
      await useAuth.getState().login("email", "password");
    });

    const state = useAuth.getState();
    expect(state.user).toEqual(fakeUser);
    expect(state.token).toBe(fakeToken);
    expect(state.loading).toBe(false);
    expect(localStorage.getItem("token")).toBe(fakeToken);
    expect(JSON.parse(localStorage.getItem("user")!)).toEqual(fakeUser);
  });


  it("login failure sets error", async () => {
    vi.spyOn(api, "default").mockRejectedValue(new Error("Bad creds"));

    await act(async () => {
      await useAuth.getState().login("email", "password");
    });

    const state = useAuth.getState();
    expect(state.error).toBe("Bad creds");
    expect(state.loading).toBe(false);
  });

  it("logout clears state and localStorage", () => {
    const fakeUser: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAuth.setState({ user: fakeUser, token: "abc", loading: false, error: null });
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", JSON.stringify(fakeUser));

    act(() => {
      useAuth.getState().logout();
    });

    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("restore loads from localStorage", () => {
    const fakeUser: User = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", JSON.stringify(fakeUser));

    act(() => {
      useAuth.getState().restore();
    });

    const state = useAuth.getState();
    expect(state.user).toEqual(fakeUser);
    expect(state.token).toBe("abc");
    expect(state.loading).toBe(false);
  });

  it("restore handles bad JSON", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", "{bad json");

    act(() => {
      useAuth.getState().restore();
    });

    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(false);
  });
});