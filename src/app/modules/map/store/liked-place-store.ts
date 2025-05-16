import { create } from "zustand";

export enum IconType {
  HEART = "HEART",
  STAR = "STAR",
}

export type LikedPlace = {
  placeId: string;
  name: string;
  marker?: google.maps.marker.AdvancedMarkerElement;
  iconType: IconType;
  rating: number;
  address: string;
  content: string;
  type: string;
  addedBy: string;
  lat: number;
  lng: number;
};

type LikedPlaceStore = {
  likedPlaces: LikedPlace[];
  addPlace: (place: LikedPlace) => void;
  removePlace: (placeId: string) => void;
  isLiked: (placeId: string) => boolean;
  setMarker: (
    placeId: string,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => void;
  getMarker: (
    placeId: string
  ) => google.maps.marker.AdvancedMarkerElement | undefined;
  setIconType: (placeId: string, iconType: IconType) => void;
  getIconType: (placeId: string) => IconType | undefined;
  setLikedPlacesNull: () => void;
};

export const useLikedPlaces = create<LikedPlaceStore>((set, get) => ({
  likedPlaces: [],
  addPlace: (place) =>
    set((state) => ({
      likedPlaces: [...state.likedPlaces, place],
    })),
  removePlace: (placeId) =>
    set((state) => ({
      likedPlaces: state.likedPlaces.filter((p) => p.placeId !== placeId),
    })),
  isLiked: (placeId) => get().likedPlaces.some((p) => p.placeId === placeId),
  setMarker: (placeId, marker) =>
    set((state) => ({
      likedPlaces: state.likedPlaces.map((p) =>
        p.placeId === placeId ? { ...p, marker } : p
      ),
    })),
  getMarker: (placeId) =>
    get().likedPlaces.find((p) => p.placeId === placeId)?.marker,
  setIconType: (placeId, iconType) =>
    set((state) => ({
      likedPlaces: state.likedPlaces.map((p) =>
        p.placeId === placeId ? { ...p, iconType } : p
      ),
    })),
  getIconType: (placeId) =>
    get().likedPlaces.find((p) => p.placeId === placeId)?.iconType,
  setLikedPlacesNull: () =>
    set(() => ({
      likedPlaces: [],
    })),
}));
