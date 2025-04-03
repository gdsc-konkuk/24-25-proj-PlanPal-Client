// src/pages/Dashboard/Dashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import CreateTravelDialog from "./components/CreateTravelDialog";
import TravelRoomCard from "./components/TravelRoomCard";
import { travelRooms } from "./_dummy";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleEnterChatRoom = (roomId: string) => {
    navigate(`/chat?id=${roomId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">내 여행 계획</h1>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> 새 여행 만들기
        </Button>
      </div>

      {/* 여행 방 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {travelRooms.map((room) => (
          <TravelRoomCard
            key={room.id}
            room={room}
            onEnterChatRoom={handleEnterChatRoom}
          />
        ))}
      </div>

      <CreateTravelDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </main>
  );
};

export default Dashboard;
