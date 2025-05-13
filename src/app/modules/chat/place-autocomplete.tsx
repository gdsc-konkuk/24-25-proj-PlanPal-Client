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
  onModalClose?: () => void; // 모달이 닫힐 때 호출될 콜백
}

export function PlaceAutocomplete({
  onPlaceSelect,
  placeholder = "국가, 도시 또는 장소 검색",
  className = "",
  defaultValue = "",
  onModalClose,
}: PlaceAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    address: string;
  } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const googleMaps = useMapStore((state) => state.googleMaps);
  const autocompleteMapRef = useRef<google.maps.Map | null>(null);
  const autocompleteMapDivRef = useRef<HTMLDivElement | null>(null);

  // 자동완성을 위한 별도의 Google Map 인스턴스 생성
  useEffect(() => {
    // Google Maps API가 로드되었는지 확인
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initAutocompleteMap;
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initAutocompleteMap();
    }

    // 자동완성 전용 맵 초기화
    function initAutocompleteMap() {
      // 맵을 넣을 숨겨진 div 생성
      if (!autocompleteMapDivRef.current) {
        const mapDiv = document.createElement('div');
        mapDiv.style.display = 'none'; // 보이지 않게 설정
        mapDiv.style.height = '0';
        mapDiv.style.width = '0';
        document.body.appendChild(mapDiv);
        autocompleteMapDivRef.current = mapDiv;

        // 맵 인스턴스 생성
        autocompleteMapRef.current = new google.maps.Map(mapDiv, {
          center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표
          zoom: 8,
          disableDefaultUI: true,
        });
      }
    }

    return () => {
      // 컴포넌트 언마운트 시 생성한 맵 요소 제거
      if (autocompleteMapDivRef.current) {
        document.body.removeChild(autocompleteMapDivRef.current);
        autocompleteMapDivRef.current = null;
        autocompleteMapRef.current = null;
      }
    };
  }, []);

  // 자동완성 설정
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) return;

    const options = {
      // types: ["(regions)"], // 국가, 도시, 지역 등만 검색되도록 제한
      fields: ["name", "formatted_address", "geometry", "place_id"],
    };

    // API가 존재하는지 다시 한번 확인
    if (google && google.maps && google.maps.places && google.maps.places.Autocomplete) {
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
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  // 모달이 닫힐 때 호출될 클린업 함수
  useEffect(() => {
    return () => {
      // 모달이 닫히면 자동완성 맵 인스턴스와 DOM 요소 제거
      if (onModalClose && autocompleteMapDivRef.current) {
        document.body.removeChild(autocompleteMapDivRef.current);
        autocompleteMapDivRef.current = null;
        autocompleteMapRef.current = null;
        onModalClose();
      }
    };
  }, [onModalClose]);

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
