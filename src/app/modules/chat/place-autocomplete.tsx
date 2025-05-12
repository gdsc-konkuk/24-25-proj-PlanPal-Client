"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { useMapStore } from "@/store/map-store";

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function PlaceAutocomplete({
  onPlaceSelect,
  placeholder = "국가, 도시 또는 장소 검색",
  className = "",
  defaultValue = "",
}: PlaceAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const googleMaps = useMapStore((state) => state.googleMaps);

  useEffect(() => {
    if (!googleMaps || !inputRef.current) return;

    const options = {
      types: ["(regions)"], // 국가, 도시, 지역 등만 검색되도록 제한
      fields: ["name", "formatted_address", "geometry", "place_id"],
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.log("장소 정보를 가져올 수 없습니다.");
        return;
      }

      const placeData = {
        name: place.name || "",
        address: place.formatted_address || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setSelectedPlace({
        name: placeData.name,
        address: placeData.address,
      });

      onPlaceSelect(placeData);
      setInputValue(`${placeData.name}, ${placeData.address}`);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [googleMaps, onPlaceSelect]);

  const handleClear = () => {
    setInputValue("");
    setSelectedPlace(null);
    onPlaceSelect({ name: "", address: "", lat: 0, lng: 0 });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-8 pr-8"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {selectedPlace && (
        <div className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium">{selectedPlace.name}</span>
          <span className="ml-1">- {selectedPlace.address}</span>
        </div>
      )}
    </div>
  );
}
