"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginButton } from "@/components/login-button";
import {
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  MapIcon,
  ListIcon,
  MessageCircleIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
};

type HeaderProps = {
  variant?: "default" | "chat";
  currentUser?: {
    name?: string;
    image?: string;
  };
  // For chat header only
  travelId?: string;
  onBackClick?: () => void;
  panelControls?: {
    leftPanelVisible: boolean;
    middlePanelVisible: boolean;
    rightPanelVisible: boolean;
    toggleLeftPanel: () => void;
    toggleMiddlePanel: () => void;
    toggleRightPanel: () => void;
  };
  setShowLoginModal?: (show: boolean) => void;
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "My Trips" },
];

export function Header({
  variant = "default",
  currentUser,
  travelId,
  onBackClick,
  panelControls,
  setShowLoginModal,
}: HeaderProps) {
  const pathname = usePathname();

  // For chat variant
  if (variant === "chat") {
    return (
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#ADC1A6] border-b border-primary/10 h-14 flex items-center px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="sm" />
          {travelId && (
            <span className="text-sm text-foreground/70 ml-2">
              ID: {travelId}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {panelControls && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={panelControls.toggleLeftPanel}
                className="flex items-center gap-1"
                disabled={
                  [
                    panelControls.leftPanelVisible,
                    panelControls.middlePanelVisible,
                    panelControls.rightPanelVisible,
                  ].filter(Boolean).length === 1 &&
                  panelControls.leftPanelVisible
                }
              >
                <MapIcon className="h-4 w-4" />
                {panelControls.leftPanelVisible ? (
                  <EyeOffIcon className="h-3 w-3" />
                ) : (
                  <EyeIcon className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={panelControls.toggleMiddlePanel}
                className="flex items-center gap-1"
                disabled={
                  [
                    panelControls.leftPanelVisible,
                    panelControls.middlePanelVisible,
                    panelControls.rightPanelVisible,
                  ].filter(Boolean).length === 1 &&
                  panelControls.middlePanelVisible
                }
              >
                <ListIcon className="h-4 w-4" />
                {panelControls.middlePanelVisible ? (
                  <EyeOffIcon className="h-3 w-3" />
                ) : (
                  <EyeIcon className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={panelControls.toggleRightPanel}
                className="flex items-center gap-1"
                disabled={
                  [
                    panelControls.leftPanelVisible,
                    panelControls.middlePanelVisible,
                    panelControls.rightPanelVisible,
                  ].filter(Boolean).length === 1 &&
                  panelControls.rightPanelVisible
                }
              >
                <MessageCircleIcon className="h-4 w-4" />
                {panelControls.rightPanelVisible ? (
                  <EyeOffIcon className="h-3 w-3" />
                ) : (
                  <EyeIcon className="h-3 w-3" />
                )}
              </Button>
            </>
          )}
          {currentUser ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.image || "/placeholder.svg?height=32&width=32"}
                alt="User"
              />
              <AvatarFallback className="bg-accent/30 text-accent-foreground">
                {currentUser.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </header>
    );
  }

  // For default variant
  return (
    <header className="bg-background border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="md" rounded={true} />
        <nav className="hidden md:flex items-center space-x-6">
          {DEFAULT_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-foreground hover:text-foreground/80 ${
                pathname === item.href ? "font-medium" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.image || "/placeholder.svg?height=32&width=32"}
                alt="User"
              />
              <AvatarFallback className="bg-accent/30 text-accent-foreground">
                {currentUser.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <>
              {setShowLoginModal ? (
                <LoginButton setShowLoginModal={setShowLoginModal} />
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="hidden md:inline-flex"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
