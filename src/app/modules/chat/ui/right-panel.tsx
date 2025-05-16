"use client";

import { useRef, useEffect } from "react";
import { MessageSquare, Send, Info, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "../types";
import { ChatMessageCard } from "./components/chat-message-card";

interface RightPanelProps {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSetIsComposing: (isComposing: boolean) => void;
}

export const RightPanel = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyDown,
  onSetIsComposing,
}: RightPanelProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    const end = messagesEndRef.current;

    if (container && end) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-primary/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            <h2 className="font-medium">Chat</h2>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesContainerRef}
      >
        {messages &&
          messages.map((message, index) =>
            message.senderName ? (
              <ChatMessageCard key={index} message={message} />
            ) : (
              <div
                key={index}
                className="flex items-center justify-center text-sm text-muted-foreground"
              >
                <InfoIcon className="h-4 w-4 mr-1" />
                {message.text}
              </div>
            )
          )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onCompositionStart={() => onSetIsComposing(true)}
            onCompositionEnd={() => onSetIsComposing(false)}
            onKeyDown={onKeyDown}
            placeholder="Type your message or use # for commands..."
            className="flex-1"
          />
          <Button
            onClick={onSendMessage}
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
