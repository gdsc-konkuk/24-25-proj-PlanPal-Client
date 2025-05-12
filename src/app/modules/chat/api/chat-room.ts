import { fetchAuth } from "@/lib/fetch-auth";

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

interface ChatRoomResponse {
  id: number;
  name: string;
  inviteCode: string;
  limitUsers: number;
  destination: string;
  thumbnailUrl: string;
  createdAt: string;
}

export async function getChatRooms() {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat room");
  }

  return response.json();
}

export async function createChatRoom(
  data: ChatRoomCreateRequest
): Promise<ChatRoomResponse> {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create chat room");
  }

  return response.json();
}

/**
POST
/api/chat-rooms/join
채팅방 참여
초대 코드를 통해 채팅방에 참여합니다.
*/
export async function joinChatRoom(
  inviteCode: string
): Promise<ChatRoomResponse> {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteCode }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to join chat room");
  }

  return response.json();
}

/*
GET
/api/chat-rooms/{chatRoomId}/invite
채팅방 초대 코드 조회

참여 중인 채팅방의 초대 코드를 조회합니다.

Parameters
Try it out
Name	Description
chatRoomId *
integer($int64)
(path)
chatRoomId
Responses
Code	Description	Links
200	
OK

Media type
*/
export async function getChatRoomInviteCode(
  chatRoomId: number
): Promise<{ inviteCode: string }> {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}/invite`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat room invite code");
  }

  return response.json();
}

/*
GET
/api/chat-rooms/{chatRoomId}
채팅방 상세 정보 조회

채팅방의 상세 정보를 조회합니다.

Parameters
Try it out
Name	Description
chatRoomId *
integer($int64)
(path)
chatRoomId
Responses
Code	Description	Links
200	
OK

Media type
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "name": "string",
  "inviteCode": "string",
  "limitUsers": 0,
  "destination": "string",
  "thumbnailUrl": "string",
  "createdAt": "string"
}
  */
export async function getChatRoom(
  chatRoomId: number
): Promise<ChatRoomResponse> {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat room");
  }

  return response.json();
}

/**
 * DELETE
/api/chat-rooms/{chatRoomId}
채팅방 삭제 또는 나가기

채팅방 주인은 삭제, 참여자는 나가기 처리합니다.

Parameters
Try it out
Name	Description
chatRoomId *
integer($int64)
(path)
chatRoomId
Responses
Code	Description	Links
200	
OK
 */
export async function deleteChatRoom(chatRoomId: number) {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete chat room");
  }

  return response.json();
}

/**
 * PATCH
/api/chat-rooms/{chatRoomId}
채팅방 정보 수정

채팅방 이름, 목적지, 대표 사진을 수정합니다.

Parameters
Try it out
Name	Description
chatRoomId *
integer($int64)
(path)
chatRoomId
Request body

application/json
Example Value
Schema
{
  "name": "string",
  "destination": "string",
  "thumbnailUrl": "string"
}
Responses
Code	Description	Links
200	
OK

Media type
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "name": "string",
  "inviteCode": "string",
  "limitUsers": 0,
  "destination": "string",
  "thumbnailUrl": "string",
  "createdAt": "string"
}
 */
export async function updateChatRoom(
  chatRoomId: number,
  data: Partial<ChatRoomCreateRequest>
): Promise<ChatRoomResponse> {
  const response = await fetchAuth(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/chat-rooms/${chatRoomId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update chat room");
  }

  return response.json();
}
