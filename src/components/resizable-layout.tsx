"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizableLayoutProps {
  leftContent: React.ReactNode;
  middleContent: React.ReactNode;
  rightContent: React.ReactNode;
  defaultLeftWidth?: number;
  defaultMiddleWidth?: number;
  defaultRightWidth?: number;
  minLeftWidth?: number;
  minMiddleWidth?: number;
  minRightWidth?: number;
  leftVisible: boolean;
  middleVisible: boolean;
  rightVisible: boolean;
  onVisibilityChange?: (
    panel: "left" | "middle" | "right",
    visible: boolean
  ) => void;
}

export function ResizableLayout({
  leftContent,
  middleContent,
  rightContent,
  defaultLeftWidth = 56,
  defaultMiddleWidth = 24,
  defaultRightWidth = 20,
  minLeftWidth = 12,
  minMiddleWidth = 12,
  minRightWidth = 12,
  leftVisible,
  middleVisible,
  rightVisible,
  onVisibilityChange,
}: ResizableLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [middleWidth, setMiddleWidth] = useState(defaultMiddleWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);

  // Store previous widths to restore when panels are toggled back on
  const [prevLeftWidth, setPrevLeftWidth] = useState(defaultLeftWidth);
  const [prevMiddleWidth, setPrevMiddleWidth] = useState(defaultMiddleWidth);
  const [prevRightWidth, setPrevRightWidth] = useState(defaultRightWidth);

  // 이전 가시성 상태를 저장하여 변경 여부를 감지
  const prevVisibilityRef = useRef({
    left: leftVisible,
    middle: middleVisible,
    right: rightVisible,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // 리사이즈 시작
  const startResizingLeft = () => {
    setIsResizingLeft(true);
  };

  const startResizingRight = () => {
    setIsResizingRight(true);
  };

  // 리사이즈 종료
  const stopResizing = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  // Calculate visible panel count
  const visiblePanelCount = [leftVisible, middleVisible, rightVisible].filter(
    Boolean
  ).length;

  // 패널 가시성이 변경될 때만 너비 재계산
  useEffect(() => {
    const prevVisibility = prevVisibilityRef.current;

    // 가시성 상태가 변경된 경우에만 처리
    if (
      prevVisibility.left !== leftVisible ||
      prevVisibility.middle !== middleVisible ||
      prevVisibility.right !== rightVisible
    ) {
      // 현재 가시성 상태 업데이트
      prevVisibilityRef.current = {
        left: leftVisible,
        middle: middleVisible,
        right: rightVisible,
      };

      // 최소 1개의 패널은 항상 표시되어야 함
      if (visiblePanelCount === 0) {
        console.warn("At least one panel must be visible.");
        return;
      }

      // 패널이 표시되는 경우 이전 너비 저장
      if (leftVisible)
        setPrevLeftWidth(leftWidth > 0 ? leftWidth : prevLeftWidth);
      if (middleVisible)
        setPrevMiddleWidth(middleWidth > 0 ? middleWidth : prevMiddleWidth);
      if (rightVisible)
        setPrevRightWidth(rightWidth > 0 ? rightWidth : prevRightWidth);

      // 새 너비 계산
      let newLeftWidth = leftVisible ? prevLeftWidth : 0;
      let newMiddleWidth = middleVisible ? prevMiddleWidth : 0;
      let newRightWidth = rightVisible ? prevRightWidth : 0;

      // 모든 패널이 표시되는 경우
      if (leftVisible && middleVisible && rightVisible) {
        const total = prevLeftWidth + prevMiddleWidth + prevRightWidth;
        newLeftWidth = (prevLeftWidth / total) * 100;
        newMiddleWidth = (prevMiddleWidth / total) * 100;
        newRightWidth = (prevRightWidth / total) * 100;
      }
      // 하나의 패널만 표시되는 경우
      else if (visiblePanelCount === 1) {
        newLeftWidth = leftVisible ? 100 : 0;
        newMiddleWidth = middleVisible ? 100 : 0;
        newRightWidth = rightVisible ? 100 : 0;
      }
      // 두 개의 패널이 표시되는 경우
      else if (visiblePanelCount === 2) {
        if (!leftVisible) {
          // 중앙과 오른쪽 패널만 표시
          const total = prevMiddleWidth + prevRightWidth;
          if (total > 0) {
            newMiddleWidth = (prevMiddleWidth / total) * 100;
            newRightWidth = (prevRightWidth / total) * 100;
          } else {
            newMiddleWidth = 50;
            newRightWidth = 50;
          }
        } else if (!middleVisible) {
          // 왼쪽과 오른쪽 패널만 표시
          const total = prevLeftWidth + prevRightWidth;
          if (total > 0) {
            newLeftWidth = (prevLeftWidth / total) * 100;
            newRightWidth = (prevRightWidth / total) * 100;
          } else {
            newLeftWidth = 50;
            newRightWidth = 50;
          }
        } else {
          // 왼쪽과 중앙 패널만 표시
          const total = prevLeftWidth + prevMiddleWidth;
          if (total > 0) {
            newLeftWidth = (prevLeftWidth / total) * 100;
            newMiddleWidth = (prevMiddleWidth / total) * 100;
          } else {
            newLeftWidth = 50;
            newMiddleWidth = 50;
          }
        }
      }

      // 너비 업데이트
      setLeftWidth(newLeftWidth);
      setMiddleWidth(newMiddleWidth);
      setRightWidth(newRightWidth);
    }
  }, [leftVisible, middleVisible, rightVisible]);

  // 리사이즈 처리
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;

      if (isResizingLeft && leftVisible && middleVisible) {
        // 왼쪽 패널과 중앙 패널 사이의 리사이즈
        const leftPanelWidth =
          ((e.clientX - containerRect.left) / containerWidth) * 100;

        // 최소 너비 체크
        if (leftPanelWidth < minLeftWidth) {
          // 최소 너비보다 작아지면 패널 숨기기
          // 단, 최소 1개의 패널은 유지해야 함
          const visibleCount = [true, middleVisible, rightVisible].filter(
            Boolean
          ).length;
          if (visibleCount > 1 && onVisibilityChange) {
            onVisibilityChange("left", false);
          }
          return;
        }

        // 중앙 패널이 최소 너비보다 작아질 경우
        const newMiddleWidth = middleVisible
          ? rightVisible
            ? 100 - leftPanelWidth - rightWidth
            : 100 - leftPanelWidth
          : 0;

        if (newMiddleWidth < minMiddleWidth) {
          // 최소 너비보다 작아지면 패널 숨기기
          // 단, 최소 1개의 패널은 유지해야 함
          const visibleCount = [leftVisible, true, rightVisible].filter(
            Boolean
          ).length;
          if (visibleCount > 1 && onVisibilityChange) {
            onVisibilityChange("middle", false);
          }
          return;
        }

        // 정상적인 리사이즈
        setLeftWidth(leftPanelWidth);
        setMiddleWidth(newMiddleWidth);
      }

      if (isResizingRight && middleVisible && rightVisible) {
        // 중앙 패널과 오른쪽 패널 사이의 리사이즈
        const rightEdgePosition = containerRect.right - e.clientX;
        const rightPanelWidth = (rightEdgePosition / containerWidth) * 100;

        // 최소 너비 체크
        if (rightPanelWidth < minRightWidth) {
          // 최소 너비보다 작아지면 패널 숨기기
          // 단, 최소 1개의 패널은 유지해야 함
          const visibleCount = [leftVisible, middleVisible, true].filter(
            Boolean
          ).length;
          if (visibleCount > 1 && onVisibilityChange) {
            onVisibilityChange("right", false);
          }
          return;
        }

        // 중앙 패널이 최소 너비보다 작아질 경우
        const newMiddleWidth = middleVisible
          ? leftVisible
            ? 100 - leftWidth - rightPanelWidth
            : 100 - rightPanelWidth
          : 0;

        if (newMiddleWidth < minMiddleWidth) {
          // 최소 너비보다 작아지면 패널 숨기기
          // 단, 최소 1개의 패널은 유지해야 함
          const visibleCount = [leftVisible, true, rightVisible].filter(
            Boolean
          ).length;
          if (visibleCount > 1 && onVisibilityChange) {
            onVisibilityChange("middle", false);
          }
          return;
        }

        // 정상적인 리사이즈
        setRightWidth(rightPanelWidth);
        setMiddleWidth(newMiddleWidth);
      }
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", stopResizing);
    }

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [
    isResizingLeft,
    isResizingRight,
    leftWidth,
    middleWidth,
    rightWidth,
    minLeftWidth,
    minMiddleWidth,
    minRightWidth,
    leftVisible,
    middleVisible,
    rightVisible,
    onVisibilityChange,
  ]);

  // 오른쪽 리사이저 위치 계산
  const calculateRightResizerPosition = () => {
    let position = 0;
    if (leftVisible) position += leftWidth;
    if (middleVisible) position += middleWidth;
    return `${position}%`;
  };

  return (
    <div ref={containerRef} className="flex h-full w-full relative">
      {/* 왼쪽 패널 */}
      <div
        className={cn(
          "h-full transition-[width,opacity] duration-300 ease-in-out overflow-hidden",
          !leftVisible && "w-0 opacity-0"
        )}
        style={{ width: leftVisible ? `${leftWidth}%` : "0%" }}
      >
        {leftVisible && leftContent}
      </div>

      {/* 왼쪽 리사이즈 핸들 */}
      {leftVisible && middleVisible && (
        <div
          ref={leftResizeRef}
          className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-primary/20 cursor-col-resize z-10"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={startResizingLeft}
        />
      )}

      {/* 중앙 패널 */}
      <div
        className={cn(
          "h-full transition-[width,opacity] duration-300 ease-in-out overflow-hidden",
          !middleVisible && "w-0 opacity-0"
        )}
        style={{ width: middleVisible ? `${middleWidth}%` : "0%" }}
      >
        {middleVisible && middleContent}
      </div>

      {/* 오른쪽 리사이즈 핸들 */}
      {middleVisible && rightVisible && (
        <div
          ref={rightResizeRef}
          className="absolute top-0 bottom-0 w-1 bg-transparent hover:bg-primary/20 cursor-col-resize z-10"
          style={{ left: calculateRightResizerPosition() }}
          onMouseDown={startResizingRight}
        />
      )}

      {/* 오른쪽 패널 */}
      <div
        className={cn(
          "h-full transition-[width,opacity] duration-300 ease-in-out overflow-hidden",
          !rightVisible && "w-0 opacity-0"
        )}
        style={{ width: rightVisible ? `${rightWidth}%` : "0%" }}
      >
        {rightVisible && rightContent}
      </div>
    </div>
  );
}
