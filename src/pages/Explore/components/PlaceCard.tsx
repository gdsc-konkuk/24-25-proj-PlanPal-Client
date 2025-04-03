// src/pages/Explore/components/PlaceCard.tsx
import { Camera, Coffee, MapPin, Star, Ticket, Utensils } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { LocalPlace } from "../Explore";

interface PlaceCardProps {
  place: LocalPlace;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
          <h3 className="text-white font-bold text-lg">{place.name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="capitalize">{place.location}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-foreground/80 text-sm mb-3">{place.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {place.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {place.localTip && (
          <div className="bg-secondary/20 border border-secondary/30 rounded-md p-3 text-sm">
            <p className="font-medium text-foreground mb-1">Local Tip:</p>
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
  );
};

export default PlaceCard;
