"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResizableLayout } from "@/components/resizable-layout";
import { useLikedPlaces } from "@/app/modules/map/store/liked-place-store";
import { ChatMessage, PlacesTabType } from "../types";
import { LeftPanel } from "./left-panel";
import { MiddlePanel } from "./middle-panel";
import { RightPanel } from "./right-panel";
import { ChatHeader } from "./components/chat-header";
import type { ScheduleItem } from "@/components/weekly-schedule-view";
import { useAuthStore } from "@/store/auth-store";
import { parseJwt } from "@/lib/parseJwt";
import { WebSocketInitializer } from "../initializer/websocket-initializer";
import { useWebSocketStore } from "../store/websocket-store";

export default function Chat() {
  const searchParams = useSearchParams();
  const travelId = searchParams.get("id");
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = accessToken ? parseJwt(accessToken).name : "User";

  const [inputValue, setInputValue] = useState("");

  // 패널 가시성 상태
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [middlePanelVisible, setMiddlePanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  const [activeLeftTab, setActiveLeftTab] = useState("map");
  const [activePlacesTab, setActivePlacesTab] =
    useState<PlacesTabType>("confirmed");
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  const likedPlaces = useLikedPlaces((state) => state.likedPlaces);

  const sendMessage = useWebSocketStore((state) => state.sendMessage);
  const chatMessages = useWebSocketStore((state) => state.chatMessages);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const [isComposing, setIsComposing] = useState(false);

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

    const userMessage: ChatMessage = {
      type: "chat",
      senderName: currentUser,
      text: inputValue,
      sendAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    sendMessage("chat", inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
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
      <WebSocketInitializer roomId={travelId!} />
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
              messages={chatMessages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSendMessage={handleSendMessage}
              onKeyDown={handleKeyDown}
              onSetIsComposing={(value) => setIsComposing(value)}
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
