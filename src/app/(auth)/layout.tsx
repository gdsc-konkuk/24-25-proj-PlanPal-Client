"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken) {
      toast.error("You need to login first");
      router.replace(`/?from=${pathname}`);
    }
  }, [accessToken]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background text-foreground">
        <LoaderCircle className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (accessToken === null) return null;

  return <>{children}</>;
}
