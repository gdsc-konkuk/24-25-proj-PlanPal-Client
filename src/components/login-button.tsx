"use client";

import { logoutAction } from "@/app/modules/auth/actions/logout";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface LoginButtonProps {
  setShowLoginModal: (show: boolean) => void;
}

export function LoginButton({ setShowLoginModal }: LoginButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    useAuthStore.setState({ accessToken: null });
    await logoutAction();
    router.push("/");
  };

  return (
    <Button
      variant="outline"
      className="hidden md:inline-flex"
      onClick={accessToken ? handleLogout : handleLogin}
    >
      {accessToken ? "Log out" : "Log in"}
    </Button>
  );
}
