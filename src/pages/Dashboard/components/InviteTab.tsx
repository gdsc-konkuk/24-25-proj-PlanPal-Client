// src/pages/Dashboard/components/InviteTab.tsx
import { format } from "date-fns";
import { Calendar, Check, Copy, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { InviteTabProps } from "../types";

const InviteTab: React.FC<InviteTabProps> = ({
  newTravelName,
  newTravelParticipants,
  destinations,
  newTravelDate,
  newTravelDescription,
  coverImageUrl,
  inviteLink,
  linkCopied,
  onCopyInviteLink,
  onBack,
  onStartTravel,
}) => {
  const formatDateRange = (from: Date, to: Date) => {
    return `${format(from, "yy.M.d")}~${format(to, "M.d")}`;
  };

  return (
    <div className="space-y-4 py-4">
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
              onClick={onCopyInviteLink}
              className={cn(
                "transition-colors",
                linkCopied && "bg-green-50 text-green-600 border-green-200",
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
            <img
              src={coverImageUrl || "/placeholder.svg"}
              alt="여행 대표 이미지"
              className="w-full h-full object-cover"
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
                          `${d.country}${d.region ? ` - ${d.region}` : ""}`,
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
                  {formatDateRange(newTravelDate.from, newTravelDate.to)}
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
        <Button variant="outline" onClick={onBack}>
          이전
        </Button>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={onStartTravel}
        >
          여행 시작하기
        </Button>
      </div>
    </div>
  );
};

export default InviteTab;
