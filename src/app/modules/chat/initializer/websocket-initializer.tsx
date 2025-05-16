"use client";

import { useEffect } from "react";
import { useWebSocketStore } from "@/app/modules/chat/store/websocket-store";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";

interface WebSocketInitializerProps {
  roomId: string;
}

export function WebSocketInitializer({ roomId }: WebSocketInitializerProps) {
  const connect = useWebSocketStore((s) => s.connect);
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) return null;
  const userName = encodeURIComponent(parseJwt(accessToken).name);

  useEffect(() => {
    connect(roomId, userName);
  }, [connect]);

  return null;
}
