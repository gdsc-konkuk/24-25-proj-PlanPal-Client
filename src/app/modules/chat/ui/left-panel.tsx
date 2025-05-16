"use client";

import { Map, CalendarIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { GoogleMap } from "@/app/modules/map/ui/components/google-map";
import { WeeklyScheduleView } from "@/components/weekly-schedule-view";
import type { ScheduleItem } from "@/components/weekly-schedule-view";
import { LikedPlace } from "@/app/modules/map/store/liked-place-store";

interface LeftPanelProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  scheduleItems: ScheduleItem[];
  places: LikedPlace[];
  onAddEvent: (eventData: Omit<ScheduleItem, "id" | "color">) => void;
}

export const LeftPanel = ({
  activeTab,
  onTabChange,
  scheduleItems,
  places,
  onAddEvent,
}: LeftPanelProps) => {
  return (
    <Tabs
      defaultValue="map"
      value={activeTab}
      onValueChange={onTabChange}
      className="h-full flex flex-col"
    >
      <div className="border-b border-primary/10 px-4 py-2">
        <TabsList className="w-full">
          <TabsTrigger value="map" className="flex-1">
            <Map className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 relative">
        <div
          className={cn("absolute inset-0 transition-opacity", {
            "opacity-100 visible pointer-events-auto": activeTab === "map",
            "opacity-0 invisible pointer-events-none": activeTab !== "map",
          })}
        >
          <GoogleMap />
        </div>

        <div
          className={cn("absolute inset-0 transition-opacity", {
            "opacity-100 visible pointer-events-auto": activeTab === "calendar",
            "opacity-0 invisible pointer-events-none": activeTab !== "calendar",
          })}
        >
          <WeeklyScheduleView
            scheduleItems={scheduleItems}
            places={places}
            onAddEvent={onAddEvent}
          />
        </div>
      </div>
    </Tabs>
  );
};
