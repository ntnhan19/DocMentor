import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { personaContent } from "../../data/personaContent";
import HeroChatDemo from "./HeroChatDemo";
import { Persona } from "../../pages/LandingPage";

interface HeroSectionProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

export default function HeroSection({ persona, setPersona }: HeroSectionProps) {
  const content = personaContent[persona];

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl opacity-20 dark:opacity-10 pointer-events-none">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary to-secondary" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-primary border border-border-color mb-8"
          >
            <Sparkles size={16} />
            <span className="text-sm font-medium">DocMentor 1.0 is here</span>
          </motion.div>

          {/* Persona Switcher */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex bg-accent/50 p-1 rounded-xl border border-border-color">
              <button
                onClick={() => setPersona("student")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  persona === "student" 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                Tôi là Sinh viên
              </button>
              <button
                onClick={() => setPersona("lecturer")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  persona === "lecturer" 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                Tôi là Giảng viên
              </button>
            </div>
          </motion.div>

          <motion.h1
            key={`h1-${persona}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-main mb-6"
          >
            {content.headline}
          </motion.h1>

          <motion.p
            key={`p-${persona}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Bắt đầu miễn phí
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-text-main font-semibold border border-border-color hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Dùng thử Guest Mode
            </Link>
          </motion.div>
        </div>

        <HeroChatDemo persona={persona} />
      </div>
    </section>
  );
}
