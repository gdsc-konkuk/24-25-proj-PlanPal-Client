import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addMinutes } from "date-fns"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type EventType = "Food" | "Tour" | "Stay" | "Move" | "Etc"

interface AddEventFormProps {
  selectedDate: Date
  onAddEvent: (event: {
    title: string
    date: Date
    startTime: Date
    endTime: Date
    type: EventType
    description?: string
  }) => void
  onCancel: () => void
}

export function AddEventForm({ selectedDate, onAddEvent, onCancel }: AddEventFormProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date | undefined>(selectedDate)
  const [startTime, setStartTime] = useState("09:00")
  const [duration, setDuration] = useState("60")
  const [eventType, setEventType] = useState<EventType>("Tour")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !date || !startTime || !duration) return

    // Parse start time
    const [hours, minutes] = startTime.split(":").map(Number)
    const startDateTime = new Date(date)
    startDateTime.setHours(hours, minutes, 0, 0)

    // Calculate end time based on duration
    const endDateTime = addMinutes(startDateTime, Number.parseInt(duration))

    onAddEvent({
      title,
      date,
      startTime: startDateTime,
      endTime: endDateTime,
      type: eventType,
      description: description || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-title">Title</Label>
        <Input
          id="event-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ex) Tour into the Konkuk University"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy.MM.dd") : "select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-type">Type</Label>
          <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
            <SelectTrigger id="event-type">
              <SelectValue placeholder="select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Tour">Tour</SelectItem>
              <SelectItem value="Stay">Stay</SelectItem>
              <SelectItem value="Move">Move</SelectItem>
              <SelectItem value="Etc">Etc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1 hour 30 min</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
              <SelectItem value="180">3 hours</SelectItem>
              <SelectItem value="240">4 hours</SelectItem>
              <SelectItem value="360">6 hours</SelectItem>
              <SelectItem value="480">8 hours</SelectItem>
              <SelectItem value="720">12 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">Description (Optional)</Label>
        <Input
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional information about the event"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Event</Button>
      </div>
    </form>
  )
}

