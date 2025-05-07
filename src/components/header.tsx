"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginButton } from "@/components/login-button";
import { LoginModal } from "@/app/modules/landing/ui/components/login-modal";

type NavItem = {
  href: string;
  label: string;
};

type HeaderProps = {
  currentUser?: {
    name?: string;
    image?: string;
  };
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "My Trips" },
];

export function Header({ currentUser }: HeaderProps) {
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (pathname === "/chat") {
    return null; // Hide header on the chat page
  }

  return (
    <header className="bg-background border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="md" rounded={true} />
        <nav className="md:flex items-center space-x-6">
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
            <LoginButton setShowLoginModal={setShowLoginModal} />
          )}
        </div>
      </div>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </header>
  );
}
