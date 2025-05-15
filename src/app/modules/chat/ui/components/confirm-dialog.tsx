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
import { ConfirmForm } from "./confirm-form";

interface PlaceCardProps {
  place: LikedPlace;
}

export function ConfirmDialog({ place }: PlaceCardProps) {
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

  if (getIconType(place.placeId) === IconType.STAR) {
    return (
      <div
        className="h-[28px] rounded-xl bg-black text-white hover:bg-gray-500 text-center w-[80px] flex items-center justify-center hover:cursor-pointer"
        onClick={() => toggleConfirmed(place)}
      >
        Remove
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <div className="h-[28px] rounded-xl bg-black text-white hover:bg-gray-500 text-center w-[80px] flex items-center justify-center hover:cursor-pointer">
          Confirm
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{place.name}</DialogTitle>
          <DialogDescription asChild>
            <ConfirmForm onToggleConfirmed={toggleConfirmed} place={place} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
