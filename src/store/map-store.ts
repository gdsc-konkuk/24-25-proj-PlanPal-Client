import { create } from "zustand";

interface MapStore {
  map: google.maps.Map | null;
  googleMaps: typeof google.maps | null;
  setMap: (map: google.maps.Map | null) => void;
  setGoogleMaps: (maps: typeof google.maps | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  googleMaps: null,
  setMap: (map) => set({ map }),
  setGoogleMaps: (maps) => set({ googleMaps: maps }),
}));
