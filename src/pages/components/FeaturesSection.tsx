// src/pages/Home/components/FeaturesSection.tsx
import { Globe, Map, Users } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How TravelTogether Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-secondary/20 p-4 rounded-full mb-6">
              <Users className="h-10 w-10 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Group Planning</h3>
            <p className="text-foreground/80">
              Chat with your friends and our AI assistant in real-time to create
              the perfect itinerary together.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-accent/20 p-4 rounded-full mb-6">
              <Globe className="h-10 w-10 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cultural Insights</h3>
            <p className="text-foreground/80">
              Learn about local customs, etiquette, and cultural nuances to
              avoid faux pas during your travels.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/30 p-4 rounded-full mb-6">
              <Map className="h-10 w-10 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Local Discoveries</h3>
            <p className="text-foreground/80">
              Access hidden gems and authentic experiences recommended by
              locals, not just tourist hotspots.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
