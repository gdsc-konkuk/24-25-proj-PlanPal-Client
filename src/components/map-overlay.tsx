"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createCustomOverlay } from "@/lib/create-custom-overlay";
import { HeartIcon, HomeIcon, PhoneIcon, StarIcon, XIcon } from "lucide-react";

type MapOverlayProps = {
  googleMaps: typeof google.maps;
  map: google.maps.Map;
  position: google.maps.LatLng;
  place: google.maps.places.PlaceResult;
  onClose: () => void;
  onLike: () => void;
};

export function MapOverlay({
  googleMaps,
  map,
  position,
  place,
  onClose,
  onLike,
}: MapOverlayProps) {
  useEffect(() => {
    const container = document.createElement("div");
    const root = createRoot(container);

    root.render(
      <div className="bg-white shadow-xl rounded-lg p-4 w-64">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-700">{place.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm mb-1">
          <HomeIcon className="h-5 w-5" />{" "}
          {place.formatted_address || "No address available"}
        </p>
        <p className="text-sm mb-1 flex items-center gap-2">
          <PhoneIcon className="h-5 w-5" />{" "}
          {place.formatted_phone_number || "No phone number"}
        </p>
        <p className="text-sm mb-2 flex items-center gap-2">
          <StarIcon className="h-5 w-5" /> {place.rating || "No rating"}
        </p>
        <a
          href={place.url || "#"}
          target="_blank"
          className="text-sm text-blue-500 underline"
        >
          View on Google Maps
        </a>
        <button
          onClick={onLike}
          className="mt-3 w-full bg-pink-500 text-white py-1 rounded hover:bg-pink-600 flex items-center justify-center gap-2"
        >
          <HeartIcon className="h-5 w-5" />
          <p className="text-lg bold">Like</p>
        </button>
      </div>
    );

    const overlay = createCustomOverlay(googleMaps, position, container, () => {
      setTimeout(() => {
        root.unmount();
      }, 0);
    });

    overlay.setMap(map);

    return () => overlay.setMap(null);
  }, [googleMaps, map, position, place, onClose, onLike]);

  return null;
}
