// src/pages/Home/components/Header.tsx
import { Link } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onSignup }) => {
  return (
    <header className="bg-background border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="md" />
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/explore"
            className="text-foreground hover:text-foreground/80"
          >
            Explore
          </Link>
          <Link
            to="/dashboard"
            className="text-foreground hover:text-foreground/80"
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
          <Button
            variant="outline"
            onClick={onLogin}
            className="hidden md:inline-flex"
          >
            Log in
          </Button>
          <Button onClick={onSignup}>Sign up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
