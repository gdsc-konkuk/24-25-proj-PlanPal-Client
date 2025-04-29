"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { AlertCircle, MapIcon } from "lucide-react";

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "mentioned" | "recommended" | "route";
  description?: string;
};

type GoogleMapProps = {
  locations: Location[];
  routePoints?: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (location: Location) => void;
};

export function GoogleMap({
  locations = [],
  routePoints = [],
  center = { lat: 35.6762, lng: 139.6503 }, // Default to Tokyo
  zoom = 12,
  onMarkerClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current as HTMLDivElement, {
        center,
        zoom,
        mapId: "min",
      });

      const marker = new Marker({
        map,
        position: center,
      });
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg border-red-500" />
  );
}
