import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { useScheduleStore, ApiSchedule } from "../store/schedule-store";
import { useWebSocketStore } from "../store/websocket-store";

export function useSchedules(roomId: string) {
  const api = useApi();
  const { refreshScheduleTrigger } = useWebSocketStore();
  const { schedules, isLoading, error, refreshTrigger, refreshSchedules } =
    useScheduleStore();

  // Function to fetch schedules
  const fetchSchedules = async () => {
    if (!roomId) return;

    try {
      useScheduleStore.setState({ isLoading: true, error: null });

      const data = await api<ApiSchedule[]>(`/schedules/maps/${roomId}`);

      // Update the store with the fetched data
      useScheduleStore.setState({
        schedules: useScheduleStore.getState().schedules.map((s) => s), // keep the mapping in the store
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      useScheduleStore.setState({
        error:
          error instanceof Error ? error.message : "Failed to fetch schedules",
        isLoading: false,
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSchedules();
  }, [roomId]);

  // Refresh when triggered by websocket or manual refresh
  useEffect(() => {
    if (refreshScheduleTrigger > 0 || refreshTrigger > 0) {
      fetchSchedules();
    }
  }, [refreshScheduleTrigger, refreshTrigger]);

  return {
    schedules,
    isLoading,
    error,
    refresh: refreshSchedules,
    fetchSchedules,
  };
}
