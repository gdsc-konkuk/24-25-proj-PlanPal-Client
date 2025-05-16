"use client";

import { oauthRequest } from "@/app/modules/auth/api/oauth";
import { useAuthStore } from "@/store/auth-store";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function GoogleAuth() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (code) {
        try {
          setIsLoading(true);
          const accessToken = await oauthRequest(code);
          useAuthStore.setState({ accessToken });
          toast.success("Login successful");
        } catch (error) {
          toast.error(`error : ${(error as Error).message}`);
          setError(`error : ${(error as Error).message}`);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAccessToken();
    router.push("/");
  }, [code, router]);

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

export default function GoogleAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleAuth />
    </Suspense>
  );
}
