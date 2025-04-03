// src/pages/Dashboard/components/CreateTravelDialog.tsx
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CreateTravelDialogProps, Destination } from "../types";

import BasicInfoTab from "./BasicInfoTab";
import InviteTab from "./InviteTab";

const CreateTravelDialog: React.FC<CreateTravelDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
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
    "/placeholder.svg?height=200&width=400",
  );

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

  const handleStartTravel = () => {
    const newTravelId = `travel-${Date.now()}`;
    navigate(`/chat?id=${newTravelId}`);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
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
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <TabsContent value="basic">
            <BasicInfoTab
              newTravelName={newTravelName}
              setNewTravelName={setNewTravelName}
              newTravelParticipants={newTravelParticipants}
              setNewTravelParticipants={setNewTravelParticipants}
              destinations={destinations}
              setDestinations={setDestinations}
              newCountry={newCountry}
              setNewCountry={setNewCountry}
              newRegion={newRegion}
              setNewRegion={setNewRegion}
              newTravelDate={newTravelDate}
              setNewTravelDate={setNewTravelDate}
              newTravelDescription={newTravelDescription}
              setNewTravelDescription={setNewTravelDescription}
              coverImageType={coverImageType}
              setCoverImageType={setCoverImageType}
              coverImageUrl={coverImageUrl}
              setCoverImageUrl={setCoverImageUrl}
              onClose={() => onOpenChange(false)}
              onNext={() => {
                handleCreateTravel();
                setActiveTab("invite");
              }}
            />
          </TabsContent>

          <TabsContent value="invite">
            <InviteTab
              newTravelName={newTravelName}
              newTravelParticipants={newTravelParticipants}
              destinations={destinations}
              newTravelDate={newTravelDate}
              newTravelDescription={newTravelDescription}
              coverImageUrl={coverImageUrl}
              inviteLink={inviteLink}
              linkCopied={linkCopied}
              onCopyInviteLink={handleCopyInviteLink}
              onBack={() => setActiveTab("basic")}
              onStartTravel={handleStartTravel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTravelDialog;
