"use client";

import { format } from "date-fns";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "../../types";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatMessageCardProps {
  message: ChatMessage;
}

export const ChatMessageCard = ({ message }: ChatMessageCardProps) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) return null;
  const currentUserName = parseJwt(accessToken).name;
  const currentUserImageUrl = parseJwt(accessToken).imageUrl;
  const sendAt = new Date(message.sendAt!);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex ${cn(
        message.senderName === currentUserName ? "justify-end" : "justify-start"
      )}`}
    >
      <div
        className={`flex ${cn(
          message.senderName === currentUserName
            ? "flex-row-reverse"
            : "flex-row"
        )} items-start gap-2 max-w-[90%] relative`}
      >
        <Avatar
          className="h-8 w-8 mt-1 hover:cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {message.type === "chat" || message.type === "aiRequest" ? (
            <AvatarImage
              src={
                message.senderName === currentUserName
                  ? currentUserImageUrl
                  : message.imgUrl
              }
              alt="User Avatar"
              className="h-8 w-8"
            />
          ) : (
            <AvatarFallback
              className={
                message.type === "aiResponse"
                  ? "bg-secondary/30 text-secondary-foreground"
                  : "bg-accent/30 text-accent-foreground"
              }
            >
              {message.type === "aiResponse" ? (
                <Bot className="h-4 w-4" />
              ) : (
                message.senderName!.charAt(0)
              )}
            </AvatarFallback>
          )}
        </Avatar>
        {hovered && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded-md shadow text-xs text-white max-w-[100px] truncate">
            {message.senderName}
          </div>
        )}
        <div>
          {sendAt && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-foreground/50">
                {format(sendAt, "HH:mm")}
              </span>
            </div>
          )}
          <Card
            className={`${cn(
              message.type === "aiResponse"
                ? "bg-blue-400 border-secondary/30"
                : message.type === "aiRequest"
                ? "bg-yellow-200 border-accent/30"
                : ""
            )}`}
          >
            <CardContent className="p-3 text-sm">{message.text}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
