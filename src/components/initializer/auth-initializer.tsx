"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export function AuthInitializer() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const router = useRouter();

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

        if (!res.ok) router.push("/");

        const { accessToken } = await res.json();
        setAccessToken(accessToken);
      } catch {
        setAccessToken(null);
      } finally {
        setInitialized(true);
      }
    };

    fetchAccessToken();
  }, []);

  return null;
}
