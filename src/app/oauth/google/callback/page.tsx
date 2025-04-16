"use client";

import { oauthRequest } from "@/app/modules/auth/actions/oauth";
import { useAuthStore } from "@/store/auth-store";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  let accessToken = null;
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (code) {
        try {
          accessToken = await oauthRequest(code);
          useAuthStore.setState({ accessToken });
        } catch (error) {
          setError(`error : ${(error as Error).message}`);
        }
      }
    };

    fetchAccessToken();
    router.push("/");
  }, [code]);

  if (code)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1>Loading...</h1>
        {error && (
          <div className="text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    );
}
