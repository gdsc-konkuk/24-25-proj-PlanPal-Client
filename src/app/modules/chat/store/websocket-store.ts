import { create } from "zustand";
import { ChatMessage } from "../types";

type WebSocketStore = {
  socket: WebSocket | null;
  chatMessages: ChatMessage[];
  refreshMapTrigger: number;
  refreshScheduleTrigger: number;
  connect: (roomId: string, userName: string) => void;
  sendMessage: (type: "chat" | "aiRequest", msg: string) => void;
  addMessage: (message: ChatMessage) => void;
  requestRefreshMap: () => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  chatMessages: [
    {
      type: "aiResponse",
      text: "Welcome to your group travel planning session! I'm your AI travel assistant. Tell me where you're thinking of going, and I can help with suggestions, cultural insights, and local recommendations. You can also invite friends to join this planning session!",
      senderName: "ai",
      sendAt: new Date().toISOString(),
    },
  ],
  refreshMapTrigger: 0,
  refreshScheduleTrigger: 0,

  connect: (roomId, userName) => {
    if (get().socket) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}?roomId=${roomId}&userName=${userName}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data: ChatMessage = JSON.parse(event.data);
        switch (data.type) {
          case "chat":
          case "aiResponse":
          case "aiRequest":
            set((state) => ({
              chatMessages: [...state.chatMessages, data],
            }));
            break;

          case "refreshMap":
            set((state) => ({
              refreshMapTrigger: state.refreshMapTrigger + 1,
            }));
            break;

          case "refreshSchedule":
            set((state) => ({
              refreshScheduleTrigger: state.refreshScheduleTrigger + 1,
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
      set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          { type: "aiResponse", text: "WebSocket connection closed." },
        ],
      }));
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

  requestRefreshMap: () => {
    const socket = get().socket;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "refreshMap",
        })
      );
    } else {
      console.warn("WebSocket is not open.");
    }
  },
}));
