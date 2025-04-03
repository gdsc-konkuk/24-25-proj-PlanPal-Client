// src/pages/Home/components/LoginModal.tsx
import React from "react";
import { Link } from "react-router-dom";

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

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleGoogleAuth: () => void;
  openSignupModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onOpenChange,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  handleGoogleAuth,
  openSignupModal,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Log in to TravelTogether
          </DialogTitle>
          <DialogDescription className="text-center">
            Welcome back! Enter your details to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Log in
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
          <span className="text-muted-foreground">Don't have an account?</span>{" "}
          <button
            className="text-accent hover:underline font-medium"
            onClick={openSignupModal}
          >
            Sign up
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
