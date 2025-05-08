//@ts-nocheck

"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Plus,
  CalendarIcon,
  Map,
  Bot,
  Star,
  StarOff,
  MessageSquare,
  Hash,
  Search,
  Info,
  MapPin,
  Clock,
  ArrowLeft,
  Filter,
  CalendarPlus2Icon as CalendarIcon2,
  Utensils,
  Bed,
  Camera,
  Bus,
  MapIcon,
  ListIcon,
  MessageCircleIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { GoogleMap } from "@/components/google-map";
import { format } from "date-fns";
import Link from "next/link";
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
import { WeeklyScheduleView } from "@/components/weekly-schedule-view";
import { ResizableLayout } from "@/components/resizable-layout";
import {
  IconType,
  LikedPlace,
  useLikedPlaces,
} from "@/store/liked-place-store";
import { useMapStore } from "@/store/map-store";
import { cn } from "@/lib/utils";

type MessageType = {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isAI: boolean;
  containsPlace?: boolean;
  placeInfo?: PlaceInfo;
};

type ParticipantType = {
  id: string;
  name: string;
  avatar?: string;
  isAI: boolean;
  isOnline: boolean;
};

type PlaceInfo = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  category?: string;
  rating?: number;
  isFavorite: boolean;
  isConfirmed: boolean;
  addedBy?: string;
  addedAt?: Date;
  visitTime?: Date;
  duration?: number; // 방문 예상 시간(분)
  type?: "식사" | "관광" | "숙박" | "이동" | "기타";
};

type ScheduleItem = {
  id: string;
  placeId: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: "식사" | "관광" | "숙박" | "이동" | "기타";
  description?: string;
  color?: string;
};

