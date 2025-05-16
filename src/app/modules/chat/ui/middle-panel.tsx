"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  StarOff,
  Hash,
  CalendarPlus2Icon as CalendarIcon2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  LikedPlace,
  IconType,
} from "@/app/modules/map/store/liked-place-store";
import { PlaceDialog } from "./components/place-dialog";
import { PlacesTabType } from "../types";

interface MiddlePanelProps {
  likedPlaces: LikedPlace[];
  activePlacesTab: PlacesTabType;
  onActivePlacesTabChange: (value: PlacesTabType) => void;
}

export const MiddlePanel = ({
  likedPlaces,
  activePlacesTab,
  onActivePlacesTabChange,
}: MiddlePanelProps) => {
  const [placeFilter, setPlaceFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // Filter places based on selected filters
  const filteredPlaces = likedPlaces.filter((place) => {
    // First filter by confirmed/candidates tab
    const matchesTab =
      activePlacesTab === "confirmed"
        ? place.iconType === IconType.STAR
        : place.iconType === IconType.HEART;

    // // Then apply additional filters
    // const matchesType = placeFilter === "all" || place.type === placeFilter;

    // // Time filter
    // let matchesTime = true;
    // if (timeFilter !== "all" && place.visitTime) {
    //   const hour = place.visitTime.getHours();
    //   if (timeFilter === "morning" && (hour < 5 || hour >= 12))
    //     matchesTime = false;
    //   if (timeFilter === "afternoon" && (hour < 12 || hour >= 17))
    //     matchesTime = false;
    //   if (timeFilter === "evening" && (hour < 17 || hour >= 21))
    //     matchesTime = false;
    //   if (timeFilter === "night" && (hour < 21 || hour >= 5))
    //     matchesTime = false;
    // }

    // // Date filter
    // let matchesDate = true;
    // if (dateFilter && place.visitTime) {
    //   const visitDate = new Date(place.visitTime);
    //   const filterDate = new Date(dateFilter);
    //   matchesDate =
    //     visitDate.getFullYear() === filterDate.getFullYear() &&
    //     visitDate.getMonth() === filterDate.getMonth() &&
    //     visitDate.getDate() === filterDate.getDate();
    // }

    // return matchesTab && matchesType && matchesTime && matchesDate;

    return matchesTab;
  });

  return (
    <div className="h-full flex flex-col border-r border-primary/10">
      <Tabs
        defaultValue="confirmed"
        value={activePlacesTab}
        onValueChange={(value) => {
          if (value === "confirmed" || value === "candidates") {
            onActivePlacesTabChange(value);
          }
        }}
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
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Tour">Tour</SelectItem>
                  <SelectItem value="Stay">Stay</SelectItem>
                  <SelectItem value="Move">Move</SelectItem>
                  <SelectItem value="Etc">Etc</SelectItem>
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
                    onSelect={(date) => setDateFilter(date)}
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
                <PlaceDialog
                  key={place.placeId}
                  place={place}
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
