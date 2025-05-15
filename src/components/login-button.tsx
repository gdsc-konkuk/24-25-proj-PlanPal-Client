"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { logoutRequest } from "@/app/modules/auth/api/logout";
import { parseJwt } from "@/lib/parseJwt";
import { useState } from "react";

interface LoginButtonProps {
  setShowLoginModal: (show: boolean) => void;
}

export function LoginButton({ setShowLoginModal }: LoginButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const currentUser = accessToken ? parseJwt(accessToken).name : "U";

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    useAuthStore.setState({ accessToken: null });
    await logoutRequest();
    router.push("/");
  };

  return accessToken ? (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="p-2 px-5 flex items-center justify-center  border border-input rounded-md hover:bg-accent/10"
      >
        {currentUser}
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-input rounded-md shadow-lg z-10 p-2">
          <div className="px-3 py-2 text-sm text-muted-foreground">
            log in as {currentUser}
          </div>
          <hr className="my-1 border-input" />
          <button
            onClick={async () => {
              setShowUserMenu(false);
              useAuthStore.setState({ accessToken: null });
              await logoutRequest();
              router.push("/");
            }}
            className="w-full text-left px-3 py-2 hover:bg-accent/10 rounded-md"
          >
            log out
          </button>
        </div>
      )}
    </div>
  ) : (
    <Button
      variant="outline"
      className="md:inline-flex"
      onClick={accessToken ? handleLogout : handleLogin}
    >
      {accessToken ? currentUser : "Log in"}
    </Button>
  );
}
