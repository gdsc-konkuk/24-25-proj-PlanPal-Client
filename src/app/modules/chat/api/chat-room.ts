"use client";

import { useApi } from "@/hooks/use-api";
import { fetchAuth } from "@/lib/fetch-auth";

// API response type for chat rooms list
export interface ChatRoom {
  id: number;
  name: string;
  limitUsers: number;
  destination: string;
  thumbnailUrl: string;
}

interface ChatRoomCreateRequest {
  name: string;
  limitUsers: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  destination?: string;
  thumbnailUrl?: string;
}

export interface ChatRoomResponse {
  id: number;
  name: string;
  inviteCode: string;
  limitUsers: number;
  destination: string;
  thumbnailUrl: string;
  createdAt: string;
}

export function getChatRooms(): Promise<ChatRoom[]> {
  const api = useApi();
  return api(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms`);
}

export function createChatRoom(
  data: ChatRoomCreateRequest
): Promise<ChatRoomResponse> {
  const api = useApi();
  return api(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
POST
/api/chat-rooms/join
채팅방 참여
초대 코드를 통해 채팅방에 참여합니다.
*/
export function joinChatRoom(inviteCode: string): Promise<ChatRoomResponse> {
  const api = useApi();
  return api(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inviteCode }),
  });
}

/*
GET
/api/chat-rooms/{chatRoomId}/invite
채팅방 초대 코드 조회
*/
export function getChatRoomInviteCode(
  chatRoomId: number
): Promise<{ inviteCode: string }> {
  const api = useApi();
  return api(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}/invite`
  );
}

/*
GET
/api/chat-rooms/{chatRoomId}
채팅방 상세 정보 조회
*/
export function getChatRoom(chatRoomId: number): Promise<ChatRoomResponse> {
  const api = useApi();
  return api(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`
  );
}

/**
 * DELETE
/api/chat-rooms/{chatRoomId}
채팅방 삭제 또는 나가기
*/
export function deleteChatRoom(chatRoomId: number) {
  const api = useApi();
  return api(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * PATCH
/api/chat-rooms/{chatRoomId}
채팅방 정보 수정
*/
export function updateChatRoom(
  chatRoomId: number,
  data: Partial<ChatRoomCreateRequest>
): Promise<ChatRoomResponse> {
  const api = useApi();
  return api(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}
