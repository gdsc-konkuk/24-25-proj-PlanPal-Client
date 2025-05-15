export function formatChatRoomDate(dateString: string): string {
  const date = new Date(dateString);

  // Format: Month DD, YYYY at HH:MM AM/PM
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
