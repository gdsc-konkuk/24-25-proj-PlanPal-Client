"use client";

import { fetchAuth } from "@/lib/fetch-auth";
import { toast } from "sonner";

// Regular utility function (not a hook)
export const api = async <T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  try {
    const res = await fetchAuth(input, init, {
      onAuthFail: () => {
        toast.error("Session expired. Please log in again.");
        // Instead of using router.push, we'll use window.location
        window.location.href = "/";
      },
    });

    if (!res.ok) {
      toast.error("An error occurred. Please try again later.");
      throw new Error(`API request fail: ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export function useApi() {
  // This can be used inside React components if needed
  return api;
}