export default function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const travelId = searchParams.get("id");

  // State variables
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      sender: {
        id: "ai",
        name: "Travel AI",
      },
      content:
        "Welcome to your group travel planning session! I'm your AI travel assistant. Tell me where you're thinking of going, and I can help with suggestions, cultural insights, and local recommendations. You can also invite friends to join this planning session!",
      timestamp: new Date(),
      isAI: true,
    },
  ]);
  const [participants, setParticipants] = useState<ParticipantType[]>([
    { id: "user1", name: "You", isAI: false, isOnline: true },
    { id: "ai", name: "Travel AI", isAI: true, isOnline: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 패널 가시성 상태
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [middlePanelVisible, setMiddlePanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  const [activeLeftTab, setActiveLeftTab] = useState("map");
  const [activePlacesTab, setActivePlacesTab] = useState("confirmed");
  const [placeFilter, setPlaceFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const map = useMapStore((state) => state.map);
  const likedPlaces = useLikedPlaces((state) => state.likedPlaces);
  const setIconType = useLikedPlaces((state) => state.setIconType);
  const getIconType = useLikedPlaces((state) => state.getIconType);
  const getMarker = useLikedPlaces((state) => state.getMarker);

  // 패널 가시성 변경 핸들러 - 이 함수는 ResizableLayout에서만 호출되도록 수정
  const handlePanelVisibilityChange = (
    panel: "left" | "middle" | "right",
    visible: boolean
  ) => {
    // 최소 1개의 패널은 항상 표시되어야 함
    const currentVisibleCount = [
      panel === "left" ? visible : leftPanelVisible,
      panel === "middle" ? visible : middlePanelVisible,
      panel === "right" ? visible : rightPanelVisible,
    ].filter(Boolean).length;

    if (currentVisibleCount === 0) return;

    if (panel === "left") setLeftPanelVisible(visible);
    else if (panel === "middle") setMiddlePanelVisible(visible);
    else if (panel === "right") setRightPanelVisible(visible);
  };

  // 패널 토글 핸들러 - 버튼 클릭 시 호출되는 함수
  const toggleLeftPanel = () => {
    // 이미 하나만 켜져 있고 왼쪽 패널이 켜져 있는 경우 토글 불가
    const visibleCount = [
      leftPanelVisible,
      middlePanelVisible,
      rightPanelVisible,
    ].filter(Boolean).length;
    if (visibleCount === 1 && leftPanelVisible) return;

    setLeftPanelVisible(!leftPanelVisible);
  };

  const toggleMiddlePanel = () => {
    // 이미 하나만 켜져 있고 중앙 패널이 켜져 있는 경우 토글 불가
    const visibleCount = [
      leftPanelVisible,
      middlePanelVisible,
      rightPanelVisible,
    ].filter(Boolean).length;
    if (visibleCount === 1 && middlePanelVisible) return;

    setMiddlePanelVisible(!middlePanelVisible);
  };

  const toggleRightPanel = () => {
    // 이미 하나만 켜져 있고 오른쪽 패널이 켜져 있는 경우 토글 불가
    const visibleCount = [
      leftPanelVisible,
      middlePanelVisible,
      rightPanelVisible,
    ].filter(Boolean).length;
    if (visibleCount === 1 && rightPanelVisible) return;

    setRightPanelVisible(!rightPanelVisible);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      sender: {
        id: "user1",
        name: "You",
      },
      content: inputValue,
      timestamp: new Date(),
      isAI: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Check if message contains a place mention
    const containsPlace = checkForPlaceMention(inputValue);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      let placeInfo = null;

      if (
        inputValue.toLowerCase().includes("tokyo") ||
        inputValue.toLowerCase().includes("japan")
      ) {
        setDestination("Tokyo, Japan");
        aiResponse =
          "Tokyo is a fantastic choice! The city offers an incredible mix of ultramodern and traditional experiences. Some must-visit spots include the Tokyo Skytree, Meiji Shrine, and Shibuya Crossing. Would you like recommendations for specific areas or activities in Tokyo?";
      } else if (inputValue.toLowerCase().includes("#recommend")) {
        aiResponse =
          "Based on your interests, I recommend visiting Senso-ji Temple in Asakusa. It's Tokyo's oldest temple and features a vibrant shopping street called Nakamise-dori leading up to it. The giant red lantern at the Kaminarimon Gate is an iconic photo spot!";

        placeInfo = {
          id: "place4",
          name: "Senso-ji Temple",
          lat: 35.7147,
          lng: 139.7966,
          address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
          description:
            "Tokyo's oldest temple, featuring a large lantern and shopping street.",
          category: "Religious Site",
          rating: 4.7,
          isFavorite: false,
          isConfirmed: false,
          visitTime: new Date(2023, 5, 18, 9, 0),
          duration: 120,
          type: "관광",
        };
      } else if (
        inputValue.toLowerCase().includes("plan") ||
        inputValue.toLowerCase().includes("itinerary")
      ) {
        aiResponse =
          "I'd be happy to help with your itinerary! To get started, could you tell me: 1) How many days you'll be traveling? 2) Are you interested in nature, culture, food, or adventure activities? 3) What's your approximate budget? This will help me create a tailored plan.";
      } else if (containsPlace) {
        const placeName = extractPlaceName(inputValue);
        aiResponse = `${placeName} is a great choice! Would you like me to add it to your confirmed places?`;
      } else {
        aiResponse =
          "That's interesting! To help you better, could you share more details about your destination preferences, travel dates, or specific interests? You can also use #recommend to get personalized recommendations.";
      }

      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        sender: {
          id: "ai",
          name: "Travel AI",
        },
        content: aiResponse,
        timestamp: new Date(),
        isAI: true,
        containsPlace: !!placeInfo,
        placeInfo: placeInfo || undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If AI recommended a place, add it to places list
      if (placeInfo) {
        setPlaces((prev) => {
          if (!prev.some((p) => p.id === placeInfo.id)) {
            return [
              ...prev,
              { ...placeInfo, addedBy: "AI Assistant", addedAt: new Date() },
            ];
          }
          return prev;
        });
      }
    }, 1000);
  };

  const checkForPlaceMention = (message: string): boolean => {
    // Simple check for place mentions - in a real app, use NLP
    const placePrefixes = ["let's go to", "visit", "check out", "explore"];
    return placePrefixes.some((prefix) =>
      message.toLowerCase().includes(prefix)
    );
  };

  const extractPlaceName = (message: string): string => {
    // Simple extraction - in a real app, use NLP
    const placePrefixes = ["let's go to", "visit", "check out", "explore"];
    let placeName = "";

    for (const prefix of placePrefixes) {
      if (message.toLowerCase().includes(prefix)) {
        const startIndex =
          message.toLowerCase().indexOf(prefix) + prefix.length;
        placeName = message.slice(startIndex).trim();
        // Remove punctuation
        placeName = placeName.replace(/[.,!?]$/, "");
        break;
      }
    }

    return placeName || "this place";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFavorite = (placeId: string) => {
    setPlaces(
      places.map((place) =>
        place.id === placeId
          ? { ...place, isFavorite: !place.isFavorite }
          : place
      )
    );
  };

  const toggleConfirmed = (place: LikedPlace) => {
    const placeId = place.placeId;
    const isConfirmed = getIconType(placeId) === IconType.STAR;
    setIconType(placeId, isConfirmed ? IconType.HEART : IconType.STAR);
    const marker = getMarker(placeId);

    const img = document.createElement("img");
    img.src = !isConfirmed ? "/star.png" : "/heart.png";
    img.style.width = "36px";
    img.style.height = "36px";

    if (marker) marker.content = img;
  };

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

  // Get the type icon for a place
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "식사":
        return <Utensils className="h-4 w-4" />;
      case "관광":
        return <Camera className="h-4 w-4" />;
      case "숙박":
        return <Bed className="h-4 w-4" />;
      case "이동":
        return <Bus className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // 새 일정 추가
  const handleAddEvent = (eventData: Omit<ScheduleItem, "id" | "color">) => {
    const newEvent: ScheduleItem = {
      id: `schedule-${Date.now()}`,
      ...eventData,
      color:
        eventData.type === "식사"
          ? "#F59E0B"
          : eventData.type === "관광"
          ? "#88C58F"
          : eventData.type === "숙박"
          ? "#60A5FA"
          : eventData.type === "이동"
          ? "#A78BFA"
          : "#94A3B8",
    };

    setScheduleItems((prev) => [...prev, newEvent]);
  };

  // 왼쪽 패널 컨텐츠
  const leftPanelContent = (
    <Tabs
      defaultValue="map"
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

      <div className="flex-1 relative">
        <div
          className={cn("absolute inset-0 transition-opacity", {
            "opacity-100 visible pointer-events-auto": activeLeftTab === "map",
            "opacity-0 invisible pointer-events-none": activeLeftTab !== "map",
          })}
        >
          <GoogleMap />
        </div>

        <div
          className={cn("absolute inset-0 transition-opacity", {
            "opacity-100 visible pointer-events-auto":
              activeLeftTab === "calendar",
            "opacity-0 invisible pointer-events-none":
              activeLeftTab !== "calendar",
          })}
        >
          <WeeklyScheduleView
            scheduleItems={scheduleItems}
            places={likedPlaces}
            onAddEvent={handleAddEvent}
          />
        </div>
      </div>
    </Tabs>
  );

  // 중앙 패널 컨텐츠
  const middlePanelContent = (
    <div className="h-full flex flex-col border-r border-primary/10">
      <Tabs
        defaultValue="confirmed"
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
                <Card key={place.placeId} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <h3 className="font-medium text-sm truncate">
                            {place.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1"
                            onClick={() => toggleFavorite(place.id)}
                          >
                            {place.isFavorite ? (
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>

                        {place.description && (
                          <p className="text-xs text-foreground/80 mb-2 line-clamp-2">
                            {place.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mb-1">
                          {place.category && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 h-5"
                            >
                              {place.category}
                            </Badge>
                          )}
                          {place.rating && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0 h-5 bg-yellow-50"
                            >
                              ★ {place.rating}
                            </Badge>
                          )}
                          {place.type && (
                            <Badge className="text-xs px-1 py-0 h-5 bg-primary/20 text-primary">
                              {getTypeIcon(place.type)}
                              <span className="ml-1">{place.type}</span>
                            </Badge>
                          )}
                        </div>

                        {place.visitTime && (
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {format(place.visitTime, "MMM d, HH:mm")}
                              {place.duration &&
                                ` (${Math.floor(place.duration / 60)}h ${
                                  place.duration % 60
                                }m)`}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Added by {place.addedBy}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => toggleConfirmed(place)}
                          >
                            {activePlacesTab === "confirmed"
                              ? "Remove"
                              : "Confirm"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

  // 오른쪽 패널 컨텐츠
  const rightPanelContent = (
    <div className="h-full flex flex-col">
      <div className="border-b border-primary/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            <h2 className="font-medium">Chat</h2>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {participants.length} participants
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === "user1" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex ${
                message.sender.id === "user1" ? "flex-row-reverse" : "flex-row"
              } items-start gap-2 max-w-[90%]`}
            >
              <Avatar className="h-8 w-8 mt-1">
                {message.sender.avatar ? (
                  <AvatarImage
                    src={message.sender.avatar}
                    alt={message.sender.name}
                  />
                ) : (
                  <AvatarFallback
                    className={
                      message.isAI
                        ? "bg-secondary/30 text-secondary-foreground"
                        : "bg-accent/30 text-accent-foreground"
                    }
                  >
                    {message.isAI ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      message.sender.name.charAt(0)
                    )}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                </div>
                <Card
                  className={`${
                    message.isAI ? "bg-secondary/20 border-secondary/30" : ""
                  }`}
                >
                  <CardContent className="p-3 text-sm">
                    {message.content}

                    {/* Place Info Card */}
                    {message.containsPlace && message.placeInfo && (
                      <div className="mt-2 p-2 bg-background rounded-md border border-primary/20">
                        <div className="flex items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">
                              {message.placeInfo.name}
                            </h4>
                            {message.placeInfo.address && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {message.placeInfo.address}
                              </p>
                            )}
                            {message.placeInfo.description && (
                              <p className="text-xs mt-1">
                                {message.placeInfo.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  toggleConfirmed(message.placeInfo!.id)
                                }
                              >
                                {message.placeInfo.isConfirmed
                                  ? "Remove"
                                  : "Add to Itinerary"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() =>
                                  toggleFavorite(message.placeInfo!.id)
                                }
                              >
                                {message.placeInfo.isFavorite
                                  ? "Remove from Favorites"
                                  : "Add to Favorites"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message or use # for commands..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>Try using #recommend to get AI suggestions</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-primary/10 h-14 flex items-center px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="sm" />
          {travelId && (
            <span className="text-sm text-foreground/70 ml-2">
              ID: {travelId}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* 각 패널 토글 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLeftPanel}
            className="flex items-center gap-1"
            disabled={
              [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
                Boolean
              ).length === 1 && leftPanelVisible
            }
          >
            <MapIcon className="h-4 w-4" />
            {leftPanelVisible ? (
              <EyeOffIcon className="h-3 w-3" />
            ) : (
              <EyeIcon className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMiddlePanel}
            className="flex items-center gap-1"
            disabled={
              [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
                Boolean
              ).length === 1 && middlePanelVisible
            }
          >
            <ListIcon className="h-4 w-4" />
            {middlePanelVisible ? (
              <EyeOffIcon className="h-3 w-3" />
            ) : (
              <EyeIcon className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRightPanel}
            className="flex items-center gap-1"
            disabled={
              [leftPanelVisible, middlePanelVisible, rightPanelVisible].filter(
                Boolean
              ).length === 1 && rightPanelVisible
            }
          >
            <MessageCircleIcon className="h-4 w-4" />
            {rightPanelVisible ? (
              <EyeOffIcon className="h-3 w-3" />
            ) : (
              <EyeIcon className="h-3 w-3" />
            )}
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback className="bg-accent/30 text-accent-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content with Resizable Layout */}
      <div className="w-full mt-14">
        <ResizableLayout
          leftContent={leftPanelContent}
          middleContent={middlePanelContent}
          rightContent={rightPanelContent}
          leftVisible={leftPanelVisible}
          middleVisible={middlePanelVisible}
          rightVisible={rightPanelVisible}
          onVisibilityChange={handlePanelVisibilityChange}
        />
      </div>
    </div>
  );
}
