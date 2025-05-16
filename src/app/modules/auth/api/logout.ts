export async function logoutRequest() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/logout`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
