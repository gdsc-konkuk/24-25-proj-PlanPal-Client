"use server";

export async function serverFetch(
  accessToken: string,
  path: string,
  options: RequestInit
) {
  const res = await fetch(`${process.env.API_SERVER_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
}
