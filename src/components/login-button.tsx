"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { logoutRequest } from "@/app/modules/auth/api/logout";
import { parseJwt } from "@/lib/parseJwt";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOutIcon } from "lucide-react";

interface LoginButtonProps {
  setShowLoginModal: (show: boolean) => void;
}

export function LoginButton({ setShowLoginModal }: LoginButtonProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = accessToken ? parseJwt(accessToken).name : "User";
  const userImage = accessToken ? parseJwt(accessToken).imageUrl : "/placeholder.svg";
  const userEmail = accessToken ? parseJwt(accessToken).email : "";

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    useAuthStore.setState({ accessToken: null });
    await logoutRequest();
    router.push("/");
  };

  return accessToken ? (
    <div
      onClick={() => setShowUserMenu(!showUserMenu)}
      className="relative w-fit h-fit flex items-center justify-center border-2 rounded-full hover:bg-accent/10 cursor-pointer select-none"
    >
      <Avatar className="relative w-10 h-10 rounded-full">
        <AvatarImage src={userImage} alt="user avatar image" />
        <AvatarFallback className="bg-muted flex items-center justify-center rounded-full">
          {currentUser.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {showUserMenu && (
        <div className="absolute top-10 right-0 mt-4 w-48 bg-background border border-input rounded-md shadow-lg z-10 p-2 text-left">
          <div className="pl-3 mt-2 text-md text-foreground font-semibold">
            {currentUser}
          </div>
          <div className="pl-3 text-sm text-foreground/70">
            {userEmail}
          </div>
          <hr className="pl-3 my-3 border-input" />
          <button
            onClick={async () => {
              setShowUserMenu(false);
              useAuthStore.setState({ accessToken: null });
              await logoutRequest();
              router.push("/");
            }}
            className="px-3 py-2 mb-2 w-full text-left hover:bg-accent/50 rounded-md"
          >
            <LogOutIcon className="inline mr-2" />
            Logout
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
      {accessToken ? currentUser : "Login"}
    </Button>
  );
}
