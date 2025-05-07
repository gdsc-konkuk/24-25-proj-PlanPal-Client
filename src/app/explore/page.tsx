"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Globe,
  Coffee,
  Utensils,
  Camera,
  Ticket,
} from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

type LocalPlace = {
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

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const dummyPlaces: LocalPlace[] = [
    {
      id: "1",
      name: "Hidden Garden Café",
      description:
        "A tranquil café tucked away in a quiet alley, known for organic coffee and homemade pastries.",
      category: "cafe",
      rating: 4.8,
      location: "tokyo",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Coffee", "Breakfast", "Quiet"],
      localTip:
        "Ask for their special matcha latte that isn't on the menu. Locals come early on weekends.",
    },
    {
      id: "2",
      name: "Sunset Viewpoint",
      description:
        "A lesser-known spot to watch the sunset over the city skyline, away from tourist crowds.",
      category: "attraction",
      rating: 4.9,
      location: "sydney",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Scenic", "Photography", "Romantic"],
      localTip:
        "Visit on weekdays around 6pm for the best experience with fewer people.",
    },
    {
      id: "3",
      name: "Traditional Market Tour",
      description:
        "Experience the authentic local market with a guide who knows all the best vendors and specialties.",
      category: "tour",
      rating: 4.7,
      location: "bangkok",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Food", "Culture", "Shopping"],
      localTip:
        "The tour at 7am lets you see the market setup and get the freshest items.",
    },
    {
      id: "4",
      name: "Family-Run Ramen Shop",
      description:
        "This tiny ramen shop has been run by the same family for three generations, serving authentic recipes.",
      category: "restaurant",
      rating: 4.9,
      location: "tokyo",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Ramen", "Authentic", "Dinner"],
      localTip:
        "They only make 100 bowls per day and often sell out by 1pm. Come early!",
    },
    {
      id: "5",
      name: "Secret Beach Cove",
      description:
        "A hidden beach accessible only by a 15-minute walk through a scenic trail, offering privacy and clear waters.",
      category: "attraction",
      rating: 4.6,
      location: "sydney",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Beach", "Swimming", "Nature"],
      localTip:
        "Bring your own supplies as there are no vendors nearby. Best visited during weekday mornings.",
    },
    {
      id: "6",
      name: "Night Food Market",
      description:
        "A vibrant night market where locals gather to enjoy street food, music, and crafts.",
      category: "attraction",
      rating: 4.7,
      location: "bangkok",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Food", "Nightlife", "Shopping"],
      localTip:
        "The vendors at the back of the market have the most authentic and affordable options.",
    },
  ];

  const filteredPlaces = dummyPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || place.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || place.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cafe":
        return <Coffee className="h-4 w-4" />;
      case "restaurant":
        return <Utensils className="h-4 w-4" />;
      case "attraction":
        return <Camera className="h-4 w-4" />;
      case "tour":
        return <Ticket className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#395030] to-[#adc1a5]  text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">
            Discover Local Experiences
          </h1>
          <p className="text-primary-foreground/80 mb-8">
            Find hidden gems and authentic experiences recommended by locals
          </p>

          {/* Search Bar */}
          <div className="bg-background rounded-lg shadow-lg p-1 flex items-center">
            <div className="flex-1 flex items-center px-3">
              <Search className="h-5 w-5 text-foreground/50 mr-2" />
              <Input
                type="text"
                placeholder="Search for local experiences, food, attractions..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:flex items-center border-l border-muted px-3">
              <Globe className="h-5 w-5 text-foreground/50 mr-2" />
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="border-0 w-[140px] focus:ring-0">
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
            <Button className="rounded-md m-1 bg-accent text-accent-foreground hover:bg-accent/90">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
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
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
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

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <Card
                key={place.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-background text-foreground hover:bg-background/90">
                      <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                      {place.rating}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary hover:bg-primary/90">
                      {getCategoryIcon(place.category)}
                      <span className="ml-1 capitalize">{place.category}</span>
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">
                      {place.name}
                    </h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="capitalize">{place.location}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-foreground/80 text-sm mb-3">
                    {place.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {place.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {place.localTip && (
                    <div className="bg-secondary/20 border border-secondary/30 rounded-md p-3 text-sm">
                      <p className="font-medium text-foreground mb-1">
                        Local Tip:
                      </p>
                      <p className="text-foreground/80">{place.localTip}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 text-foreground hover:bg-primary/5"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
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
}
