import { useAuthStore } from "@/store/auth-store";

type FetchWithAuthOptions = {
  onAuthFail?: () => void;
};

export async function fetchAuth(
  input: RequestInfo,
  init: RequestInit = {},
  options?: FetchWithAuthOptions
): Promise<Response> {
  const { accessToken, setAccessToken } = useAuthStore.getState();

  const authInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let res = await fetch(input, authInit);

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshRes.ok) throw new Error("Failed to refresh token");

      const { accessToken: newAccessToken } = await refreshRes.json();
      setAccessToken(newAccessToken);

      const retryInit: RequestInit = {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      res = await fetch(input, retryInit);
    } catch (err) {
      console.error("Refresh failed, logging out", err);

      setAccessToken(null);
      options?.onAuthFail?.();
    }
  }

  return res;
}
