"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapOverlay } from "./map-overlay";
import { useMapStore } from "@/app/modules/map/store/map-store";
import { useApi } from "@/hooks/use-api";
import { useSearchParams } from "next/navigation";

// Define interface for API response
interface MapConfig {
  id: number;
  chatRoomId: number;
  centerCoordinates: {
    lat: number;
    lng: number;
  };
  pins: Array<{
    id: number;
    userId: number;
    title: string;
    address: string;
    content: string;
    type: string;
    rating: number;
    iconType: string;
  }>;
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
  const api = useApi();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initMap = async () => {
      const chatRoomId = searchParams.get('id');

      let centerCoordinates = { lat: 35.6762, lng: 139.6503 };

      if (chatRoomId) {
        try {
          const mapConfig = await api<MapConfig>(`/maps/chat-rooms/${chatRoomId}`);
          centerCoordinates = mapConfig.centerCoordinates;
        } catch (err) {
          console.error("Failed to load map config:", err);
        }
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
        center: centerCoordinates,
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
    };

    initMap();
  }, [searchParams]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {googleMaps && map && placeInfo && (
        <MapOverlay
          placeInfo={placeInfo}
          position={placeInfo.position}
          onClose={() => setPlaceInfo(null)}
        />
      )}
    </div>
  );
}
