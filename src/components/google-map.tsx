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

const markerData = [
  {
    position: { lat: 35.6762, lng: 139.6503 },
    src: "/heart.png",
    title: "Heart Marker",
  },
  {
    position: { lat: 35.6895, lng: 139.6917 },
    src: "/heart.png",
    title: "Heart Marker",
  },
  {
    position: { lat: 35.7023, lng: 139.7745 },
    src: "/heart.png",
    title: "Heart Marker",
  },
  {
    position: { lat: 35.6812, lng: 139.7671 },
    src: "/star.png",
    title: "Star Marker",
  },
  {
    position: { lat: 35.6586, lng: 139.7454 },
    src: "/star.png",
    title: "Star Marker",
  },
];

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

      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current as HTMLDivElement, {
        center,
        zoom,
        mapId: "min",
      });

      markerData.forEach(({ position, src, title }) => {
        const img = document.createElement("img");
        img.src = src;
        img.style.width = "36px";
        img.style.height = "36px";

        new AdvancedMarkerElement({
          map,
          position,
          content: img,
          title,
        });
      });
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg border-red-500" />
  );
}
