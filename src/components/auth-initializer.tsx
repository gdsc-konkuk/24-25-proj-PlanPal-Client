"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthInitializer() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Not logged in");

        const { accessToken } = await res.json();
        setAccessToken(accessToken);
      } catch {
        setAccessToken(null);
      }
    };

    fetchAccessToken();
  }, []);

  return null;
}
