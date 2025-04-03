import type React from "react";
import { useState } from "react";
import { addMinutes, format } from "date-fns";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventType = "식사" | "관광" | "숙박" | "이동" | "기타";

interface AddEventFormProps {
  selectedDate: Date;
  onAddEvent: (event: {
    title: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    type: EventType;
    description?: string;
  }) => void;
  onCancel: () => void;
}

export function AddEventForm({
  selectedDate,
  onAddEvent,
  onCancel,
}: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [eventType, setEventType] = useState<EventType>("관광");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !startTime || !duration) return;

    // Parse start time
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Calculate end time based on duration
    const endDateTime = addMinutes(startDateTime, Number.parseInt(duration));

    onAddEvent({
      title,
      date,
      startTime: startDateTime,
      endTime: endDateTime,
      type: eventType,
      description: description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-title">일정 제목</Label>
        <Input
          id="event-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 도쿄 스카이트리 방문"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>날짜</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy년 MM월 dd일") : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-type">일정 유형</Label>
          <Select
            value={eventType}
            onValueChange={(value) => setEventType(value as EventType)}
          >
            <SelectTrigger id="event-type">
              <SelectValue placeholder="유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="식사">식사</SelectItem>
              <SelectItem value="관광">관광</SelectItem>
              <SelectItem value="숙박">숙박</SelectItem>
              <SelectItem value="이동">이동</SelectItem>
              <SelectItem value="기타">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">시작 시간</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">소요 시간 (분)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="소요 시간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30분</SelectItem>
              <SelectItem value="60">1시간</SelectItem>
              <SelectItem value="90">1시간 30분</SelectItem>
              <SelectItem value="120">2시간</SelectItem>
              <SelectItem value="180">3시간</SelectItem>
              <SelectItem value="240">4시간</SelectItem>
              <SelectItem value="360">6시간</SelectItem>
              <SelectItem value="480">8시간</SelectItem>
              <SelectItem value="720">12시간</SelectItem>
              <SelectItem value="1440">24시간</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">설명 (선택사항)</Label>
        <Input
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="일정에 대한 추가 정보"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">일정 추가</Button>
      </div>
    </form>
  );
}
