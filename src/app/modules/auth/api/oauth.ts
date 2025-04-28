export async function oauthRequest(code: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authorizationCode: code }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }

  const { accessToken } = await response.json();

  return accessToken;
}
