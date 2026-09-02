import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import HeroSection from "../components/landing/HeroSection";
import BeforeAfterSection from "../components/landing/BeforeAfterSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ComparisonTable from "../components/landing/ComparisonTable";
import FAQSection from "../components/landing/FAQSection";
import StatsBar from "../components/landing/StatsBar";
import Footer from "../components/landing/Footer";

export type Persona = "student" | "lecturer";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  
  const [persona, setPersona] = useState<Persona>("student");

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border-color shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="DocMentor Logo" className="h-8 w-auto object-contain dark:invert" />
            <span className="text-2xl font-bold tracking-tight">DocMentor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-text-muted hover:text-text-main transition-colors">Tính năng</a>
            <a href="#how-it-works" className="text-text-muted hover:text-text-main transition-colors">Cách hoạt động</a>
            <a href="#comparison" className="text-text-muted hover:text-text-main transition-colors">So sánh</a>
            <a href="#faq" className="text-text-muted hover:text-text-main transition-colors">FAQ</a>
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
              Đăng nhập
            </Link>
            <Link to="/register" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection persona={persona} setPersona={setPersona} />
        <BeforeAfterSection persona={persona} />
        <StatsBar />
        <FeaturesSection persona={persona} />
        <ComparisonTable />
        <HowItWorksSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
