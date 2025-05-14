"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

import { LoginButton } from "@/components/login-button";
import { LoginModal } from "@/app/modules/landing/ui/components/login-modal";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/app/modules/auth/api/logout";

type NavItem = {
  href: string;
  label: string;
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "My Trips" },
];

export function Header() {
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.userName);

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
              className={`text-foreground hover:text-foreground/80 ${pathname === item.href ? "font-medium" : ""
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 px-5 flex items-center justify-center  border border-input rounded-md hover:bg-accent/10"
              >
                {currentUser.split(" ")[0] || "U"}
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
