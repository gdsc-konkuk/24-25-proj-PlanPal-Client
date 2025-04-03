// src/pages/Explore/components/ExploreHeader.tsx
import { Link } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const ExploreHeader = () => {
  return (
    <header className="bg-background border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="md" />
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-foreground/80">
            Home
          </Link>
          <Link to="/chat" className="text-foreground hover:text-foreground/80">
            Plan
          </Link>
          <Link
            to="/about"
            className="text-foreground hover:text-foreground/80"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ExploreHeader;
