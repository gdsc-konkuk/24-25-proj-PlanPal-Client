"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapOverlay } from "./map-overlay";
import { useMapStore } from "@/app/modules/map/store/map-store";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { IconType, useLikedPlaces } from "../../store/liked-place-store";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";
import { useWebSocketStore } from "@/app/modules/chat/store/websocket-store";

interface MapConfigResponse {
  id: number;
  chatRoomId: number;
  centerCoordinates: {
    lat: number;
    lng: number;
  };
  pins: {
    placeId: string;
    userId: number;
    title: string;
    address: string;
    content: string;
    type: string;
    rating: number;
    iconType: IconType;
    lat: number;
    lng: number;
  }[];
  createdAt: string;
}

export function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [placeInfo, setPlaceInfo] = useState<{
    place: google.maps.places.PlaceResult;
    position: google.maps.LatLng;
    placeId: string;
  } | null>(null);
  const map = useMapStore((state) => state.map);
  const setMap = useMapStore((state) => state.setMap);
  const googleMaps = useMapStore((state) => state.googleMaps);
  const setGoogleMaps = useMapStore((state) => state.setGoogleMaps);
  const refreshMapTrigger = useWebSocketStore(
    (state) => state.refreshMapTrigger
  );
  const searchParams = useSearchParams();

  const chatRoomId = searchParams.get("id");
  const addPlace = useLikedPlaces((state) => state.addPlace);
  const setMarker = useLikedPlaces((state) => state.setMarker);
  const setLikedPlacesNull = useLikedPlaces(
    (state) => state.setLikedPlacesNull
  );

  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) return null;
  const currentUserName = parseJwt(accessToken!).name;

  const api = useApi();

  useEffect(() => {
    const initMap = async () => {
      let mapConfig;
      try {
        mapConfig = await api<MapConfigResponse>(
          `/maps/chat-rooms/${chatRoomId}`
        );
      } catch (err) {
        console.error("Failed to load map config:", err);
        return;
      }

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["places"],
      });

      const maps = (await loader.importLibrary("maps")) as typeof google.maps;
      const markerLib = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      const placeLib = (await loader.importLibrary(
        "places"
      )) as google.maps.PlacesLibrary;

      setGoogleMaps(maps);

      const mapInstance = new maps.Map(mapRef.current as HTMLDivElement, {
        center: {
          lat: mapConfig.centerCoordinates.lat,
          lng: mapConfig.centerCoordinates.lng,
        },
        zoom: 13,
        mapId: "min",
      });

      setMap(mapInstance);

      const placesService = new google.maps.places.PlacesService(mapInstance);

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        const evt = e as google.maps.MapMouseEvent & { placeId?: string };

        if (evt.placeId && evt.latLng && !placeInfo) {
          evt.stop();

          placesService.getDetails(
            {
              placeId: evt.placeId,
              fields: [
                "name",
                "formatted_address",
                "formatted_phone_number",
                "rating",
                "url",
              ],
            },
            (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place
              ) {
                console.log(place);
                setPlaceInfo({
                  place,
                  position: evt.latLng!,
                  placeId: evt.placeId!,
                });
              }
            }
          );
        }
      });

      setLikedPlacesNull();

      mapConfig.pins.forEach((pin) => {
        const img = document.createElement("img");
        img.src = pin.iconType === IconType.HEART ? "/heart.png" : "/star.png";
        img.style.width = "36px";
        img.style.height = "36px";

        const marker = new markerLib.AdvancedMarkerElement({
          map: mapInstance,
          position: {
            lat: pin.lat,
            lng: pin.lng,
          },
          content: img,
        });

        addPlace({
          placeId: pin.placeId,
          name: pin.title,
          iconType: pin.iconType,
          rating: pin.rating,
          address: pin.address,
          content: pin.content,
          type: pin.type,
          addedBy: currentUserName,
          lat: pin.lat,
          lng: pin.lng,
        });

        setMarker(pin.placeId, marker);
      });
    };

    initMap();
  }, [searchParams, refreshMapTrigger]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {googleMaps && map && placeInfo && chatRoomId && (
        <MapOverlay
          placeInfo={placeInfo}
          position={placeInfo.position}
          onClose={() => setPlaceInfo(null)}
          chatRoomId={chatRoomId}
          currentUserName={currentUserName}
        />
      )}
    </div>
  );
}
