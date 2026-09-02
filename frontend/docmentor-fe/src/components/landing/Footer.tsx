import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border-color py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="DocMentor Logo" className="h-8 w-auto object-contain dark:invert" />
            <span className="text-xl font-bold text-text-main tracking-tight">DocMentor</span>
          </div>
          
          <div className="flex gap-6">
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">
              <Github size={20} />
            </Link>
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">
              <Twitter size={20} />
            </Link>
            <Link to="#" className="text-text-muted hover:text-primary transition-colors">
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-text-muted text-sm">
              © 2025 DocMentor. All rights reserved.
            </p>
            <p className="text-text-muted/60 text-xs mt-2 md:mt-0">
              Built with React 19 • TypeScript • Tailwind CSS • FastAPI • PostgreSQL • Gemini
            </p>
          </div>
          <div className="flex gap-4 text-sm mt-4 md:mt-0">
            <Link to="#" className="text-text-muted hover:text-text-main transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-text-muted hover:text-text-main transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
