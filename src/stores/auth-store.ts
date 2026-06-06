import { create } from "zustand";
import { loginUser } from "@/api/auth";
import type { LoginRequest, User } from "@/types/auth";

const TOKEN_KEY = "preproute_token";
const USER_KEY = "preproute_user";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    let user: User | null = null;

    if (userRaw) {
      try {
        user = JSON.parse(userRaw) as User;
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    set({
      token,
      user,
      isAuthenticated: Boolean(token),
      isHydrated: true,
    });
  },

  login: async (credentials) => {
    const response = await loginUser(credentials);

    if (response.status !== "success" || !response.data?.token) {
      throw new Error(response.message ?? "Login failed");
    }

    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));

    set({
      token: response.data.token,
      user: response.data.user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
