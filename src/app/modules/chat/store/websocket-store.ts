import { create } from "zustand";
import { ChatMessage } from "../types";

type WebSocketStore = {
  socket: WebSocket | null;
  chatMessages: ChatMessage[];
  refreshMapTrigger: number;
  connect: (roomId: string, userName: string) => void;
  sendMessage: (type: "chat" | "ai", msg: string) => void;
  addMessage: (message: ChatMessage) => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  chatMessages: [],
  refreshMapTrigger: 0,

  connect: (roomId, userName) => {
    if (get().socket) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/ws/chat?roomId=${roomId}&userName=${userName}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data);
        switch (data.type) {
          case "chat":
          case "ai":
            set((state) => ({
              chatMessages: [...state.chatMessages, data],
            }));
            break;

          case "refresh":
            set((state) => ({
              refreshMapTrigger: state.refreshMapTrigger + 1,
            }));
            break;

          default:
            console.warn("Unrecognized message type:", data.type);
        }
      } catch (err) {
        console.error("Invalid WebSocket message:", event.data);
      }
    };

    socket.onerror = (e) => console.error("WebSocket error", e);

    socket.onclose = () => {
      console.warn("WebSocket closed");
      set({ socket: null });
    };

    set({ socket });
  },

  sendMessage: (type, msg) => {
    const socket = get().socket;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type,
          text: msg,
        })
      );
    } else {
      console.warn("WebSocket is not open.");
    }
  },

  addMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
}));
