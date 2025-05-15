"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { joinChatRoom } from "@/app/modules/chat/api/chat-room";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inviteCode = searchParams.get("code");

    if (!inviteCode) {
      toast.error("Invalid invitation link. No invite code provided.");
      router.push("/dashboard");
      return;
    }

    const joinRoom = async () => {
      try {
        await joinChatRoom(inviteCode);
        toast.success("Successfully joined the trip!");
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to join chat room:", err);
        toast.error("Failed to join the trip. The invite code may be invalid or expired.");
        router.push("/dashboard");
      }
    };

    joinRoom();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Joining trip...</h2>
        <p className="text-muted-foreground">Please wait while we process your invitation</p>
      </div>
    );
  }

  return null;
}
