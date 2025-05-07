import { parseJwt } from "@/lib/parseJwt";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null | undefined;
  isInitialized: boolean;
  userEmail: string;
  userName: string;
  setAccessToken: (token: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitialized: false,
  userEmail: "",
  userName: "",
  setAccessToken: (token) =>
    set({
      accessToken: token,
      userEmail: parseJwt(token || "").email,
      userName: parseJwt(token || "").name,
    }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));
