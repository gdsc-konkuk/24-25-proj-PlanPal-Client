// src/pages/Dashboard/types.ts
import { DateRange } from "react-day-picker";

export type TravelRoom = {
  id: string;
  name: string;
  destination: {
    country: string;
    region: string;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
  coverImage: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage: {
    sender: string;
    content: string;
    timestamp: Date;
  };
};

export type Destination = {
  id: string;
  country: string;
  region: string;
};

export type CreateTravelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type BasicInfoTabProps = {
  newTravelName: string;
  setNewTravelName: (name: string) => void;
  newTravelParticipants: number;
  setNewTravelParticipants: (participants: number) => void;
  destinations: Destination[];
  setDestinations: (destinations: Destination[]) => void;
  newCountry: string;
  setNewCountry: (country: string) => void;
  newRegion: string;
  setNewRegion: (region: string) => void;
  newTravelDate: DateRange | undefined;
  setNewTravelDate: (date: DateRange | undefined) => void;
  newTravelDescription: string;
  setNewTravelDescription: (description: string) => void;
  coverImageType: "ai" | "upload";
  setCoverImageType: (type: "ai" | "upload") => void;
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
  onClose: () => void;
  onNext: () => void;
};

export type InviteTabProps = {
  newTravelName: string;
  newTravelParticipants: number;
  destinations: Destination[];
  newTravelDate: DateRange | undefined;
  newTravelDescription: string;
  coverImageUrl: string;
  inviteLink: string;
  linkCopied: boolean;
  onCopyInviteLink: () => void;
  onBack: () => void;
  onStartTravel: () => void;
};

export type TravelRoomCardProps = {
  room: TravelRoom;
  onEnterChatRoom: (roomId: string) => void;
};
