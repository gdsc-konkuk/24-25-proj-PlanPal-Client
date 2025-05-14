import {
  IconType,
  LikedPlace,
  useLikedPlaces,
} from "@/app/modules/map/store/liked-place-store";
import { useMapStore } from "@/app/modules/map/store/map-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Badge,
  Bed,
  Bus,
  Camera,
  Clock,
  MapPin,
  Star,
  Utensils,
} from "lucide-react";

interface PlaceCardProps {
  place: LikedPlace;
  activePlacesTab: "confirmed" | "candidates";
}

export function PlaceCard({ place, activePlacesTab }: PlaceCardProps) {
  const map = useMapStore((state) => state.map);
  const likedPlaces = useLikedPlaces((state) => state.likedPlaces);
  const setIconType = useLikedPlaces((state) => state.setIconType);
  const getIconType = useLikedPlaces((state) => state.getIconType);
  const getMarker = useLikedPlaces((state) => state.getMarker);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "식사":
        return <Utensils className="h-4 w-4" />;
      case "관광":
        return <Camera className="h-4 w-4" />;
      case "숙박":
        return <Bed className="h-4 w-4" />;
      case "이동":
        return <Bus className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const toggleConfirmed = (place: LikedPlace) => {
    const placeId = place.placeId;
    const isConfirmed = getIconType(placeId) === IconType.STAR;
    setIconType(placeId, isConfirmed ? IconType.HEART : IconType.STAR);
    const marker = getMarker(placeId);

    const img = document.createElement("img");
    img.src = !isConfirmed ? "/star.png" : "/heart.png";
    img.style.width = "36px";
    img.style.height = "36px";

    if (marker) marker.content = img;
  };

  console.log("place", place);
  console.log("place", place.name);

  return (
    <Card key={place.placeId} className="overflow-hidden py-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[15px] truncate max-w-[150px] text-blue-500">
                  {place.name}
                </h3>
                {place.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    {place.rating}
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{place.address}</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                {place.description && (
                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {place.description}
                  </p>
                )}

                {place.type && (
                  <div className="flex items-center text-[12px]">
                    {getTypeIcon(place.type)}
                    <span className="ml-1">{place.type}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Added by {place.addedBy}</span>
                </div>
                <Button
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => toggleConfirmed(place)}
                >
                  {activePlacesTab === "confirmed" ? "Remove" : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
