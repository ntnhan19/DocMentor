import { motion } from "framer-motion";
import { BrainCircuit, BookOpen, Shield, Zap, Search, PieChart } from "lucide-react";

const features = [
  {
    icon: <Search className="text-primary" size={24} />,
    title: "RAG-Powered Q&A",
    description: "Get precise, context-aware answers to your questions, fully backed by precise document citations.",
  },
  {
    icon: <BrainCircuit className="text-secondary" size={24} />,
    title: "AI Analysis",
    description: "Automatically generate comprehensive summaries, extract key concepts, and create interactive quizzes.",
  },
  {
    icon: <BookOpen className="text-amber-500" size={24} />,
    title: "Multi-Role Support",
    description: "Tailored experiences and workflows for Students, Lecturers, and Administrators.",
  },
  {
    icon: <Shield className="text-emerald-500" size={24} />,
    title: "Secure & Private",
    description: "Your documents are securely stored in the cloud. You have full control over who accesses them.",
  },
  {
    icon: <PieChart className="text-rose-500" size={24} />,
    title: "Advanced Analytics",
    description: "Track document usage, query patterns, and learning progress with beautiful real-time dashboards.",
  },
  {
    icon: <Zap className="text-purple-500" size={24} />,
    title: "Lightning Fast",
    description: "Experience real-time streaming AI responses and instant vector-based semantic search.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-accent/30" id="features">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Everything you need to learn faster
          </h2>
          <p className="text-text-muted text-lg">
            DocMentor combines cutting-edge AI with an intuitive interface to transform how you interact with educational materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border-color hover:border-primary/30 transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-main mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
