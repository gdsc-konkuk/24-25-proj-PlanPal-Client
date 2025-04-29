import { create } from "zustand";

interface AuthState {
  accessToken: string | null | undefined;
  isInitialized: boolean;
  setAccessToken: (token: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitialized: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));
