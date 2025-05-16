"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createCustomOverlay } from "@/app/modules/map/lib/create-custom-overlay";
import { HeartIcon, HomeIcon, PhoneIcon, StarIcon, XIcon } from "lucide-react";
import {
  IconType,
  useLikedPlaces,
} from "@/app/modules/map/store/liked-place-store";
import { useMapStore } from "@/app/modules/map/store/map-store";
import { useApi } from "@/hooks/use-api";
import { useWebSocketStore } from "@/app/modules/chat/store/websocket-store";

type MapOverlayProps = {
  position: google.maps.LatLng;
  placeInfo: {
    place: google.maps.places.PlaceResult;
    position: google.maps.LatLng;
    placeId: string;
  } | null;
  onClose: () => void;
  chatRoomId: string;
  currentUserName: string;
};

export function MapOverlay({
  position,
  placeInfo,
  onClose,
  chatRoomId,
  currentUserName,
}: MapOverlayProps) {
  const { addPlace, removePlace, isLiked, setMarker, getMarker } =
    useLikedPlaces();
  const liked = isLiked(placeInfo!.placeId);
  const map = useMapStore((state) => state.map);
  const googleMaps = useMapStore((state) => state.googleMaps);
  const requestRefreshMap = useWebSocketStore(
    (state) => state.requestRefreshMap
  );

  const api = useApi();

  const handleLikeToggle = async () => {
    if (!map || !googleMaps || !placeInfo) return;
    if (liked) {
      const marker = getMarker(placeInfo.placeId);
      if (marker) marker.map = null;
      removePlace(placeInfo.placeId);

      try {
        await api(`/maps/${chatRoomId}/pins/${placeInfo.placeId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete place:", error);
      }
    } else {
      addPlace({
        placeId: placeInfo.placeId,
        name: placeInfo.place.name || "Unknown",
        iconType: IconType.HEART,
        rating: placeInfo.place.rating || 0,
        address: placeInfo.place.formatted_address || "No address",
        content: placeInfo.place.formatted_phone_number || "No phone number",
        type: placeInfo.place.types?.[0] || "Unknown",
        addedBy: currentUserName,
        lat: placeInfo.position.lat(),
        lng: placeInfo.position.lng(),
      });

      try {
        await api(`/maps/${chatRoomId}/pins`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: placeInfo.place.name || "Unknown",
            address: placeInfo.place.formatted_address || "No address",
            content:
              placeInfo.place.formatted_phone_number || "No phone number",
            type: placeInfo.place.types?.[0] || "Unknown",
            rating: placeInfo.place.rating || 0,
            iconType: IconType.HEART,
            placeId: placeInfo.placeId || "Unknown",
            lat: placeInfo.position.lat() || 0,
            lng: placeInfo.position.lng() || 0,
          }),
        });
      } catch (error) {
        console.error("Failed to save place:", error);
      }

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
    requestRefreshMap();
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
