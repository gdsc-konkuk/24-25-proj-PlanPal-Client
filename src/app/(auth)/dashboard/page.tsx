"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Plus,
  Users,
  MessageSquare,
  Copy,
  Check,
  X,
  ImageIcon,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

type Destination = {
  id: string;
  country: string;
  region: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTravelName, setNewTravelName] = useState("");
  const [newTravelParticipants, setNewTravelParticipants] = useState(1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newTravelDate, setNewTravelDate] = useState<DateRange | undefined>();
  const [newTravelDescription, setNewTravelDescription] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [coverImageType, setCoverImageType] = useState<"ai" | "upload">("ai");
  const [coverImageUrl, setCoverImageUrl] = useState(
    "/placeholder.svg?height=200&width=400"
  );

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
      coverImage: "/placeholder.svg?height=200&width=400",
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
      coverImage: "/placeholder.svg?height=200&width=400",
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
      coverImage: "/placeholder.svg?height=200&width=400",
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

  const handleCreateTravel = () => {
    // 실제로는 API 호출 등을 통해 새 여행 방을 생성하고 서버에 저장해야 함
    const newTravelId = `travel-${Date.now()}`;

    // 초대 링크 생성
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/invite/${newTravelId}`;
    setInviteLink(inviteUrl);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const addDestination = () => {
    if (newCountry.trim()) {
      const newDest: Destination = {
        id: `dest-${Date.now()}`,
        country: newCountry,
        region: newRegion,
      };
      setDestinations([...destinations, newDest]);
      setNewCountry("");
      setNewRegion("");
    }
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter((dest) => dest.id !== id));
  };

  const formatDateRange = (from: Date, to: Date) => {
    return `${format(from, "yy.M.d")}~${format(to, "M.d")}`;
  };

  const handleStartTravel = () => {
    const newTravelId = `travel-${Date.now()}`;
    router.push(`/chat?id=${newTravelId}`);
    setIsCreateDialogOpen(false);
  };

  // 모달 열기 함수 추가
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  useEffect(() => {
    if (!isCreateDialogOpen) {
      // 모달이 닫힐 때 상태 초기화
      setNewTravelName("");
      setNewTravelParticipants(1);
      setDestinations([]);
      setNewCountry("");
      setNewRegion("");
      setNewTravelDate(undefined);
      setNewTravelDescription("");
      setInviteLink("");
      setLinkCopied(false);
      setActiveTab("basic");
      setCoverImageType("ai");
      setCoverImageUrl("/placeholder.svg?height=200&width=400");
    }
  }, [isCreateDialogOpen]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">내 여행 계획</h1>
        {/* 버튼과 Dialog를 분리하여 직접 상태 관리 */}
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={openCreateDialog}
        >
          <Plus className="h-4 w-4 mr-2" /> 새 여행 만들기
        </Button>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-40px)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 여행 계획 만들기</DialogTitle>
              <DialogDescription>
                새로운 여행 계획을 만들고 친구들과 함께 준비해보세요.
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="basic"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                <TabsTrigger
                  value="invite"
                  disabled={!newTravelName || newTravelParticipants < 1}
                >
                  초대 및 시작
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="space-y-4">
                  {/* 필수 정보 섹션 */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      필수 정보
                      <Badge variant="secondary" className="ml-2">
                        필수
                      </Badge>
                    </h3>
                    <Separator className="mb-4" />

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="travel-name">여행 방 이름</Label>
                        <Input
                          id="travel-name"
                          placeholder="예: 도쿄 벚꽃 여행"
                          value={newTravelName}
                          onChange={(e) => setNewTravelName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="travel-participants">예상 인원</Label>
                        <Input
                          id="travel-participants"
                          type="number"
                          min="1"
                          placeholder="예: 4"
                          value={newTravelParticipants}
                          onChange={(e) =>
                            setNewTravelParticipants(
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 선택 정보 섹션 */}
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      선택 정보
                      <Badge variant="outline" className="ml-2">
                        선택
                      </Badge>
                    </h3>
                    <Separator className="mb-4" />

                    <div className="grid gap-4">
                      {/* 목적지 섹션 */}
                      <div className="grid gap-2">
                        <Label className="mb-1">목적지</Label>

                        {/* 추가된 목적지 목록 */}
                        {destinations.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {destinations.map((dest) => (
                              <div
                                key={dest.id}
                                className="bg-muted rounded-md px-3 py-1 text-sm flex items-center gap-2"
                              >
                                <span>
                                  {dest.country}
                                  {dest.region && ` - ${dest.region}`}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full"
                                  onClick={() => removeDestination(dest.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 목적지 추가 폼 */}
                        <div className="flex gap-2 items-end">
                          <div className="grid gap-1 flex-1">
                            <Label htmlFor="travel-country" className="text-xs">
                              국가
                            </Label>
                            <Input
                              id="travel-country"
                              placeholder="예: 일본"
                              value={newCountry}
                              onChange={(e) => setNewCountry(e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="grid gap-1 flex-1">
                            <Label htmlFor="travel-region" className="text-xs">
                              지역 (선택)
                            </Label>
                            <Input
                              id="travel-region"
                              placeholder="예: 도쿄, 교토"
                              value={newRegion}
                              onChange={(e) => setNewRegion(e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addDestination}
                            disabled={!newCountry.trim()}
                            className="h-9"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            추가
                          </Button>
                        </div>
                      </div>

                      {/* 여행 기간 */}
                      <div className="grid gap-2">
                        <Label>여행 기간</Label>
                        <DatePickerWithRange
                          date={newTravelDate}
                          setDate={setNewTravelDate}
                        />
                      </div>

                      {/* 대표 이미지 */}
                      <div className="grid gap-2">
                        <Label>대표 이미지</Label>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-4">
                              <Button
                                type="button"
                                variant={
                                  coverImageType === "ai"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCoverImageType("ai")}
                              >
                                AI 생성 이미지
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  coverImageType === "upload"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCoverImageType("upload")}
                              >
                                직접 업로드
                              </Button>
                            </div>
                          </div>

                          <div className="relative aspect-video rounded-md overflow-hidden border">
                            <Image
                              src={coverImageUrl || "/placeholder.svg"}
                              alt="여행 대표 이미지"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {coverImageType === "upload" && (
                            <div className="mt-2 flex justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                이미지 업로드
                              </Button>
                            </div>
                          )}

                          {coverImageType === "ai" && (
                            <div className="mt-2 text-center text-sm text-muted-foreground">
                              여행 정보를 바탕으로 AI가 자동으로 이미지를
                              생성합니다.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 여행 설명 */}
                      <div className="grid gap-2">
                        <Label htmlFor="travel-description">
                          여행 설명 (선택사항)
                        </Label>
                        <Textarea
                          id="travel-description"
                          placeholder="여행에 대한 간단한 설명을 입력하세요."
                          value={newTravelDescription}
                          onChange={(e) =>
                            setNewTravelDescription(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => {
                      handleCreateTravel();
                      setActiveTab("invite");
                    }}
                    disabled={!newTravelName || newTravelParticipants < 1}
                  >
                    다음
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="invite" className="space-y-4 py-4">
                <div className="space-y-6">
                  {/* 초대 링크 섹션 */}
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">
                      여행 계획이 생성되었습니다!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      아래 링크를 공유하여 친구들을 초대하세요.
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                      <Input
                        value={
                          inviteLink ||
                          "https://planpal.vercel.app/invite/sample-invite-code"
                        }
                        readOnly
                        className="bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyInviteLink}
                        className={cn(
                          "transition-colors",
                          linkCopied &&
                            "bg-green-50 text-green-600 border-green-200"
                        )}
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>예상 인원: {newTravelParticipants}명</span>
                    </div>
                  </div>

                  {/* 여행 정보 요약 */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-40">
                      <Image
                        src={coverImageUrl || "/placeholder.svg"}
                        alt="여행 대표 이미지"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-xl mb-1">
                          {newTravelName}
                        </h3>
                        {destinations.length > 0 && (
                          <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>
                              {destinations
                                .map(
                                  (d) =>
                                    `${d.country}${
                                      d.region ? ` - ${d.region}` : ""
                                    }`
                                )
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-background">
                      {newTravelDate?.from && newTravelDate?.to && (
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-foreground/70 mr-2" />
                          <span className="text-sm text-foreground/70">
                            {formatDateRange(
                              newTravelDate.from,
                              newTravelDate.to
                            )}
                          </span>
                        </div>
                      )}

                      {newTravelDescription && (
                        <p className="text-sm text-foreground/80 mt-2">
                          {newTravelDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("basic")}
                  >
                    이전
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleStartTravel}
                  >
                    여행 시작하기
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* 여행 방 목록 */}
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
                    {room.destination.country} - {room.destination.region}
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
                    {room.participants.length}명
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
                채팅방 입장
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
