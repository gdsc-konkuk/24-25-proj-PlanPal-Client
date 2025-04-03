// src/pages/Home/Home.tsx
import { useState } from "react";

import CTASection from "./components/CTASection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 로그인 로직 구현 필요
    console.log("Login with:", email, password);
    setShowLoginModal(false);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 회원가입 로직 구현 필요
    console.log("Signup with:", name, email, password);
    setShowSignupModal(false);
  };

  const handleGoogleAuth = () => {
    // 실제 구글 OAuth 로직 구현 필요
    console.log("Google OAuth");
  };

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const openSignupModal = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogin={openLoginModal} onSignup={openSignupModal} />
      <HeroSection />
      <FeaturesSection />
      <CTASection onSignup={openSignupModal} />
      <Footer />

      {/* Modals */}
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleGoogleAuth={handleGoogleAuth}
        openSignupModal={openSignupModal}
      />

      <SignupModal
        open={showSignupModal}
        onOpenChange={setShowSignupModal}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignup={handleSignup}
        handleGoogleAuth={handleGoogleAuth}
        openLoginModal={openLoginModal}
      />
    </div>
  );
};

export default Home;
