"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapOverlay } from "./map-overlay";
import { useMapStore } from "@/app/modules/map/store/map-store";
import { useApi } from "@/hooks/use-api";

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

  useEffect(() => {
    const initMap = async () => {
      // let mapConfig;
      // try {
      //   mapConfig = await api("/maps/chat-rooms/2");
      // } catch (err) {
      //   console.error("Failed to load map config:", err);
      //   return;
      // }

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
        center: { lat: 35.6762, lng: 139.6503 },
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
  }, []);

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
