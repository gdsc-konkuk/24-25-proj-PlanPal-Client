"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Plus,
  Users,
  MessageSquare,
  Loader2,
  Clock,
  Link,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CreateChatModal } from "@/app/modules/chat/create-chat-modal";
import {
  getChatRooms,
  getChatRoom,
  ChatRoom,
  ChatRoomResponse
} from "@/app/modules/chat/api/chat-room";
import { formatChatRoomDate } from "@/app/modules/chat/utils/format-date";

// 여행 방 타입 정의
type TravelRoom = {
  id: string;
  name: string;
  destination: {
    country: string;
    region: string;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
  coverImage: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage: {
    sender: string;
    content: string;
    timestamp: Date;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createdTravelId, setCreatedTravelId] = useState<string | null>(null);

  // API chat rooms state
  const [apiChatRooms, setApiChatRooms] = useState<ChatRoom[]>([]);
  const [chatRoomDetails, setChatRoomDetails] = useState<Record<number, ChatRoomResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat rooms from API
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const data = await getChatRooms();
        setApiChatRooms(data);

        // Fetch detailed information for each chat room
        const detailsPromises = data.map(room => getChatRoom(room.id));
        const detailsResults = await Promise.allSettled(detailsPromises);

        const details: Record<number, ChatRoomResponse> = {};
        detailsResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            details[data[index].id] = result.value;
          }
        });

        setChatRoomDetails(details);
      } catch (err) {
        console.error("Failed to fetch chat rooms:", err);
        setError("Failed to load chat rooms");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [createdTravelId]); // Re-fetch when a new travel is created

  // 더미 데이터: 참여 중인 여행 방 목록
  const travelRooms: TravelRoom[] = [
    {
      id: "japan-2023",
      name: "일본 벚꽃 여행",
      destination: {
        country: "일본",
        region: "도쿄, 교토",
      },
      dateRange: {
        from: new Date(2023, 3, 1),
        to: new Date(2023, 3, 10),
      },
      coverImage:
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      participants: [
        {
          id: "user1",
          name: "나",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user2",
          name: "김철수",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user3",
          name: "이영희",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user4",
          name: "박지민",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      lastMessage: {
        sender: "이영희",
        content: "교토 숙소는 어디로 할까요?",
        timestamp: new Date(2023, 2, 25, 14, 30),
      },
    },
    {
      id: "europe-2023",
      name: "유럽 백패킹",
      destination: {
        country: "프랑스, 이탈리아, 스페인",
        region: "파리, 로마, 바르셀로나",
      },
      dateRange: {
        from: new Date(2023, 6, 15),
        to: new Date(2023, 7, 5),
      },
      coverImage:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      participants: [
        {
          id: "user1",
          name: "나",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user5",
          name: "정민수",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user6",
          name: "한소희",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      lastMessage: {
        sender: "정민수",
        content: "비행기 티켓 예약했어요! 확인해주세요.",
        timestamp: new Date(2023, 5, 10, 9, 15),
      },
    },
    {
      id: "jeju-2023",
      name: "제주도 힐링 여행",
      destination: {
        country: "대한민국",
        region: "제주도",
      },
      dateRange: {
        from: new Date(2023, 8, 22),
        to: new Date(2023, 8, 25),
      },
      coverImage:
        "https://images.unsplash.com/photo-1701678638937-7d538a9f0211?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      participants: [
        {
          id: "user1",
          name: "나",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user7",
          name: "최준호",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user8",
          name: "강다희",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user9",
          name: "윤서연",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "user10",
          name: "임재현",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      lastMessage: {
        sender: "강다희",
        content: "렌트카는 제가 예약할게요!",
        timestamp: new Date(2023, 8, 10, 18, 45),
      },
    },
  ];

  const formatDateRange = (from: Date, to: Date) => {
    return `${format(from, "yy.M.d")}~${format(to, "M.d")}`;
  };

  const handleTravelCreated = (travelId: string) => {
    setCreatedTravelId(travelId);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Trip Plans</h1>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Trip Plan
        </Button>
      </div>

      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTravelCreated={handleTravelCreated}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* API Chat Rooms */}
      {
        !isLoading && apiChatRooms.length > 0 && (
          <>
            <h2 className="text-xl font-medium mb-4">Your Trip Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {apiChatRooms.map((room) => {
                const details = chatRoomDetails[room.id];

                return (
                  <Card
                    key={room.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={room.thumbnailUrl || "/placeholder.svg"}
                        alt={room.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-xl mb-1">
                          {room.name}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-3 w-3 mr-1 shrink-0" />
                          <span>{room.destination}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="px-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-foreground/70 mr-2 shrink-0" />
                          <span className="text-sm text-foreground/70">
                            Max {room.limitUsers} people
                          </span>
                        </div>
                      </div>

                      {details && (
                        <>
                          <div className="flex items-center mb-3">
                            <Link className="h-4 w-4 text-foreground/70 mr-2 shrink-0" />
                            <span className="text-sm font-medium">Invite Code:</span>
                            <Badge variant="outline" className="ml-2">
                              {details.inviteCode}
                            </Badge>
                          </div>

                          <div className="flex items-center mb-3">
                            <Clock className="h-4 w-4 text-foreground/70 mr-2 shrink-0" />
                            <span className="text-sm text-foreground/70">
                              Created: {formatChatRoomDate(details.createdAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => router.push(`/chat?id=${room.id}`)}
                      >
                        Enter the chat
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )
      }

      {/* Dummy Travel Rooms */}
      {
        travelRooms.length > 0 && (
          <>
            <h2 className="text-xl font-medium mb-4">Sample Trip Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelRooms.map((room) => (
                <Card
                  key={room.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={room.coverImage || "/placeholder.svg"}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-xl mb-1">
                        {room.name}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>
                          {room.destination.country}{room.destination.region ? ` - ${room.destination.region}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-foreground/70 mr-2" />
                        <span className="text-sm text-foreground/70">
                          {formatDateRange(room.dateRange.from, room.dateRange.to)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-foreground/70 mr-2" />
                        <span className="text-sm text-foreground/70">
                          {room.participants.length} people
                        </span>
                      </div>
                    </div>

                    <div className="flex -space-x-2 mb-4">
                      {room.participants.slice(0, 4).map((participant) => (
                        <Avatar
                          key={participant.id}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarImage
                            src={participant.avatar}
                            alt={participant.name}
                          />
                          <AvatarFallback className="bg-accent/30 text-accent-foreground">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {room.participants.length > 4 && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{room.participants.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center mb-1">
                        <MessageSquare className="h-3 w-3 text-foreground/70 mr-2" />
                        <span className="text-xs font-medium">
                          {room.lastMessage.sender}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          {format(room.lastMessage.timestamp, "MM/dd HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 truncate">
                        {room.lastMessage.content}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => router.push(`/chat?id=${room.id}`)}
                    >
                      Enter the chat
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )
      }
    </main >
  );
}
