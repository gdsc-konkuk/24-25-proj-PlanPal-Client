// src/pages/Chat/components/PlaceCard.tsx
import { format } from "date-fns";
import {
  Bed,
  Bus,
  Camera,
  Clock,
  Coffee,
  MapPin,
  Star,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { PlaceInfo } from "../types";

interface PlaceCardProps {
  place: PlaceInfo;
  toggleFavorite: (placeId: string) => void;
  toggleConfirmed: (placeId: string) => void;
  activePlacesTab: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  toggleFavorite,
  toggleConfirmed,
  activePlacesTab,
}) => {
  // Get the type icon for a place
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

  return (
    <Card key={place.id} className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="font-medium text-sm truncate">{place.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1"
                onClick={() => toggleFavorite(place.id)}
              >
                {place.isFavorite ? (
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ) : (
                  <Star className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{place.address}</span>
            </div>

            {place.description && (
              <p className="text-xs text-foreground/80 mb-2 line-clamp-2">
                {place.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mb-1">
              {place.category && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                  {place.category}
                </Badge>
              )}
              {place.rating && (
                <Badge
                  variant="outline"
                  className="text-xs px-1 py-0 h-5 bg-yellow-50"
                >
                  ★ {place.rating}
                </Badge>
              )}
              {place.type && (
                <Badge className="text-xs px-1 py-0 h-5 bg-primary/20 text-primary">
                  {getTypeIcon(place.type)}
                  <span className="ml-1">{place.type}</span>
                </Badge>
              )}
            </div>

            {place.visitTime && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {format(place.visitTime, "MMM d, HH:mm")}
                  {place.duration &&
                    ` (${Math.floor(place.duration / 60)}h ${place.duration % 60}m)`}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Added by {place.addedBy}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => toggleConfirmed(place.id)}
              >
                {activePlacesTab === "confirmed" ? "Remove" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
