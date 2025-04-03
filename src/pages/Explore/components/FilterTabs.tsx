// src/pages/Explore/components/FilterTabs.tsx
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Local Recommendations</h2>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <TabsList className="w-full md:w-auto overflow-auto">
          <TabsTrigger value="all" className="flex-shrink-0">
            All
          </TabsTrigger>
          <TabsTrigger value="cafe" className="flex-shrink-0">
            Cafés
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex-shrink-0">
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="attraction" className="flex-shrink-0">
            Attractions
          </TabsTrigger>
          <TabsTrigger value="tour" className="flex-shrink-0">
            Tours
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Mobile Location Filter */}
      <div className="mt-4 md:hidden">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="tokyo">Tokyo</SelectItem>
            <SelectItem value="sydney">Sydney</SelectItem>
            <SelectItem value="bangkok">Bangkok</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterTabs;
