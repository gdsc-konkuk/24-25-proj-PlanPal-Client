// src/pages/Chat/components/RightPanel.tsx
import { RefObject } from "react";
import { Info, MessageSquare, Plus, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MessageType } from "../types";

import MessageItem from "./MessageItem";

interface RightPanelProps {
  messages: MessageType[];
  messagesEndRef: RefObject<HTMLDivElement>;
  participants: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  toggleFavorite: (placeId: string) => void;
  toggleConfirmed: (placeId: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  messages,
  messagesEndRef,
  participants,
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  toggleFavorite,
  toggleConfirmed,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-primary/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            <h2 className="font-medium">Chat</h2>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {participants} participants
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            toggleFavorite={toggleFavorite}
            toggleConfirmed={toggleConfirmed}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message or use # for commands..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>Try using #recommend to get AI suggestions</span>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
