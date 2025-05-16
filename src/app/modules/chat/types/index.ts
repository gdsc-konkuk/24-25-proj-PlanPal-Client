type ScheduleItem = {
  id: string;
  placeId: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: "식사" | "관광" | "숙박" | "이동" | "기타";
  description?: string;
  color?: string;
};

export type PlacesTabType = "confirmed" | "candidates";

export type EventDataType = Omit<ScheduleItem, "id" | "color">;

// The existing PlaceType from middle-panel.tsx can also be moved here
export type PlaceType = "식사" | "관광" | "숙박" | "이동" | "기타";

// API response type for chat rooms list
export interface ChatRoom {
  id: number;
  name: string;
  limitUsers: number;
  destination: string;
  thumbnailUrl: string;
}

export interface ChatRoomCreateRequest {
  name: string;
  limitUsers: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  destination?: string;
  thumbnailUrl?: string;
}

export interface ChatRoomResponse {
  id: number;
  name: string;
  inviteCode: string;
  limitUsers: number;
  destination: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface ChatMessage {
  type: "chat" | "ai" | "refresh";
  senderName?: string;
  text?: string;
  sendAt?: string;
}
