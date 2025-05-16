"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  addHours,
  isBefore,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AddEventForm } from "./add-event-form";
import { LikedPlace } from "@/app/modules/map/store/liked-place-store";

export type ScheduleItem = {
  id: string;
  placeId?: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: "Food" | "Tour" | "Stay" | "Move" | "Etc";
  description?: string;
  color?: string;
};

interface WeeklyScheduleViewProps {
  scheduleItems: ScheduleItem[];
  places: LikedPlace[];
  onAddEvent: (event: Omit<ScheduleItem, "id" | "color">) => void;
}

// 시간 간격 (30분 단위)
const HOUR_INTERVALS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return { hour, minute };
});

// 이벤트 유형별 색상
const TYPE_COLORS = {
  Food: "#F59E0B",
  Tour: "#88C58F",
  Stay: "#60A5FA",
  Move: "#A78BFA",
  Etc: "#94A3B8",
};

export function WeeklyScheduleView({
  scheduleItems,
  places,
  onAddEvent,
}: WeeklyScheduleViewProps) {
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);

  // 현재 주의 날짜들
  const daysOfWeek = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  });

  // 이전/다음 주로 이동
  const goToPreviousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const goToNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  // 특정 시간에 해당하는 일정 찾기
  const getEventsForTimeSlot = (day: Date, hour: number, minute: number) => {
    const timeSlot = new Date(day);
    timeSlot.setHours(hour, minute, 0, 0);

    return scheduleItems.filter((event) => {
      const eventDay = new Date(event.date);
      eventDay.setHours(0, 0, 0, 0);
      const dayMatches = isSameDay(day, eventDay);

      if (!dayMatches) return false;

      const slotStart = new Date(timeSlot);
      const slotEnd = addHours(slotStart, 0.5); // 30분 간격

      // 이벤트가 이 시간 슬롯에 포함되는지 확인
      return (
        (isBefore(event.startTime, slotEnd) ||
          isSameDay(event.startTime, slotEnd)) &&
        (isAfter(event.endTime, slotStart) ||
          isSameDay(event.endTime, slotStart))
      );
    });
  };

  // 새 일정 추가
  const handleAddEvent = (eventData: Omit<ScheduleItem, "id" | "color">) => {
    onAddEvent(eventData);
    setShowAddEventDialog(false);
  };

  return (
    <div className="bg-background rounded-lg p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Trip Schedule</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {format(weekStart, "MMM d")} -{" "}
            {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-8 gap-1 mb-2 sticky top-0 bg-background z-10">
        <div className="text-center text-xs font-medium text-muted-foreground p-1 border-r">
          시간
        </div>
        {daysOfWeek.map((day) => (
          <Button
            key={day.toISOString()}
            variant={isSameDay(day, selectedDate) ? "default" : "outline"}
            className={cn(
              "h-10 p-0 text-xs",
              isSameDay(day, new Date()) &&
              !isSameDay(day, selectedDate) &&
              "border-primary text-primary"
            )}
            onClick={() => setSelectedDate(day)}
          >
            <div className="flex flex-col items-center">
              <span>{format(day, "EEE")}</span>
              <span>{format(day, "d")}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* 시간별 일정 그리드 */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {/* 시간 열 */}
          <div className="space-y-1">
            {HOUR_INTERVALS.map(({ hour, minute }, index) => (
              <div
                key={`time-${hour}-${minute}`}
                className={cn(
                  "text-xs text-right pr-2 h-12 flex items-center justify-end border-r",
                  minute === 0
                    ? "font-medium"
                    : "text-muted-foreground text-[10px]"
                )}
              >
                {minute === 0 && `${hour}:00`}
              </div>
            ))}
          </div>

          {/* 각 요일 열 */}
          {daysOfWeek.map((day) => (
            <div key={day.toISOString()} className="space-y-1 relative">
              {HOUR_INTERVALS.map(({ hour, minute }, index) => {
                const events = getEventsForTimeSlot(day, hour, minute);
                return (
                  <div
                    key={`slot-${day.toISOString()}-${hour}-${minute}`}
                    className={cn(
                      "h-12 border border-dashed border-border/40 rounded-sm p-0.5",
                      events.length > 0 && "bg-muted/30"
                    )}
                  >
                    {events.map((event) => {
                      // 이벤트가 이 시간 슬롯에서 시작하는지 확인
                      const eventStartsHere =
                        event.startTime.getHours() === hour &&
                        Math.floor(event.startTime.getMinutes() / 30) * 30 ===
                        minute;

                      if (!eventStartsHere) return null;

                      // 이벤트 지속 시간 계산 (30분 슬롯 단위)
                      const startSlot =
                        event.startTime.getHours() * 2 +
                        Math.floor(event.startTime.getMinutes() / 30);
                      const endSlot =
                        event.endTime.getHours() * 2 +
                        Math.floor(event.endTime.getMinutes() / 30);
                      const durationInSlots = endSlot - startSlot;

                      // 최소 높이 보장
                      const heightInSlots = Math.max(1, durationInSlots);

                      return (
                        <div
                          key={event.id}
                          className="absolute rounded-md p-1 overflow-hidden text-xs"
                          style={{
                            backgroundColor: `${TYPE_COLORS[event.type]}20`,
                            borderLeft: `3px solid ${TYPE_COLORS[event.type]}`,
                            top: `${index * 3}rem`,
                            height: `${heightInSlots * 3}rem`,
                            left: "0.125rem",
                            right: "0.125rem",
                            zIndex: 5,
                          }}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {format(event.startTime, "HH:mm")} -{" "}
                            {format(event.endTime, "HH:mm")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 일정 추가 버튼 */}
      <div className="mt-4 flex justify-end">
        <Button
          size="sm"
          onClick={() => setShowAddEventDialog(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" /> Add Schedule
        </Button>
      </div>

      {/* 일정 추가 다이얼로그 */}
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>Add New Schedule</DialogTitle>
          <AddEventForm
            selectedDate={selectedDate}
            onAddEvent={handleAddEvent}
            onCancel={() => setShowAddEventDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
