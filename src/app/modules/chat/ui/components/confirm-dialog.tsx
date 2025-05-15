import { LikedPlace } from "@/app/modules/map/store/liked-place-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLikedPlaces } from "@/app/modules/map/store/liked-place-store";
import { IconType } from "@/app/modules/map/store/liked-place-store";
import { Button } from "@/components/ui/button";

interface PlaceCardProps {
  place: LikedPlace;
  activePlacesTab: "confirmed" | "candidates";
}

export function ConfirmDialog({ place, activePlacesTab }: PlaceCardProps) {
  const setIconType = useLikedPlaces((state) => state.setIconType);
  const getIconType = useLikedPlaces((state) => state.getIconType);
  const getMarker = useLikedPlaces((state) => state.getMarker);

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

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}>
        <Button className="h-[28px]">
          {activePlacesTab === "confirmed" ? "Remove" : "Confirm"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{place.name}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <div>Hi</div>
              <Button onClick={() => toggleConfirmed(place)}>confirm</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
