// src/pages/Dashboard/components/TravelRoomCard.tsx
import { format } from "date-fns";
import { Calendar, MapPin, MessageSquare, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { TravelRoomCardProps } from "../types";

const TravelRoomCard: React.FC<TravelRoomCardProps> = ({
  room,
  onEnterChatRoom,
}) => {
  const formatDateRange = (from: Date, to: Date) => {
    return `${format(from, "yy.M.d")}~${format(to, "M.d")}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={room.coverImage || "/placeholder.svg"}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-xl mb-1">{room.name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span>
              {room.destination.country} - {room.destination.region}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-foreground/70 mr-2" />
            <span className="text-sm text-foreground/70">
              {formatDateRange(room.dateRange.from, room.dateRange.to)}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-foreground/70 mr-2" />
            <span className="text-sm text-foreground/70">
              {room.participants.length}명
            </span>
          </div>
        </div>

        <div className="flex -space-x-2 mb-4">
          {room.participants.slice(0, 4).map((participant) => (
            <Avatar
              key={participant.id}
              className="h-8 w-8 border-2 border-background"
            >
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="bg-accent/30 text-accent-foreground">
                {participant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {room.participants.length > 4 && (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
              +{room.participants.length - 4}
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <MessageSquare className="h-3 w-3 text-foreground/70 mr-2" />
            <span className="text-xs font-medium">
              {room.lastMessage.sender}
            </span>
            <span className="text-xs text-foreground/50 ml-auto">
              {format(room.lastMessage.timestamp, "MM/dd HH:mm")}
            </span>
          </div>
          <p className="text-sm text-foreground/80 truncate">
            {room.lastMessage.content}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => onEnterChatRoom(room.id)}
        >
          채팅방 입장
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TravelRoomCard;
