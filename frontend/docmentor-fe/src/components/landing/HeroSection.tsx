import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-6"
          >
            Supercharge Your Documents with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI Power</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto"
          >
            Upload, ask, and get precise answers backed by citations. The ultimate AI-powered document assistant for students, lecturers, and professionals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-text-main font-medium border border-border-color hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Try Guest Mode
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 md:mt-24 mx-auto max-w-5xl rounded-2xl border border-border-color shadow-2xl overflow-hidden bg-accent relative"
        >
          {/* Mac-like window controls */}
          <div className="h-10 border-b border-border-color flex items-center px-4 gap-2 bg-background/50 backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="aspect-video bg-background p-4 flex flex-col">
            <div className="flex-1 flex gap-4">
              <div className="w-64 border-r border-border-color pr-4 hidden md:block">
                <div className="h-8 bg-accent rounded mb-4 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-accent rounded w-full"></div>
                  <div className="h-4 bg-accent rounded w-5/6"></div>
                  <div className="h-4 bg-accent rounded w-4/6"></div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 rounded-xl bg-accent/50 p-4 flex flex-col justify-end gap-2">
                  <div className="h-10 w-2/3 bg-accent rounded-lg"></div>
                  <div className="h-16 w-5/6 bg-primary/10 border border-primary/20 rounded-lg self-end"></div>
                </div>
                <div className="h-14 rounded-xl border border-border-color bg-background"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
