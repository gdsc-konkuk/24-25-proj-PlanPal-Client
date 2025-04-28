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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (accessToken === null) {
      router.replace(`/?from=${pathname}`);
    }
    toast.error("You need to login first");
  }, [accessToken]);

  if (accessToken === undefined) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background text-foreground">
        <LoaderCircle className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
