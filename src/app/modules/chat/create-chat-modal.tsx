"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Calendar,
  Copy,
  Check,
  X,
  ImageIcon,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { createChatRoom } from "@/app/modules/chat/api/chat-room";
import { cn } from "@/lib/utils";
import { PlaceAutocomplete } from "@/app/modules/chat/place-autocomplete";

type Destination = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

interface CreateChatModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTravelCreated: (travelId: string) => void;
}

export function CreateChatModal({ isOpen, onOpenChange, onTravelCreated }: CreateChatModalProps) {
  const router = useRouter();

  // Form state
  const [newTravelName, setNewTravelName] = useState("");
  const [newTravelParticipants, setNewTravelParticipants] = useState(1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Destination | null>(null);
  const [newTravelDate, setNewTravelDate] = useState<DateRange | undefined>();
  const [newTravelDescription, setNewTravelDescription] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("basic");
  const [coverImageType, setCoverImageType] = useState<"ai" | "upload">("ai");
  const [coverImageUrl, setCoverImageUrl] = useState("/placeholder.svg?height=200&width=400");

  // Action state
  const [isCreatingTravel, setIsCreatingTravel] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [newTravelId, setNewTravelId] = useState<string | null>(null);

  const resetForm = () => {
    setNewTravelName("");
    setNewTravelParticipants(1);
    setDestinations([]);
    setSelectedPlace(null);
    setNewTravelDate(undefined);
    setNewTravelDescription("");
    setInviteLink("");
    setLinkCopied(false);
    setActiveTab("basic");
    setCoverImageType("ai");
    setCoverImageUrl("/placeholder.svg?height=200&width=400");
    setNewTravelId(null);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleCreateTravel = async () => {
    try {
      setIsCreatingTravel(true);

      // 대표 목적지 좌표 계산 (첫 번째 목적지 또는 여러 목적지의 중심점)
      let coordinates = { lat: 0, lng: 0 };

      if (destinations.length > 0) {
        if (destinations.length === 1) {
          // 목적지가 하나인 경우, 해당 좌표 사용
          coordinates = {
            lat: destinations[0].lat,
            lng: destinations[0].lng
          };
        } else {
          // 목적지가 여러 개인 경우, 중심점 계산
          const totalLat = destinations.reduce((sum, dest) => sum + dest.lat, 0);
          const totalLng = destinations.reduce((sum, dest) => sum + dest.lng, 0);
          coordinates = {
            lat: totalLat / destinations.length,
            lng: totalLng / destinations.length
          };
        }
      }

      // 목적지 이름 문자열 생성
      const destinationString = destinations.map(dest =>
        `${dest.name} (${dest.address})`
      ).join(", ");

      // Create request payload from form data
      const chatRoomData = {
        name: newTravelName,
        limitUsers: newTravelParticipants,
        destination: destinationString,
        coordinates: coordinates,
        thumbnailUrl: coverImageUrl,
      };

      // Add optional thumbnailUrl only if it's not the placeholder
      if (coverImageUrl !== "/placeholder.svg?height=200&width=400") {
        chatRoomData.thumbnailUrl = coverImageUrl;
      }

      // Call the API to create a chat room
      const response = await createChatRoom(chatRoomData);

      // Generate an invite link using the inviteCode from the response
      const baseUrl = window.location.origin;
      const inviteUrl = `${baseUrl}/invite/${response.inviteCode}`;
      setInviteLink(inviteUrl);

      // Store the new travel ID for later navigation
      const travelId = response.id.toString();
      setNewTravelId(travelId);

      // Notify parent component
      onTravelCreated(travelId);
    } catch (error) {
      console.error("Error creating travel room:", error);
      // You may want to show an error toast/notification here
    } finally {
      setIsCreatingTravel(false);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handlePlaceSelect = (place: { name: string; address: string; lat: number; lng: number }) => {
    if (place.name && place.lat && place.lng) {
      setSelectedPlace({
        id: `dest-${Date.now()}`,
        name: place.name,
        address: place.address,
        lat: place.lat,
        lng: place.lng
      });
    } else {
      setSelectedPlace(null);
    }
  };

  const addDestination = () => {
    if (selectedPlace) {
      setDestinations(prev => [...prev, selectedPlace]);
      setSelectedPlace(null);
    }
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter((dest) => dest.id !== id));
  };

  const handleStartTravel = () => {
    const travelIdToUse = newTravelId || `travel-${Date.now()}`; // Fallback to old behavior if API fails
    router.push(`/chat?id=${travelIdToUse}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Trip Plan</DialogTitle>
          <DialogDescription>
            Set up a new trip plan and invite others to join.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="destination">Destination</TabsTrigger>
            <TabsTrigger value="invite">Invite</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="travel-name">Trip Name</Label>
              <Input
                id="travel-name"
                placeholder="e.g., Summer Vacation 2023"
                value={newTravelName}
                onChange={(e) => setNewTravelName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Maximum Participants</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max="10"
                value={newTravelParticipants}
                onChange={(e) => setNewTravelParticipants(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">Travel Date</Label>
              <DatePickerWithRange
                date={newTravelDate}
                setDate={setNewTravelDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Trip Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us more about your trip..."
                value={newTravelDescription}
                onChange={(e) => setNewTravelDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={cn(
                    "border rounded-md p-2 flex flex-col items-center cursor-pointer hover:bg-accent/10",
                    coverImageType === "ai" && "border-primary bg-accent/5"
                  )}
                  onClick={() => setCoverImageType("ai")}
                >
                  <ImageIcon className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">AI Generated</span>
                  <span className="text-xs text-muted-foreground">
                    Based on your destination
                  </span>
                </div>
                <div
                  className={cn(
                    "border rounded-md p-2 flex flex-col items-center cursor-pointer hover:bg-accent/10",
                    coverImageType === "upload" && "border-primary bg-accent/5"
                  )}
                  onClick={() => setCoverImageType("upload")}
                >
                  <ImageIcon className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Upload Image</span>
                  <span className="text-xs text-muted-foreground">
                    Use your own image
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setActiveTab("destination")}>Next</Button>
            </div>
          </TabsContent>

          <TabsContent value="destination" className="space-y-4">
            <div className="space-y-2">
              <Label>Search Destination</Label>
              <div className="flex flex-col space-y-2">
                <PlaceAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for countries, cities, or landmarks"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={addDestination}
                  disabled={!selectedPlace}
                  className="mt-2"
                >
                  Add to Destinations
                </Button>
              </div>
            </div>

            <div>
              <Label>Destinations</Label>
              <div className="mt-2 border rounded-md p-4 min-h-[100px]">
                {destinations.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No destinations added yet
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {destinations.map((dest) => (
                      <Badge key={dest.id} variant="secondary" className="pl-2">
                        {dest.name}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({dest.lat.toFixed(2)}, {dest.lng.toFixed(2)})
                        </span>
                        <button
                          className="ml-1 rounded-full hover:bg-muted-foreground/20"
                          onClick={() => removeDestination(dest.id)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Back
              </Button>
              <Button
                onClick={() => {
                  handleCreateTravel();
                  setActiveTab("invite");
                }}
                disabled={
                  !newTravelName ||
                  destinations.length === 0 ||
                  isCreatingTravel
                }
              >
                {isCreatingTravel ? "Creating..." : "Create Trip"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <div className="p-6 text-center space-y-4">
              {inviteLink ? (
                <>
                  <div className="bg-accent/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Trip Created!</h3>
                  <p className="text-muted-foreground">
                    Share this link with your friends to invite them to your trip
                  </p>

                  <div className="flex mt-4">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button
                      className="rounded-l-none"
                      onClick={handleCopyInviteLink}
                    >
                      {linkCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Separator className="my-4" />
                  <Button onClick={handleStartTravel} className="w-full">
                    Start Planning Now
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
