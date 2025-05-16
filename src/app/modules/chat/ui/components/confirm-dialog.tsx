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
import { useScheduleStore } from "../../store/schedule-store";
import { fetchAuth } from "@/lib/fetch-auth";
import { toast } from "sonner";
import { useState } from "react";
import { useWebSocketStore } from "../../store/websocket-store";

interface PlaceCardProps {
  place: LikedPlace;
}

export function ConfirmDialog({ place }: PlaceCardProps) {
  const setIconType = useLikedPlaces((state) => state.setIconType);
  const getIconType = useLikedPlaces((state) => state.getIconType);
  const getMarker = useLikedPlaces((state) => state.getMarker);
  const schedules = useScheduleStore((state) => state.schedules);
  const [isDeleting, setIsDeleting] = useState(false);
  const refreshScheduleTrigger = useWebSocketStore(
    (state) => state.refreshScheduleTrigger
  );
  const requestRefreshMap = useWebSocketStore(
    (state) => state.requestRefreshMap
  );

  const deleteSchedulesByPlaceId = async (name: string) => {
    // Find all schedules associated with this place
    const matchingSchedules = schedules.filter(
      (schedule) => schedule.title === name
    );

    if (matchingSchedules.length === 0) {
      console.log("No schedules found for this place");
      return;
    }

    setIsDeleting(true);

    try {
      // Delete each matching schedule
      for (const schedule of matchingSchedules) {
        const response = await fetchAuth(`/schedules/${schedule.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete schedule: ${response.status}`);
        }
      }

      // Notify success
      toast.success(`Removed ${matchingSchedules.length} schedule(s)`);

      // Trigger refresh of schedules
      useWebSocketStore.setState({
        refreshScheduleTrigger: refreshScheduleTrigger + 1,
      });
    } catch (error) {
      console.error("Error deleting schedules:", error);
      toast.error("Failed to remove schedules");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleConfirmed = async (place: LikedPlace) => {
    const placeId = place.placeId;
    const isConfirmed = getIconType(placeId) === IconType.STAR;

    // If we're removing a confirmed place, delete its schedules first
    if (isConfirmed) {
      await deleteSchedulesByPlaceId(place.name);
    }

    requestRefreshMap();

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
        style={{
          opacity: isDeleting ? 0.7 : 1,
          cursor: isDeleting ? "not-allowed" : "pointer",
        }}
      >
        {isDeleting ? "Removing..." : "Remove"}
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
