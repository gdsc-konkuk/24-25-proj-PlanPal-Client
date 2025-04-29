"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { OAUTH_URL } from "@/lib/constant";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  showLoginModal: boolean;
  setShowLoginModal: (showLoginModal: boolean) => void;
}

export function LoginModal({
  showLoginModal,
  setShowLoginModal,
}: LoginModalProps) {
  const router = useRouter();

  const handleGoogleAuth = () => {
    alert(`${OAUTH_URL}`);
    router.push(OAUTH_URL);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Log in to TravelTogether
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome back! Enter your details to continue.
          </DialogDescription>
        </DialogHeader>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGoogleAuth}
        >
          <GoogleIcon className="h-5 w-5" />
          <span>Google</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
