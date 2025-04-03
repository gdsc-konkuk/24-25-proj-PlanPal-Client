// src/layouts/DashboardLayout.tsx
import { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 방법 1: children prop을 사용하는 일반적인 레이아웃
interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* 헤더 */}
      <header className="bg-background border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-foreground/80">
              Home
            </Link>
            <Link
              to="/explore"
              className="text-foreground hover:text-foreground/80"
            >
              Explore
            </Link>
            <Link
              to="/dashboard"
              className="text-foreground hover:text-foreground/80 font-medium"
            >
              My Trips
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-foreground/80"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback className="bg-accent/30 text-accent-foreground">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      {children || <Outlet />}
    </div>
  );
};

export default DashboardLayout;
