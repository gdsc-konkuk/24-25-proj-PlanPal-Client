// src/pages/Home/components/SignupModal.tsx
import React from "react";

import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignup: (e: React.FormEvent) => void;
  handleGoogleAuth: () => void;
  openLoginModal: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({
  open,
  onOpenChange,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleSignup,
  handleGoogleAuth,
  openLoginModal,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Create an account
          </DialogTitle>
          <DialogDescription className="text-center">
            Join TravelTogether to start planning your next adventure.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignup} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long.
            </p>
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleGoogleAuth}
        >
          <GoogleIcon className="h-5 w-5" />
          <span>Google</span>
        </Button>

        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">
            Already have an account?
          </span>{" "}
          <button
            className="text-accent hover:underline font-medium"
            onClick={openLoginModal}
          >
            Log in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
