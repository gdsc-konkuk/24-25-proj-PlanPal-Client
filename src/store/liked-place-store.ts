import { create } from "zustand";

export type LikedPlace = {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  marker?: google.maps.marker.AdvancedMarkerElement;
  isConfirmed: boolean;
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
  setIsConfirmed: (placeId: string, isConfirmed: boolean) => void;
  getIsConfirmed: (placeId: string) => boolean;
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
  setIsConfirmed: (placeId, isConfirmed) =>
    set((state) => ({
      likedPlaces: state.likedPlaces.map((p) =>
        p.placeId === placeId ? { ...p, isConfirmed } : p
      ),
    })),
  getIsConfirmed: (placeId) =>
    get().likedPlaces.find((p) => p.placeId === placeId)?.isConfirmed || false,
}));
