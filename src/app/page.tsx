"use client";

import React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, Map } from "lucide-react";
import { LoginModal } from "./modules/landing/ui/components/login-modal";

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#395030] to-[#adc1a5] text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Plan Your Perfect Trip Together
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Collaborate with friends and AI to create memorable travel
              experiences with local insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground text-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/dashboard">
                  Start Planning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground text-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/explore">
                  Explore Destinations <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How TravelTogether Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#d1e2ca] p-4 rounded-full mb-6">
                <Users className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Group Planning</h3>
              <p className="text-foreground/80">
                Chat with your friends and our AI assistant in real-time to
                create the perfect itinerary together.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#d1e2ca] p-4 rounded-full mb-6">
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
              <div className="bg-[#d1e2ca] p-4 rounded-full mb-6">
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

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are creating unforgettable
            experiences with TravelTogether.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gray-200 hover:bg-accent/90 text-accent-foreground"
              onClick={() => setShowLoginModal(true)}
            >
              Get Started for Free
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
}
