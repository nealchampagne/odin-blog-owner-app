import { create } from "zustand";
import type { User } from "../types/user";
import type { LoginResponse } from "../types/auth";
import loginRequest from "../api/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restore: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const { user, token }: LoginResponse = await loginRequest(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      
        set({
        loading: false,
        error: message
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  restore: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        token,
        user: JSON.parse(user)
      });
    }
  }
}));
