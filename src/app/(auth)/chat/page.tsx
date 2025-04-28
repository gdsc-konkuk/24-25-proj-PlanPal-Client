import Chat from "@/components/chat";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
}
