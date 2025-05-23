"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { ConfirmFormSchema } from "../../lib/confirm-form-schema";
import { useForm, UseFormReturn } from "react-hook-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LikedPlace } from "@/app/modules/map/store/liked-place-store";
import type { ScheduleItem } from "@/components/weekly-schedule-view";
import { fetchAuth } from "@/lib/fetch-auth";

interface ConfirmFormProps {
  place: LikedPlace;
  onToggleConfirmed: (place: LikedPlace) => void;
  onAddEvent?: (event: Omit<ScheduleItem, "id" | "color">) => void;
}

export function ConfirmForm({ place, onToggleConfirmed, onAddEvent }: ConfirmFormProps) {
  const form = useForm<z.infer<typeof ConfirmFormSchema>>({
    resolver: zodResolver(ConfirmFormSchema),
  });

  async function onSubmit(data: z.infer<typeof ConfirmFormSchema>) {
    // 확인(confirm) 처리
    toast.success("Confirmed!");
    onToggleConfirmed(place);

    // 이벤트(스케줄) 추가
    if (onAddEvent && data.startDate && data.endDate) {
      const event: Omit<ScheduleItem, "id" | "color"> = {
        title: place.name,
        date: new Date(data.startDate),
        startTime: new Date(data.startDate),
        endTime: new Date(data.endDate),
        type: place.type as "Food" | "Tour" | "Stay" | "Move" | "Etc",
        description: place.address,
        // placeId: place.id
      };

      onAddEvent(event);
      toast.success("Added to schedule!");
    }

    console.log(data);

    // Prepare API request payload
    const requestBody = {
      title: place.name,
      address: place.address,
      content: place.content,
      type: place.type || "Tour",
      rating: place.rating,
      iconType: "STAR",
      placeId: place.placeId,
      schedule: {
        startTime: data.startDate.toISOString(),
        endTime: data.endDate.toISOString()
      },
      lat: place.lat,
      lng: place.lng,
    }

    // Make API request using fetchAuth instead of useApi
    // Extract chatRoomId from URL query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const chatRoomId = searchParams.get('id');

    if (!chatRoomId) {
      toast.error("Chat room ID not found");
      return;
    }

    const response = await fetchAuth(`/maps/${chatRoomId}/pins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

  }

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <DateTimePickerField
          name="startDate"
          label="Start Date & Time (AM / PM)"
          onDateSelect={handleDateSelect}
          onTimeChange={handleTimeChange}
          form={form}
        />
        <DateTimePickerField
          name="endDate"
          label="End Date & Time (AM / PM)"
          onDateSelect={handleDateSelect}
          onTimeChange={handleTimeChange}
          form={form}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

interface DateTimePickerFieldProps {
  name: "startDate" | "endDate";
  label: string;
  onDateSelect: (
    field: "startDate" | "endDate",
    date: Date | undefined
  ) => void;
  onTimeChange: (
    field: "startDate" | "endDate",
    type: "hour" | "minute" | "ampm",
    value: string
  ) => void;
  form: UseFormReturn<z.infer<typeof ConfirmFormSchema>>;
}

function DateTimePickerField({
  name,
  label,
  onDateSelect,
  onTimeChange,
  form,
}: DateTimePickerFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
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
                  onSelect={(date) => onDateSelect(name, date)}
                  initialFocus
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1)
                        // .reverse()
                        .map((hour) => (
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
                              onTimeChange(name, "hour", hour.toString())
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
                              onTimeChange(name, "minute", minute.toString())
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
                          onClick={() => onTimeChange(name, "ampm", ampm)}
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
  );
}
