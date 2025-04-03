// src/pages/Chat/components/ChatHeader.tsx
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  ListIcon,
  MapIcon,
  MessageCircleIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  travelId: string | null;
  toggleLeftPanel: () => void;
  toggleMiddlePanel: () => void;
  toggleRightPanel: () => void;
  leftPanelVisible: boolean;
  middlePanelVisible: boolean;
  rightPanelVisible: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  travelId,
  toggleLeftPanel,
  toggleMiddlePanel,
  toggleRightPanel,
  leftPanelVisible,
  middlePanelVisible,
  rightPanelVisible,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-primary/10 h-14 flex items-center px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Link to="/dashboard">
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
          onClick={toggleLeftPanel}
          className="flex items-center gap-1"
          disabled={
            [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
              Boolean,
            ).length === 1 && leftPanelVisible
          }
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
          onClick={toggleMiddlePanel}
          className="flex items-center gap-1"
          disabled={
            [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
              Boolean,
            ).length === 1 && middlePanelVisible
          }
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
          onClick={toggleRightPanel}
          className="flex items-center gap-1"
          disabled={
            [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
              Boolean,
            ).length === 1 && rightPanelVisible
          }
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
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default ChatHeader;
