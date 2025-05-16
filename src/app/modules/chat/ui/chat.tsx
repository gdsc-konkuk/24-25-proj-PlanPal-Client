"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResizableLayout } from "@/components/resizable-layout";
import { useLikedPlaces } from "@/app/modules/map/store/liked-place-store";
import { MessageType, ParticipantType, PlacesTabType } from "../types";
import { LeftPanel } from "./left-panel";
import { MiddlePanel } from "./middle-panel";
import { RightPanel } from "./right-panel";
import { ChatHeader } from "./components/chat-header";
import type { ScheduleItem } from "@/components/weekly-schedule-view";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";

export default function Chat() {
  const searchParams = useSearchParams();
  const travelId = searchParams.get("id");
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = accessToken ? parseJwt(accessToken).name : "User";

  // State variables
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      sender: {
        id: "ai",
        name: "PlanPal AI",
      },
      content:
        "Welcome to your group travel planning session! I'm your AI travel assistant. Tell me where you're thinking of going, and I can help with suggestions, cultural insights, and local recommendations. You can also invite friends to join this planning session!",
      timestamp: new Date(),
      isAI: true,
    },
  ]);
  const [participants, setParticipants] = useState<ParticipantType[]>([
    { id: "user1", name: currentUser, isAI: false, isOnline: true },
    { id: "ai", name: "PlanPal AI", isAI: true, isOnline: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [destination, setDestination] = useState("");

  // 패널 가시성 상태
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [middlePanelVisible, setMiddlePanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  const [activeLeftTab, setActiveLeftTab] = useState("map");
  const [activePlacesTab, setActivePlacesTab] =
    useState<PlacesTabType>("confirmed");
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  const likedPlaces = useLikedPlaces((state) => state.likedPlaces);

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      sender: {
        id: "user1",
        name: currentUser,
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
          type: "관광" as "식사" | "관광" | "숙박" | "이동" | "기타",
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
          name: "PlanPal AI",
        },
        content: aiResponse,
        timestamp: new Date(),
        isAI: true,
        containsPlace: !!placeInfo,
        placeInfo: placeInfo || undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
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

  const toggleConfirmed = (placeId: string) => {
    // 장소의 확정 여부 토글 로직
    console.log("Toggle confirmed for:", placeId);
  };

  const toggleFavorite = (placeId: string) => {
    // 장소의 즐겨찾기 여부 토글 로직
    console.log("Toggle favorite for:", placeId);
  };

  // 새 일정 추가
  const handleAddEvent = (eventData: Omit<ScheduleItem, "id" | "color">) => {
    const newEvent: ScheduleItem = {
      id: `schedule-${Date.now()}`,
      ...eventData,
      placeId: eventData.placeId || `temp-${Date.now()}`, // Provide a fallback for placeId
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

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Header */}
      <ChatHeader
        travelId={travelId}
        leftPanelVisible={leftPanelVisible}
        middlePanelVisible={middlePanelVisible}
        rightPanelVisible={rightPanelVisible}
        onToggleLeftPanel={toggleLeftPanel}
        onToggleMiddlePanel={toggleMiddlePanel}
        onToggleRightPanel={toggleRightPanel}
      />

      {/* Main Content with Resizable Layout */}
      <div className="w-full mt-14">
        <ResizableLayout
          leftContent={
            <LeftPanel
              activeTab={activeLeftTab}
              onTabChange={setActiveLeftTab}
              scheduleItems={scheduleItems}
              places={likedPlaces}
              onAddEvent={handleAddEvent}
            />
          }
          middleContent={
            <MiddlePanel
              likedPlaces={likedPlaces}
              activePlacesTab={activePlacesTab}
              onActivePlacesTabChange={setActivePlacesTab}
            />
          }
          rightContent={
            <RightPanel
              messages={messages}
              participants={participants}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSendMessage={handleSendMessage}
              onKeyDown={handleKeyDown}
              onToggleConfirmed={toggleConfirmed}
              onToggleFavorite={toggleFavorite}
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
}
