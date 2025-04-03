// src/pages/Chat/components/LeftPanel.tsx
import { CalendarIcon, Map } from "lucide-react";

import { GoogleMap } from "@/components/google-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyScheduleView } from "@/components/weekly-schedule-view";

import { PlaceInfo, ScheduleItem } from "../types";

interface LeftPanelProps {
  activeLeftTab: string;
  setActiveLeftTab: (tab: string) => void;
  places: PlaceInfo[];
  scheduleItems: ScheduleItem[];
  onAddEvent: (eventData: Omit<ScheduleItem, "id" | "color">) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  activeLeftTab,
  setActiveLeftTab,
  places,
  scheduleItems,
  onAddEvent,
}) => {
  return (
    <div className="h-full flex flex-col border-r border-primary/10">
      <Tabs
        value={activeLeftTab}
        onValueChange={setActiveLeftTab}
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

        <TabsContent value="map" className="flex-1 p-4 overflow-hidden">
          <div className="h-full rounded-lg overflow-hidden">
            <GoogleMap
              locations={places.map((place) => ({
                id: place.id,
                name: place.name,
                lat: place.lat,
                lng: place.lng,
                type: place.isConfirmed ? "recommended" : "mentioned",
                description: place.description,
              }))}
              center={
                places.length > 0
                  ? { lat: places[0].lat, lng: places[0].lng }
                  : undefined
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 overflow-hidden">
          <WeeklyScheduleView
            scheduleItems={scheduleItems}
            places={places}
            onAddEvent={onAddEvent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeftPanel;
