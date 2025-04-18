"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Users, Map } from "lucide-react"
import { Logo } from "@/components/logo"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GoogleIcon } from "@/components/icons"

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 로그인 로직 구현 필요
    console.log("Login with:", email, password)
    setShowLoginModal(false)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 회원가입 로직 구현 필요
    console.log("Signup with:", name, email, password)
    setShowSignupModal(false)
  }

  const handleGoogleAuth = () => {
    // 실제 구글 OAuth 로직 구현 필요
    console.log("Google OAuth")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-background border-b border-primary/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-foreground hover:text-foreground/80">
              Explore
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-foreground/80">
              My Trips
            </Link>
            <Link href="/about" className="text-foreground hover:text-foreground/80">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowLoginModal(true)} className="hidden md:inline-flex">
              Log in
            </Button>
            <Button onClick={() => setShowSignupModal(true)}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Plan Your Perfect Trip Together</h1>
            <p className="text-xl md:text-2xl mb-8">
              Collaborate with friends and AI to create memorable travel experiences with local insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-foreground hover:bg-primary-foreground/10">
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
                <Link href="/explore">Explore Destinations  <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How TravelTogether Works</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-secondary/20 p-4 rounded-full mb-6">
                <Users className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Group Planning</h3>
              <p className="text-foreground/80">
                Chat with your friends and our AI assistant in real-time to create the perfect itinerary together.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-accent/20 p-4 rounded-full mb-6">
                <Globe className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cultural Insights</h3>
              <p className="text-foreground/80">
                Learn about local customs, etiquette, and cultural nuances to avoid faux pas during your travels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/30 p-4 rounded-full mb-6">
                <Map className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Discoveries</h3>
              <p className="text-foreground/80">
                Access hidden gems and authentic experiences recommended by locals, not just tourist hotspots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Next Adventure?</h2>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are creating unforgettable experiences with TravelTogether.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => setShowSignupModal(true)}
            >
              Get Started for Free
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Logo size="lg" />
              <p className="text-primary-foreground/70 max-w-md mt-4">
                Making travel planning collaborative, cultural, and connected.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-primary-foreground/70 hover:text-primary-foreground">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-primary-foreground/70 hover:text-primary-foreground">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-primary-foreground/70 hover:text-primary-foreground">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/70">
            <p>© {new Date().getFullYear()} TravelTogether. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Log in to TravelTogether</DialogTitle>
            <DialogDescription className="text-center">Welcome back! Enter your details to continue.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleAuth}>
            <GoogleIcon className="h-5 w-5" />
            <span>Google</span>
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Don't have an account?</span>{" "}
            <button
              className="text-accent hover:underline font-medium"
              onClick={() => {
                setShowLoginModal(false)
                setShowSignupModal(true)
              }}
            >
              Sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Create an account</DialogTitle>
            <DialogDescription className="text-center">
              Join TravelTogether to start planning your next adventure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleAuth}>
            <GoogleIcon className="h-5 w-5" />
            <span>Google</span>
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <button
              className="text-accent hover:underline font-medium"
              onClick={() => {
                setShowSignupModal(false)
                setShowLoginModal(true)
              }}
            >
              Log in
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

