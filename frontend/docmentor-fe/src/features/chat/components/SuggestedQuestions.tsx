// Chat component
import React from "react";
import { MessageSquare, Sparkles, Zap, Brain } from "lucide-react";

interface SuggestedQueriesProps {
  queries: string[];
  onQueryClick: (query: string) => void;
  isLoading: boolean;
}

export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({
  queries,
  onQueryClick,
  isLoading,
}) => {
  // Icons để làm đẹp các suggested queries
  const icons = [Sparkles, Zap, Brain, MessageSquare];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
      {/* Icon chính với gradient */}
      <div className="relative mb-6 animate-scale-up">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl shadow-2xl">
          <MessageSquare className="w-12 h-12 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Tiêu đề với gradient text */}
      <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-slide-in-right">
        Bắt đầu cuộc trò chuyện
      </h2>

      <p className="mb-8 text-text-muted text-lg max-w-md">
        Chọn một câu hỏi gợi ý hoặc tự do đặt câu hỏi của bạn
      </p>

      {/* Grid các suggested queries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {queries.map((query, index) => {
          const Icon = icons[index % icons.length];
          return (
            <button
              key={index}
              onClick={() => onQueryClick(query)}
              className="group relative p-5 bg-accent/50 backdrop-blur-sm border border-primary/20 rounded-xl text-left 
                       hover:bg-accent hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20
                       transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1
                       animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors duration-300" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-white/90 group-hover:text-white text-base leading-relaxed transition-colors duration-300">
                    {query}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom shine effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div
        className="mt-8 flex items-center gap-2 text-text-muted text-sm animate-fade-in"
        style={{ animationDelay: "0.6s" }}
      >
        <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
        <span>Hoặc nhập câu hỏi của bạn ở phía dưới</span>
      </div>
    </div>
  );
};
