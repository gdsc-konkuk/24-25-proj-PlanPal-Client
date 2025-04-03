// src/pages/Chat/components/MiddlePanel.tsx
import { format } from "date-fns";
import {
  CalendarPlus2Icon as CalendarIcon2,
  Filter,
  Hash,
  Search,
  Star,
  StarOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PlaceInfo } from "../types";

import PlaceCard from "./PlaceCard";

interface MiddlePanelProps {
  activePlacesTab: string;
  setActivePlacesTab: (tab: string) => void;
  placeFilter: string;
  setPlaceFilter: (filter: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  filteredPlaces: PlaceInfo[];
  toggleFavorite: (placeId: string) => void;
  toggleConfirmed: (placeId: string) => void;
}

const MiddlePanel: React.FC<MiddlePanelProps> = ({
  activePlacesTab,
  setActivePlacesTab,
  placeFilter,
  setPlaceFilter,
  timeFilter,
  setTimeFilter,
  dateFilter,
  setDateFilter,
  filteredPlaces,
  toggleFavorite,
  toggleConfirmed,
}) => {
  return (
    <div className="h-full flex flex-col border-r border-primary/10">
      <Tabs
        value={activePlacesTab}
        onValueChange={setActivePlacesTab}
        className="h-full flex flex-col"
      >
        <div className="border-b border-primary/10 px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Places</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search places..." className="pl-8 h-8 w-48" />
            </div>
          </div>
          <TabsList className="w-full">
            <TabsTrigger value="confirmed" className="flex-1">
              <Star className="h-4 w-4 mr-2" />
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex-1">
              <StarOff className="h-4 w-4 mr-2" />
              Candidates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filters */}
        <div className="border-b border-primary/10 p-2">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Select value={placeFilter} onValueChange={setPlaceFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="식사">식사</SelectItem>
                  <SelectItem value="관광">관광</SelectItem>
                  <SelectItem value="숙박">숙박</SelectItem>
                  <SelectItem value="이동">이동</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Times</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 text-xs w-full justify-start"
                  >
                    <CalendarIcon2 className="h-3.5 w-3.5 mr-1.5" />
                    {dateFilter ? format(dateFilter, "MMM d") : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredPlaces.length > 0 ? (
            <div className="space-y-3">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  toggleFavorite={toggleFavorite}
                  toggleConfirmed={toggleConfirmed}
                  activePlacesTab={activePlacesTab}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="bg-muted rounded-full p-3 mb-3">
                {activePlacesTab === "confirmed" ? (
                  <Star className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <StarOff className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-medium mb-1">
                No {activePlacesTab === "confirmed" ? "confirmed" : "candidate"}{" "}
                places yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activePlacesTab === "confirmed"
                  ? "Places you confirm will appear here"
                  : "Suggested places will appear here"}
              </p>
              {activePlacesTab === "candidates" && (
                <Button size="sm" variant="outline" className="text-xs">
                  <Hash className="h-3.5 w-3.5 mr-1.5" />
                  Ask for recommendations
                </Button>
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default MiddlePanel;
