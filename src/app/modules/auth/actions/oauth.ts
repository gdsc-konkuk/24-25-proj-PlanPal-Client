"use server";

import { cookies } from "next/headers";

export const oauthRequest = async (code: string) => {
  const response = await fetch(`${process.env.API_SERVER_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ authorizationCode: code }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const { accessToken, refreshToken } = await response.json();

  (await cookies()).set("refreshToken", refreshToken, {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });

  return accessToken;
};
