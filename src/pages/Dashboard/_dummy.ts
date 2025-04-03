import { TravelRoom } from "./types";

export const travelRooms: TravelRoom[] = [
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
    coverImage: "https://placehold.co/400x200",
    participants: [
      {
        id: "user1",
        name: "나",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user2",
        name: "김철수",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user3",
        name: "이영희",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user4",
        name: "박지민",
        avatar: "https://placehold.co/40x40",
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
    coverImage: "https://placehold.co/400x200",
    participants: [
      {
        id: "user1",
        name: "나",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user5",
        name: "정민수",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user6",
        name: "한소희",
        avatar: "https://placehold.co/40x40",
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
    coverImage: "https://placehold.co/400x200",
    participants: [
      {
        id: "user1",
        name: "나",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user7",
        name: "최준호",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user8",
        name: "강다희",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user9",
        name: "윤서연",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: "user10",
        name: "임재현",
        avatar: "https://placehold.co/40x40",
      },
    ],
    lastMessage: {
      sender: "강다희",
      content: "렌트카는 제가 예약할게요!",
      timestamp: new Date(2023, 8, 10, 18, 45),
    },
  },
];
