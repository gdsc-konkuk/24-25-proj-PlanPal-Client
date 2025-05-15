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
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

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
  // 패널 가시성 상태 계산
  const visiblePanelCount = [
    leftPanelVisible,
    middlePanelVisible,
    rightPanelVisible
  ].filter(Boolean).length;

  // 사용자 정보
  const currentUser = useAuthStore((state) => state.userName);
  const avatarText = currentUser ? currentUser.charAt(0) : "U";

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
          <span className="text-sm text-foreground/70 ml-2">
            ID: {travelId}
          </span>
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
            <EyeOffIcon className="h-3 w-3" />
          ) : (
            <EyeIcon className="h-3 w-3" />
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
            <EyeOffIcon className="h-3 w-3" />
          ) : (
            <EyeIcon className="h-3 w-3" />
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
            <EyeOffIcon className="h-3 w-3" />
          ) : (
            <EyeIcon className="h-3 w-3" />
          )}
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback className="bg-accent/30 text-accent-foreground">
            {avatarText}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}