"use client";

import { format } from "date-fns";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageType } from "../../types";

interface ChatMessageProps {
  message: MessageType;
  onToggleConfirmed?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const ChatMessage = ({ message, onToggleConfirmed, onToggleFavorite }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.sender.id === "user1" ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`flex ${message.sender.id === "user1" ? "flex-row-reverse" : "flex-row"
          } items-start gap-2 max-w-[90%]`}
      >
        <Avatar className="h-8 w-8 mt-1">
          {message.sender.avatar ? (
            <AvatarImage
              src={message.sender.avatar}
              alt={message.sender.name}
            />
          ) : (
            <AvatarFallback
              className={
                message.isAI
                  ? "bg-secondary/30 text-secondary-foreground"
                  : "bg-accent/30 text-accent-foreground"
              }
            >
              {message.isAI ? (
                <Bot className="h-4 w-4" />
              ) : (
                message.sender.name.charAt(0)
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {message.sender.name}
            </span>
            <span className="text-xs text-foreground/50">
              {format(message.timestamp, "HH:mm")}
            </span>
          </div>
          <Card
            className={`${message.isAI ? "bg-secondary/20 border-secondary/30" : ""
              }`}
          >
            <CardContent className="p-3 text-sm">
              {message.content}

              {/* Place Info Card */}
              {message.containsPlace && message.placeInfo && (
                <div className="mt-2 p-2 bg-background rounded-md border border-primary/20">
                  <div className="flex items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">
                        {message.placeInfo.name}
                      </h4>
                      {message.placeInfo.address && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.placeInfo.address}
                        </p>
                      )}
                      {message.placeInfo.description && (
                        <p className="text-xs mt-1">
                          {message.placeInfo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => onToggleConfirmed?.(message.placeInfo!.id)}
                        >
                          {message.placeInfo.isConfirmed
                            ? "Remove"
                            : "Add to Itinerary"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => onToggleFavorite?.(message.placeInfo!.id)}
                        >
                          {message.placeInfo.isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
