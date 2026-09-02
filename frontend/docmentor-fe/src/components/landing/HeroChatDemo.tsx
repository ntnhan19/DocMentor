import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Bot, User, Loader2 } from "lucide-react";
import { heroChatScenarios, ChatScenario, CitationData } from "../../data/heroChatScenarios";
import { Persona } from "../../pages/LandingPage";

interface HeroChatDemoProps {
  persona: Persona;
}

function CitationBadge({ citation }: { citation: CitationData }) {
  return (
    <div className="relative inline-block group">
      <span className="inline-flex items-center gap-1 mx-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold cursor-help hover:bg-primary/20 transition-colors">
        <FileText size={12} />
        [{citation.file}, Trang {citation.page}]
      </span>
      
      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-background border border-border-color shadow-xl rounded-xl p-3 text-sm">
          <p className="font-semibold text-text-main mb-1 text-xs border-b border-border-color pb-1">
            Trích xuất từ {citation.file}
          </p>
          <p className="text-text-muted italic text-xs leading-relaxed">
            "{citation.previewText}"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-r border-b border-border-color rotate-45"></div>
        </div>
      </div>
    </div>
  );
}

export default function HeroChatDemo({ persona }: HeroChatDemoProps) {
  const scenarios = heroChatScenarios[persona];
  const [activeScenario, setActiveScenario] = useState<ChatScenario>(scenarios[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset to first scenario when persona changes
  useEffect(() => {
    setActiveScenario(heroChatScenarios[persona][0]);
  }, [persona]);

  const handleScenarioChange = (scenario: ChatScenario) => {
    if (scenario.id === activeScenario.id || isLoading) return;
    
    setIsLoading(true);
    // Simulate thinking delay
    setTimeout(() => {
      setActiveScenario(scenario);
      setIsLoading(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="mt-12 md:mt-20 mx-auto max-w-4xl rounded-2xl border border-border-color shadow-2xl overflow-hidden bg-background relative text-left flex flex-col"
    >
      {/* Window Header */}
      <div className="h-12 border-b border-border-color flex items-center px-4 gap-2 bg-accent/50 backdrop-blur-md shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="mx-auto text-xs font-medium text-text-muted">docmentor-ai-chat</div>
      </div>
      
      {/* Chat Area */}
      <div className="p-6 md:p-8 flex flex-col gap-8 bg-background/50 flex-1 min-h-[400px]">
        {/* User Message */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
            <User className="text-secondary" size={20} />
          </div>
          <div className="flex-1 pt-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeScenario.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-text-main text-lg font-medium"
              >
                {activeScenario.question}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-color/50"></div>

        {/* AI Message */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <Bot className="text-primary" size={20} />
          </div>
          <div className="flex-1 pt-2">
            {isLoading ? (
              <div className="flex items-center gap-2 text-text-muted h-7">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm font-medium">Đang phân tích tài liệu...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-text-main text-lg leading-relaxed">
                    {activeScenario.answerPart1}
                    {activeScenario.citation1 && <CitationBadge citation={activeScenario.citation1} />}
                    {activeScenario.answerPart2}
                    {activeScenario.citation2 && <CitationBadge citation={activeScenario.citation2} />}
                    {activeScenario.answerPart3}
                  </div>
                  
                  {/* Sources Summary */}
                  <div className="mt-6 p-4 rounded-xl border border-border-color bg-accent/30">
                    <p className="text-xs font-bold text-text-muted uppercase mb-3 tracking-wider">Tài liệu đã tham khảo</p>
                    <div className="flex flex-wrap gap-3">
                      {[activeScenario.citation1?.file, activeScenario.citation2?.file]
                        .filter((file, index, self) => file && self.indexOf(file) === index)
                        .map((file, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border-color text-sm">
                            <FileText className="text-secondary" size={16} />
                            <span className="font-medium text-text-main">{file}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Chips Area */}
      <div className="border-t border-border-color p-4 bg-background shrink-0">
        <p className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wider text-center">Hãy thử một câu hỏi:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeScenario.id === scenario.id
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-text-muted border-border-color hover:border-primary/50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {scenario.question}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
