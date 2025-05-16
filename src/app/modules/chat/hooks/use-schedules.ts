import { useEffect, useState, useCallback } from "react";
import { fetchAuth } from "@/lib/fetch-auth";
import { useScheduleStore, ApiSchedule } from "../store/schedule-store";
import { useWebSocketStore } from "../store/websocket-store";

export function useSchedules(roomId: string) {
  const { refreshScheduleTrigger } = useWebSocketStore();
  const { schedules, isLoading, error, refreshTrigger, refreshSchedules } =
    useScheduleStore();
  const [localTrigger, setLocalTrigger] = useState(0);

  // Function to fetch schedules
  const fetchSchedules = useCallback(async () => {
    if (!roomId) return;

    try {
      useScheduleStore.setState({ isLoading: true, error: null });

      const response = await fetchAuth(`/schedules/maps/${roomId}`);

      if (response.ok) {
        const data = (await response.json()) as ApiSchedule[];

        // Transform ApiSchedule[] to ScheduleItem[]
        const transformedSchedules = data.map((schedule) => ({
          id: String(schedule.id),
          placeId: String(schedule.mapPin.id),
          title: schedule.mapPin.title,
          date: new Date(schedule.startTime),
          startTime: new Date(schedule.startTime),
          endTime: new Date(schedule.endTime),
          type: schedule.mapPin.type,
          description: schedule.mapPin.content,
        }));

        // Update the store with the transformed data
        useScheduleStore.setState({
          schedules: transformedSchedules,
          isLoading: false,
        });
      } else {
        throw new Error(`Failed to fetch schedules: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      useScheduleStore.setState({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedules",
        isLoading: false,
      });
    }
  }, [roomId]);

  // Force a refresh of the schedules
  const forceRefresh = useCallback(() => {
    setLocalTrigger((prev) => prev + 1);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Refresh when triggered by websocket, manual refresh, or local trigger
  useEffect(() => {
    if (refreshScheduleTrigger > 0 || refreshTrigger > 0 || localTrigger > 0) {
      fetchSchedules();
    }
  }, [refreshScheduleTrigger, refreshTrigger, localTrigger, fetchSchedules]);

  return {
    schedules,
    isLoading,
    error,
    refresh: refreshSchedules,
    forceRefresh,
    fetchSchedules,
  };
}
