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
            <>login</>
          )}
        </div>
      </div>
    </header>
  );
}
