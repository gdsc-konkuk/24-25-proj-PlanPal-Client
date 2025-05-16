"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ArrowLeft,
  MapIcon,
  ListIcon,
  MessageCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Clipboard,
  LinkIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/use-api";

interface ChatHeaderProps {
  travelId: string | null;
  leftPanelVisible: boolean;
  middlePanelVisible: boolean;
  rightPanelVisible: boolean;
  onToggleLeftPanel: () => void;
  onToggleMiddlePanel: () => void;
  onToggleRightPanel: () => void;
}

export function ChatHeader({
  travelId,
  leftPanelVisible,
  middlePanelVisible,
  rightPanelVisible,
  onToggleLeftPanel,
  onToggleMiddlePanel,
  onToggleRightPanel,
}: ChatHeaderProps) {
  // Add state for invite code
  const [inviteCode, setInviteCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const api = useApi();

  // Fetch invite code when travelId changes
  useEffect(() => {
    const fetchInviteCode = async () => {
      if (travelId) {
        setIsLoading(true);
        const chatRoomId = parseInt(travelId, 10);

        if (!isNaN(chatRoomId)) {
          try {
            const inviteCode = await api<string>(
              `/chat-rooms/${chatRoomId}/invite}`
            );
            setInviteCode(inviteCode);
          } catch (error) {
            console.error("Failed to fetch invite code:", error);
            toast.error("Failed to load invite code");
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    fetchInviteCode();
  }, [travelId]);

  // 패널 가시성 상태 계산
  const visiblePanelCount = [
    leftPanelVisible,
    middlePanelVisible,
    rightPanelVisible,
  ].filter(Boolean).length;

  // 사용자 정보
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = accessToken ? parseJwt(accessToken).name : "User";
  const userImage = accessToken
    ? parseJwt(accessToken).imageUrl
    : "/placeholder.svg";

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-primary/10 h-14 flex items-center px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Logo size="sm" />
        {travelId && (
          <>
            <span className="text-sm text-foreground/70 ml-2">
              ID: {travelId}
            </span>
          </>
        )}

        {travelId && inviteCode && (
          <div className="flex items-center ml-2">
            {/* <LinkIcon className="h-4 w-4 text-foreground/70 mr-2 shrink-0" /> */}
            <Button
              variant="outline"
              size="sm"
              className="ml-2 flex items-center gap-1"
              disabled={isLoading}
              onClick={() => {
                // Generate the invite link
                const inviteLink = `${window.location.origin}/dashboard/invite?code=${inviteCode}`;

                // Copy to clipboard
                navigator.clipboard
                  .writeText(inviteLink)
                  .then(() => {
                    // Show toast notification
                    toast.success("Invitation link copied to clipboard!");
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                    toast.error("Failed to copy link");
                  });
              }}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* 각 패널 토글 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLeftPanel}
          className="flex items-center gap-1"
          disabled={visiblePanelCount === 1 && leftPanelVisible}
        >
          <MapIcon className="h-4 w-4" />
          {leftPanelVisible ? (
            <EyeIcon className="h-3 w-3" />
          ) : (
            <EyeOffIcon className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMiddlePanel}
          className="flex items-center gap-1"
          disabled={visiblePanelCount === 1 && middlePanelVisible}
        >
          <ListIcon className="h-4 w-4" />
          {middlePanelVisible ? (
            <EyeIcon className="h-3 w-3" />
          ) : (
            <EyeOffIcon className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleRightPanel}
          className="flex items-center gap-1"
          disabled={visiblePanelCount === 1 && rightPanelVisible}
        >
          <MessageCircleIcon className="h-4 w-4" />
          {rightPanelVisible ? (
            <EyeIcon className="h-3 w-3" />
          ) : (
            <EyeOffIcon className="h-3 w-3" />
          )}
        </Button>
        <Button className="h-8 w-fit">{currentUser}</Button>
      </div>
    </header>
  );
}
