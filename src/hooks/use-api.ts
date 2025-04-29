"use client";

import { useRouter } from "next/navigation";
import { fetchAuth } from "@/lib/fetch-auth";

export function useApi() {
  const router = useRouter();

  return async <T = any>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<T> => {
    const res = await fetchAuth(input, init, {
      onAuthFail: () => {
        router.push("/");
      },
    });

    if (!res.ok) {
      throw new Error(`API request fail: ${res.status}`);
    }

    return res.json() as Promise<T>;
  };
}
