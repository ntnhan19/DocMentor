import { motion } from "framer-motion";
import { Upload, MessageSquare, Download } from "lucide-react";

const steps = [
  {
    icon: <Upload className="text-primary" size={32} />,
    title: "1. Upload Documents",
    description: "Upload your PDFs, Word documents, or text files to our secure cloud. We support multiple files and organize them into folders.",
  },
  {
    icon: <MessageSquare className="text-secondary" size={32} />,
    title: "2. AI Analysis & Chat",
    description: "Our Gemini-powered engine instantly analyzes your files. Start chatting, ask questions, or generate summaries.",
  },
  {
    icon: <Download className="text-primary" size={32} />,
    title: "3. Export Insights",
    description: "Save your AI-generated quizzes, summaries, and key concepts as beautiful PDFs to study or share later.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            How it works
          </h2>
          <p className="text-text-muted text-lg">
            From raw documents to actionable insights in three simple steps.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border-color -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex-1 relative z-10"
            >
              <div className="bg-background border border-border-color p-8 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-background">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-main text-center mb-3">{step.title}</h3>
                <p className="text-text-muted text-center">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
