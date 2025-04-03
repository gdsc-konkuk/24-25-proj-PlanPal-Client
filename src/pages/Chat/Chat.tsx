// src/pages/Chat/Chat.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ResizableLayout } from "@/components/resizable-layout";

import ChatHeader from "./components/ChatHeader";
import LeftPanel from "./components/LeftPanel";
import MiddlePanel from "./components/MiddlePanel";
import RightPanel from "./components/RightPanel";
import { MessageType, ParticipantType, PlaceInfo, ScheduleItem } from "./types";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
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
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 패널 가시성 상태
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [middlePanelVisible, setMiddlePanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  // 패널 콘텐츠 탭 상태
  const [activeLeftTab, setActiveLeftTab] = useState("map");
  const [activePlacesTab, setActivePlacesTab] = useState("confirmed");
  const [placeFilter, setPlaceFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  // 패널 가시성 변경 핸들러
  const handlePanelVisibilityChange = (
    panel: "left" | "middle" | "right",
    visible: boolean,
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

  // 패널 토글 핸들러
  const toggleLeftPanel = () => {
    const visibleCount = [
      leftPanelVisible,
      middlePanelVisible,
      rightPanelVisible,
    ].filter(Boolean).length;
    if (visibleCount === 1 && leftPanelVisible) return;
    setLeftPanelVisible(!leftPanelVisible);
  };

  const toggleMiddlePanel = () => {
    const visibleCount = [
      leftPanelVisible,
      middlePanelVisible,
      rightPanelVisible,
    ].filter(Boolean).length;
    if (visibleCount === 1 && middlePanelVisible) return;
    setMiddlePanelVisible(!middlePanelVisible);
  };

  const toggleRightPanel = () => {
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

  // Sample places data
  useEffect(() => {
    if (destination.toLowerCase().includes("tokyo")) {
      // Tokyo places data setup
      setPlaces([
        {
          id: "place1",
          name: "Tokyo Skytree",
          lat: 35.7101,
          lng: 139.8107,
          address: "1 Chome-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan",
          description:
            "The tallest tower in Japan with observation decks offering panoramic views of Tokyo.",
          category: "Landmark",
          rating: 4.5,
          isFavorite: true,
          isConfirmed: true,
          addedBy: "You",
          addedAt: new Date(2023, 5, 15),
          visitTime: new Date(2023, 5, 15, 10, 0),
          duration: 120,
          type: "관광",
        },
        // ... more places (add other places data here)
      ]);
      setDestination("Tokyo, Japan");

      // Sample schedule items
      const sampleScheduleItems: ScheduleItem[] = [
        {
          id: "schedule1",
          placeId: "place1",
          title: "Tokyo Skytree 관람",
          date: new Date(2023, 5, 15),
          startTime: new Date(2023, 5, 15, 10, 0),
          endTime: new Date(2023, 5, 15, 12, 0),
          type: "관광",
          color: "#88C58F",
        },
        // ... more schedule items (add other schedule data here)
      ];
      setScheduleItems(sampleScheduleItems);
    }
  }, [destination]);

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

    // Simulate AI response with setTimeout
    setTimeout(() => {
      // AI response logic
      // ...
    }, 1000);
  };

  const checkForPlaceMention = (message: string): boolean => {
    const placePrefixes = ["let's go to", "visit", "check out", "explore"];
    return placePrefixes.some((prefix) =>
      message.toLowerCase().includes(prefix),
    );
  };

  const extractPlaceName = (message: string): string => {
    const placePrefixes = ["let's go to", "visit", "check out", "explore"];
    let placeName = "";

    for (const prefix of placePrefixes) {
      if (message.toLowerCase().includes(prefix)) {
        const startIndex =
          message.toLowerCase().indexOf(prefix) + prefix.length;
        placeName = message.slice(startIndex).trim();
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
          : place,
      ),
    );
  };

  const toggleConfirmed = (placeId: string) => {
    setPlaces(
      places.map((place) =>
        place.id === placeId
          ? { ...place, isConfirmed: !place.isConfirmed }
          : place,
      ),
    );
  };

  // Handle adding a new event to the schedule
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

  // Filter places based on selected filters
  const filteredPlaces = places.filter((place) => {
    // First filter by confirmed/candidates tab
    const matchesTab =
      activePlacesTab === "confirmed" ? place.isConfirmed : !place.isConfirmed;

    // Then apply additional filters
    const matchesType = placeFilter === "all" || place.type === placeFilter;

    // Time filter
    let matchesTime = true;
    if (timeFilter !== "all" && place.visitTime) {
      const hour = place.visitTime.getHours();
      if (timeFilter === "morning" && (hour < 5 || hour >= 12))
        matchesTime = false;
      if (timeFilter === "afternoon" && (hour < 12 || hour >= 17))
        matchesTime = false;
      if (timeFilter === "evening" && (hour < 17 || hour >= 21))
        matchesTime = false;
      if (timeFilter === "night" && (hour < 21 || hour >= 5))
        matchesTime = false;
    }

    // Date filter
    let matchesDate = true;
    if (dateFilter && place.visitTime) {
      const visitDate = new Date(place.visitTime);
      const filterDate = new Date(dateFilter);
      matchesDate =
        visitDate.getFullYear() === filterDate.getFullYear() &&
        visitDate.getMonth() === filterDate.getMonth() &&
        visitDate.getDate() === filterDate.getDate();
    }

    return matchesTab && matchesType && matchesTime && matchesDate;
  });

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Header */}
      <ChatHeader
        travelId={travelId}
        toggleLeftPanel={toggleLeftPanel}
        toggleMiddlePanel={toggleMiddlePanel}
        toggleRightPanel={toggleRightPanel}
        leftPanelVisible={leftPanelVisible}
        middlePanelVisible={middlePanelVisible}
        rightPanelVisible={rightPanelVisible}
      />

      {/* Main Content with Resizable Layout */}
      <div className="w-full mt-14">
        <ResizableLayout
          leftContent={
            <LeftPanel
              activeLeftTab={activeLeftTab}
              setActiveLeftTab={setActiveLeftTab}
              places={places}
              scheduleItems={scheduleItems}
              onAddEvent={handleAddEvent}
            />
          }
          middleContent={
            <MiddlePanel
              activePlacesTab={activePlacesTab}
              setActivePlacesTab={setActivePlacesTab}
              placeFilter={placeFilter}
              setPlaceFilter={setPlaceFilter}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              filteredPlaces={filteredPlaces}
              toggleFavorite={toggleFavorite}
              toggleConfirmed={toggleConfirmed}
            />
          }
          rightContent={
            <RightPanel
              messages={messages}
              messagesEndRef={messagesEndRef}
              participants={participants.length}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleKeyDown={handleKeyDown}
              toggleFavorite={toggleFavorite}
              toggleConfirmed={toggleConfirmed}
            />
          }
          leftVisible={leftPanelVisible}
          middleVisible={middlePanelVisible}
          rightVisible={rightPanelVisible}
          onVisibilityChange={handlePanelVisibilityChange}
        />
      </div>
    </div>
  );
};

export default Chat;
