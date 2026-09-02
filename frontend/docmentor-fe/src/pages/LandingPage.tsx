
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import TechStackSection from "../components/landing/TechStackSection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-color">
        <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="DocMentor Logo" className="h-8 w-auto object-contain dark:invert" />
            <span className="text-2xl font-bold tracking-tight">DocMentor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-text-muted hover:text-text-main transition-colors">Features</a>
            <a href="#how-it-works" className="text-text-muted hover:text-text-main transition-colors">How it Works</a>
            <a href="#tech-stack" className="text-text-muted hover:text-text-main transition-colors">Tech Stack</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-accent text-text-muted hover:text-text-main transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="text-sm font-medium text-text-main hover:text-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechStackSection />
      </main>

      <Footer />
    </div>
  );
}
