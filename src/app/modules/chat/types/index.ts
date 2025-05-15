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
  type?: "식사" | "관광" | "숙박" | "이동" | "기타";
};

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
