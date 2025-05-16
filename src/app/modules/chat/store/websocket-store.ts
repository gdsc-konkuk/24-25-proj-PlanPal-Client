import { create } from "zustand";

type WebSocketStore = {
  socket: WebSocket | null;
  chatMessages: string[];
  refreshMapTrigger: number;
  connect: (roomId: string, userName: string) => void;
  sendMessage: (type: "chat" | "ai", msg: string) => void;
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
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "chat":
            set((state) => ({
              chatMessages: [...state.chatMessages, data.text],
            }));
            break;

          case "refreshMap":
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
}));
