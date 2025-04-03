// src/pages/Dashboard/components/BasicInfoTab.tsx
import { ImageIcon, Plus, X } from "lucide-react";

import { DatePickerWithRange } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { BasicInfoTabProps } from "../types";

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  newTravelName,
  setNewTravelName,
  newTravelParticipants,
  setNewTravelParticipants,
  destinations,
  setDestinations,
  newCountry,
  setNewCountry,
  newRegion,
  setNewRegion,
  newTravelDate,
  setNewTravelDate,
  newTravelDescription,
  setNewTravelDescription,
  coverImageType,
  setCoverImageType,
  coverImageUrl,
  setCoverImageUrl,
  onClose,
  onNext,
}) => {
  const addDestination = () => {
    if (newCountry.trim()) {
      const newDest = {
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

  return (
    <div className="space-y-4 py-4">
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
                  setNewTravelParticipants(Number.parseInt(e.target.value) || 1)
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
                      variant={coverImageType === "ai" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCoverImageType("ai")}
                    >
                      AI 생성 이미지
                    </Button>
                    <Button
                      type="button"
                      variant={
                        coverImageType === "upload" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCoverImageType("upload")}
                    >
                      직접 업로드
                    </Button>
                  </div>
                </div>

                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <img
                    src={coverImageUrl || "/placeholder.svg"}
                    alt="여행 대표 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>

                {coverImageType === "upload" && (
                  <div className="mt-2 flex justify-center">
                    <Button variant="outline" size="sm" className="w-full">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>
                  </div>
                )}

                {coverImageType === "ai" && (
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    여행 정보를 바탕으로 AI가 자동으로 이미지를 생성합니다.
                  </div>
                )}
              </div>
            </div>

            {/* 여행 설명 */}
            <div className="grid gap-2">
              <Label htmlFor="travel-description">여행 설명 (선택사항)</Label>
              <Textarea
                id="travel-description"
                placeholder="여행에 대한 간단한 설명을 입력하세요."
                value={newTravelDescription}
                onChange={(e) => setNewTravelDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button
          onClick={onNext}
          disabled={!newTravelName || newTravelParticipants < 1}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoTab;
