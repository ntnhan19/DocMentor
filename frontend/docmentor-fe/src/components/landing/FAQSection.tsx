import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqContent } from "../../data/faqContent";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index); // -1 means closed for mobile
  };

  return (
    <section className="py-24 bg-accent/20 border-t border-border-color" id="faq">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-text-muted text-lg">
            Mọi thứ bạn cần biết về nền tảng và bảo mật dữ liệu.
          </p>
        </div>

        {/* Mobile View: Accordion */}
        <div className="block md:hidden space-y-4">
          {faqContent.map((faq, index) => (
            <div 
              key={index}
              className="border border-border-color rounded-xl bg-background overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/30 transition-colors focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-text-main pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`text-text-muted shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-text-muted leading-relaxed border-t border-border-color/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: 2 Columns */}
        <div className="hidden md:flex gap-8 items-start">
          {/* Questions Column */}
          <div className="w-1/3 flex flex-col gap-2 shrink-0">
            {faqContent.map((faq, index) => (
              <button
                key={index}
                onClick={() => setOpenIndex(index)}
                className={`text-left px-5 py-4 rounded-xl transition-all duration-300 font-semibold text-sm ${
                  openIndex === index
                    ? "bg-background border border-border-color shadow-sm text-primary"
                    : "text-text-muted hover:text-text-main hover:bg-accent/50 border border-transparent"
                }`}
              >
                {faq.question}
              </button>
            ))}
          </div>

          {/* Answers Column */}
          <div className="flex-1 bg-background border border-border-color rounded-2xl p-8 min-h-[300px] shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {openIndex >= 0 && faqContent[openIndex] && (
                <motion.div
                  key={openIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-center"
                >
                  <h3 className="text-2xl font-bold text-text-main mb-6">
                    {faqContent[openIndex].question}
                  </h3>
                  <p className="text-lg text-text-muted leading-relaxed">
                    {faqContent[openIndex].answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
