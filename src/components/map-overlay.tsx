"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createCustomOverlay } from "@/lib/create-custom-overlay";
import { HeartIcon, HomeIcon, PhoneIcon, StarIcon, XIcon } from "lucide-react";
import { IconType, useLikedPlaces } from "@/store/liked-place-store";
import { useMapStore } from "@/store/map-store";

type MapOverlayProps = {
  position: google.maps.LatLng;
  placeInfo: {
    place: google.maps.places.PlaceResult;
    position: google.maps.LatLng;
    placeId: string;
  } | null;
  onClose: () => void;
};

export function MapOverlay({ position, placeInfo, onClose }: MapOverlayProps) {
  const { addPlace, removePlace, isLiked, setMarker, getMarker } =
    useLikedPlaces();
  const liked = isLiked(placeInfo!.placeId);
  const map = useMapStore((state) => state.map);
  const googleMaps = useMapStore((state) => state.googleMaps);

  const handleLikeToggle = () => {
    if (!map || !googleMaps || !placeInfo) return;
    if (liked) {
      const marker = getMarker(placeInfo.placeId);
      if (marker) marker.map = null;
      removePlace(placeInfo.placeId);
    } else {
      addPlace({
        placeId: placeInfo.placeId,
        name: placeInfo.place.name || "Unknown",
        lat: position.lat(),
        lng: position.lng(),
        iconType: IconType.HEART,
      });

      const img = document.createElement("img");
      img.src = "/heart.png";
      img.style.width = "36px";
      img.style.height = "36px";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: placeInfo.position,
        content: img,
        title: placeInfo.place.name || "Unknown",
      });

      setMarker(placeInfo.placeId, marker);
    }
    onClose();
  };

  useEffect(() => {
    const container = document.createElement("div");
    const root = createRoot(container);
    if (!placeInfo) return;

    root.render(
      <div className="bg-white shadow-xl rounded-lg p-4 w-64">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-700">
            {placeInfo.place.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm mb-1">
          <HomeIcon className="h-5 w-5" />{" "}
          {placeInfo.place.formatted_address || "No address available"}
        </p>
        <p className="text-sm mb-1 flex items-center gap-2">
          <PhoneIcon className="h-5 w-5" />{" "}
          {placeInfo.place.formatted_phone_number || "No phone number"}
        </p>
        <p className="text-sm mb-2 flex items-center gap-2">
          <StarIcon className="h-5 w-5" />{" "}
          {placeInfo.place.rating || "No rating"}
        </p>
        <a
          href={placeInfo!.place.url || "#"}
          target="_blank"
          className="text-sm text-blue-500 underline"
        >
          View on Google Maps
        </a>
        <button
          onClick={handleLikeToggle}
          className={`mt-3 w-full py-1 rounded flex items-center justify-center gap-2 ${
            liked
              ? "bg-gray-300 text-black hover:bg-gray-400"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
        >
          <HeartIcon className="h-5 w-5" />
          <p className="text-lg bold">{liked ? "UnLike" : "Like"}</p>
        </button>
      </div>
    );

    const overlay = createCustomOverlay(
      googleMaps!,
      position,
      container,
      () => {
        setTimeout(() => {
          root.unmount();
        }, 0);
      }
    );

    overlay.setMap(map);

    return () => overlay.setMap(null);
  }, [googleMaps, map, position, placeInfo, onClose]);

  return null;
}
