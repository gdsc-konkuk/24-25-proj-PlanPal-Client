// src/pages/Explore/Explore.tsx
import { useState } from "react";
import { Search } from "lucide-react";

import ExploreHeader from "./components/ExploreHeader";
import FilterTabs from "./components/FilterTabs";
import PlaceCard from "./components/PlaceCard";
import SearchBar from "./components/SearchBar";
import { dummyPlaces } from "./_dummy";

// src/pages/Explore/types.ts
export type LocalPlace = {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  location: string;
  image: string;
  tags: string[];
  localTip?: string;
};

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredPlaces = dummyPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || place.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || place.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <ExploreHeader />

      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">
            Discover Local Experiences
          </h1>
          <p className="text-primary-foreground/80 mb-8">
            Find hidden gems and authentic experiences recommended by locals
          </p>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <FilterTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-foreground/50 max-w-md mx-auto">
                We couldn't find any places matching your search. Try adjusting
                your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
