export type MessageType = {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isAI: boolean;
  containsPlace?: boolean;
  placeInfo?: PlaceInfo;
};

export type ParticipantType = {
  id: string;
  name: string;
  avatar?: string;
  isAI: boolean;
  isOnline: boolean;
};

export type PlaceInfo = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  category?: string;
  rating?: number;
  isFavorite: boolean;
  isConfirmed: boolean;
  addedBy?: string;
  addedAt?: Date;
  visitTime?: Date;
  duration?: number; // 방문 예상 시간(분)
  type?: "Food" | "Tour" | "Stay" | "Move" | "Etc";
};

type ScheduleItem = {
  id: string;
  placeId: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: "Food" | "Tour" | "Stay" | "Move" | "Etc";
  description?: string;
  color?: string;
};

export type PlacesTabType = "confirmed" | "candidates";

export type EventDataType = Omit<ScheduleItem, "id" | "color">;

// The existing PlaceType from middle-panel.tsx can also be moved here
export type PlaceType = "Food" | "Tour" | "Stay" | "Move" | "Etc";

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
  type: "chat" | "aiRequest" | "aiResponse" | "refreshMap" | "refreshSchedule";
  senderName?: string;
  text?: string;
  sendAt?: string;
  imgUrl?: string;
}
