"use client";

import { useState, useMemo } from "react";
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
import { usePanelVisibilityStore } from "../store/panel-visibility-store";

export default function Chat() {
  const searchParams = useSearchParams();
  const travelId = searchParams.get("id");
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = accessToken ? parseJwt(accessToken).name : "User";

  const [inputValue, setInputValue] = useState("");

  // 패널 가시성 상태를 zustand 스토어에서 가져옴
  const {
    leftPanelVisible,
    middlePanelVisible,
    rightPanelVisible,
    setPanelVisibility,
    togglePanel,
  } = usePanelVisibilityStore();

  // 패널 가시성에 따라 동적으로 defaultWidth 값 계산
  const { defaultLeftWidth, defaultMiddleWidth, defaultRightWidth } =
    useMemo(() => {
      // 활성화된 패널 수 계산
      const visibleCount = [
        leftPanelVisible,
        middlePanelVisible,
        rightPanelVisible,
      ].filter(Boolean).length;

      if (visibleCount === 1) {
        // 하나의 패널만 보이는 경우, 해당 패널의 너비를 100%로 설정
        return {
          defaultLeftWidth: leftPanelVisible ? 100 : 0,
          defaultMiddleWidth: middlePanelVisible ? 100 : 0,
          defaultRightWidth: rightPanelVisible ? 100 : 0,
        };
      } else if (visibleCount === 2) {
        // 두 개의 패널이 보이는 경우, 각각 50%씩 할당
        return {
          defaultLeftWidth: leftPanelVisible ? 50 : 0,
          defaultMiddleWidth: middlePanelVisible ? 50 : 0,
          defaultRightWidth: rightPanelVisible ? 50 : 0,
        };
      } else {
        // 세 개의 패널이 모두 보이는 경우 또는 모두 숨겨진 경우(예외 처리)
        return {
          defaultLeftWidth: 56,
          defaultMiddleWidth: 24,
          defaultRightWidth: 20,
        };
      }
    }, [leftPanelVisible, middlePanelVisible, rightPanelVisible]);

  const [activeLeftTab, setActiveLeftTab] = useState("map");
  const [activePlacesTab, setActivePlacesTab] =
    useState<PlacesTabType>("confirmed");
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  const likedPlaces = useLikedPlaces((state) => state.likedPlaces);

  const sendMessage = useWebSocketStore((state) => state.sendMessage);
  const chatMessages = useWebSocketStore((state) => state.chatMessages);
  const addMessage = useWebSocketStore((state) => state.addMessage);
  const [isComposing, setIsComposing] = useState(false);

  // 패널 가시성 변경 핸들러 - 스토어의 함수 사용
  const handlePanelVisibilityChange = (
    panel: "left" | "middle" | "right",
    visible: boolean
  ) => {
    setPanelVisibility(panel, visible);
  };

  // 패널 토글 핸들러 - 스토어의 함수 사용
  const toggleLeftPanel = () => togglePanel("left");
  const toggleMiddlePanel = () => togglePanel("middle");
  const toggleRightPanel = () => togglePanel("right");

  const handleSendMessage = (type: "chat" | "aiRequest") => {
    if (!inputValue.trim()) return;

    console.log(type);

    const userMessage: ChatMessage = {
      type,
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
      handleSendMessage("chat");
    }
  };

  // 새 일정 추가
  const handleAddEvent = (eventData: Omit<ScheduleItem, "id" | "color">) => {
    const newEvent: ScheduleItem = {
      id: `schedule-${Date.now()}`,
      ...eventData,
      placeId: eventData.placeId || `temp-${Date.now()}`, // Provide a fallback for placeId
      color:
        eventData.type === "Food"
          ? "#F59E0B"
          : eventData.type === "Tour"
          ? "#88C58F"
          : eventData.type === "Stay"
          ? "#60A5FA"
          : eventData.type === "Move"
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
          key={`panels-${leftPanelVisible ? 1 : 0}-${
            middlePanelVisible ? 1 : 0
          }-${rightPanelVisible ? 1 : 0}`}
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
              onAddEvent={handleAddEvent}
            />
          }
          rightContent={
            <RightPanel
              messages={chatMessages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onAIRequest={handleSendMessage}
              onKeyDown={handleKeyDown}
              onSetIsComposing={(value) => setIsComposing(value)}
            />
          }
          defaultLeftWidth={defaultLeftWidth}
          defaultMiddleWidth={defaultMiddleWidth}
          defaultRightWidth={defaultRightWidth}
          leftVisible={leftPanelVisible}
          middleVisible={middlePanelVisible}
          rightVisible={rightPanelVisible}
          onVisibilityChange={handlePanelVisibilityChange}
        />
      </div>
    </div>
  );
}
