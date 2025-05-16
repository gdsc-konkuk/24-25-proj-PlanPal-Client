import { create } from "zustand";
import type { ScheduleItem } from "@/components/weekly-schedule-view";
import type { PlaceType } from "../types";

export interface ApiSchedule {
  id: number;
  startTime: string;
  endTime: string;
  mapPin: {
    id: number;
    userId: number;
    title: string;
    address: string;
    content: string;
    type: string;
    rating: number;
    iconType: string;
  };
}

type ScheduleState = {
  schedules: ScheduleItem[];
  isLoading: boolean;
  error: string | null;
  refreshTrigger: number;
  setSchedules: (schedules: ApiSchedule[]) => void;
  refreshSchedules: () => void;
};

// Helper function to transform API response to ScheduleItem format
export const mapApiToScheduleItem = (
  apiSchedules: ApiSchedule[]
): ScheduleItem[] => {
  return apiSchedules.map((schedule) => ({
    id: schedule.id.toString(),
    placeId: schedule.mapPin.id.toString(),
    title: schedule.mapPin.title,
    date: new Date(schedule.startTime),
    startTime: new Date(schedule.startTime),
    endTime: new Date(schedule.endTime),
    type: (schedule.mapPin.type as PlaceType) || "Etc",
    description: schedule.mapPin.content || "",
    color: getColorForType(schedule.mapPin.type),
  }));
};

// Helper function to determine color based on place type
function getColorForType(type: string): string {
  switch (type) {
    case "Food":
      return "#FF9800";
    case "Tour":
      return "#4CAF50";
    case "Stay":
      return "#2196F3";
    case "Move":
      return "#9C27B0";
    default:
      return "#607D8B";
  }
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  isLoading: false,
  error: null,
  refreshTrigger: 0,

  setSchedules: (apiSchedules) => {
    const transformedData = mapApiToScheduleItem(apiSchedules);
    set({ schedules: transformedData });
  },

  refreshSchedules: () => {
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },
}));
