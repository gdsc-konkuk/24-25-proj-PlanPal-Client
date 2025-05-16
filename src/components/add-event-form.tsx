import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLikedPlaces, LikedPlace } from "@/app/modules/map/store/liked-place-store"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useApi } from "@/hooks/use-api"
import { toast } from "sonner"
import { useWebSocketStore } from "@/app/modules/chat/store/websocket-store"

type EventType = "Food" | "Tour" | "Stay" | "Move" | "Etc"

// Predefined event colors
const EVENT_COLORS = [
  "#4f46e5", // indigo
  "#10b981", // emerald
  "#ef4444", // red
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

// Function to get a random color from the predefined colors
const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * EVENT_COLORS.length);
  return EVENT_COLORS[randomIndex];
};

interface AddEventFormProps {
  selectedDate: Date
  chatRoomId: string // Add chatRoomId prop
  onAddEvent: (event: {
    title: string
    date: Date
    startTime: Date
    endTime: Date
    type: EventType
    description?: string
    placeId?: string
    color: string
  }) => void
  onCancel: () => void
}

const eventFormSchema = z.object({
  placeId: z.string({
    required_error: "Please select a place",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
})

export function AddEventForm({ selectedDate, chatRoomId, onAddEvent, onCancel }: AddEventFormProps) {
  const likedPlaces = useLikedPlaces((state) => state.likedPlaces)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const api = useApi()
  const refreshScheduleTrigger = useWebSocketStore((state) => state.refreshScheduleTrigger)

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      startDate: selectedDate,
      endDate: new Date(selectedDate.getTime() + 60 * 60 * 1000), // Default to 1 hour later
    },
  })

  function handleDateSelect(
    field: "startDate" | "endDate",
    date: Date | undefined
  ) {
    if (date) {
      form.setValue(field, date);
    }
  }

  function handleTimeChange(
    field: "startDate" | "endDate",
    type: "hour" | "minute" | "ampm",
    value: string
  ) {
    const currentDate = form.getValues(field) || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue(field, newDate);
  }

  async function onSubmit(data: z.infer<typeof eventFormSchema>) {
    // Find the selected place details
    const selectedPlace = likedPlaces.find(place => place.placeId === data.placeId)

    if (!selectedPlace) return

    // Generate a random color for the event
    const eventColor = getRandomColor();

    try {
      setIsSubmitting(true)

      // Prepare API request payload
      const requestBody = {
        title: selectedPlace.name,
        address: selectedPlace.address,
        content: selectedPlace.content,
        type: selectedPlace.type || "Tour",
        rating: selectedPlace.rating,
        iconType: selectedPlace.iconType,
        placeId: selectedPlace.placeId,
        schedule: {
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString()
        }
      }

      // Make API request to add pin with schedule
      await api(`/maps/${chatRoomId}/pins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      // If API call is successful, add event to calendar
      onAddEvent({
        title: selectedPlace.name,
        date: data.startDate,
        startTime: data.startDate,
        endTime: data.endDate,
        type: (selectedPlace.type as EventType) || "Tour",
        placeId: selectedPlace.placeId,
        color: eventColor
      })

      toast.success("Event added to calendar")
      onCancel() // Close the form
    } catch (error) {
      console.error("Failed to add event:", error)
      toast.error("Failed to add event to calendar")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="placeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Place</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? likedPlaces.find((place) => place.placeId === field.value)?.name
                        : "Select a place"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search place..." />
                    <CommandEmpty>No place found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {likedPlaces.map((place) => (
                          <CommandItem
                            key={place.placeId}
                            value={place.placeId}
                            onSelect={() => {
                              form.setValue("placeId", place.placeId)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === place.placeId ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {place.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date & Time (AM / PM)</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy.MM.dd hh:mm aa")
                      ) : (
                        <span>YYYY.MM.DD  hh:mm  AM/PM</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => handleDateSelect("startDate", date)}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={
                                field.value &&
                                  field.value.getHours() % 12 === hour % 12
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() =>
                                handleTimeChange("startDate", "hour", hour.toString())
                              }
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i * 5).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value && field.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("startDate", "minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                      <ScrollArea className="">
                        <div className="flex sm:flex-col p-2">
                          {["AM", "PM"].map((ampm) => (
                            <Button
                              key={ampm}
                              size="icon"
                              variant={
                                field.value &&
                                  ((ampm === "AM" && field.value.getHours() < 12) ||
                                    (ampm === "PM" && field.value.getHours() >= 12))
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => handleTimeChange("startDate", "ampm", ampm)}
                            >
                              {ampm}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date & Time (AM / PM)</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy.MM.dd hh:mm aa")
                      ) : (
                        <span>YYYY.MM.DD  hh:mm  AM/PM</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => handleDateSelect("endDate", date)}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={
                                field.value &&
                                  field.value.getHours() % 12 === hour % 12
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() =>
                                handleTimeChange("endDate", "hour", hour.toString())
                              }
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i * 5).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value && field.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("endDate", "minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" className="sm:hidden" />
                      </ScrollArea>
                      <ScrollArea className="">
                        <div className="flex sm:flex-col p-2">
                          {["AM", "PM"].map((ampm) => (
                            <Button
                              key={ampm}
                              size="icon"
                              variant={
                                field.value &&
                                  ((ampm === "AM" && field.value.getHours() < 12) ||
                                    (ampm === "PM" && field.value.getHours() >= 12))
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => handleTimeChange("endDate", "ampm", ampm)}
                            >
                              {ampm}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

