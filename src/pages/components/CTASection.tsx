// src/pages/Home/components/CTASection.tsx
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onSignup: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onSignup }) => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Plan Your Next Adventure?
        </h2>
        <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who are creating unforgettable experiences
          with TravelTogether.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onSignup}
          >
            Get Started for Free
          </Button>
          <Button size="lg" variant="outline">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
