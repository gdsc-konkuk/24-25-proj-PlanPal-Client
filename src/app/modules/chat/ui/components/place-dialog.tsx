import { LikedPlace } from "@/app/modules/map/store/liked-place-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlaceCard } from "./place-card";
import { useEffect, useState } from "react";
import { ReviewList } from "./reviews-list";

interface PlaceCardProps {
  place: LikedPlace;
  activePlacesTab: "confirmed" | "candidates";
}

export function PlaceDialog({ place, activePlacesTab }: PlaceCardProps) {
  const [placeInfo, setPlaceInfo] = useState<google.maps.places.Place | null>(
    null
  );

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      const placeInstance = new google.maps.places.Place({
        id: place.placeId,
      });
      const placeDetails = await placeInstance.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "location",
          "addressComponents",
          "reviews",
          "photos",
        ],
      });
      setPlaceInfo(placeDetails.place);
    };
    fetchPlaceDetails();
  }, []);

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <PlaceCard place={place} activePlacesTab={activePlacesTab} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{place.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-2 max-h-[600px] overflow-scroll mt-4">
              {placeInfo?.photos && (
                <img
                  src={placeInfo.photos[0].getURI()}
                  alt={place.name}
                  className="rounded-xl h-[300px] object-cover"
                />
              )}
              {placeInfo?.reviews && <ReviewList reviews={placeInfo.reviews} />}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
