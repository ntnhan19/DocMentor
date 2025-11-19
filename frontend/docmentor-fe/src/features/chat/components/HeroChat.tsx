import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/common/Button";

interface HeroChatProps {
  onStartChat: (messageText: string, file?: File) => Promise<void>;
  initialFile?: File | null;
  initialMessage?: string;
}

const HeroChat: React.FC<HeroChatProps> = ({
  onStartChat,
  initialFile,
  initialMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✨ THÊM: useEffect để set initial file + message
  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
    }
    if (initialMessage) {
      setInputValue(initialMessage);
    }
  }, [initialFile, initialMessage]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // ✨ THAY ĐỔI: Chỉ gọi callback, không tự render ChatContainer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!inputValue.trim() && !selectedFile) || isLoading) return;

    setIsLoading(true);

    try {
      // ✨ DÙNG: onStartChat - gọi callback
      await onStartChat(inputValue, selectedFile || undefined);
      // Reset input sau khi submit thành công
      setInputValue("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Lỗi khi bắt đầu chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex items-center">
      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".pdf,.docx,.txt,.pptx"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-accent/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/60 backdrop-blur-sm border border-primary/20 rounded-full mb-8 animate-fade-in">
            <svg
              className="w-5 h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-white font-medium">
              Giới thiệu DocMentor AI
            </span>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              "DocMentor —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Smarter Docs, Smarter You."
              </span>{" "}
            </h1>

            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-4">
              Hỏi đáp, tóm tắt và phân tích bất kỳ tài liệu nào bằng AI.
            </p>

            <p className="text-lg text-text-muted/80 max-w-2xl mx-auto">
              Trợ lý học tập thông minh của bạn với khả năng xử lý tài liệu và
              trò chuyện tự nhiên.
            </p>
          </div>

          {/* Input Container */}
          <div className="w-full max-w-4xl mx-auto animate-scale-up">
            <div className="relative px-2">
              {/* Main Input Box */}
              <div className="relative bg-accent/60 backdrop-blur-xl border border-primary/30 rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-xl"></div>

                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex flex-col gap-3 p-10">
                    {/* File Display */}
                    {selectedFile && (
                      <div className="flex items-center justify-between bg-accent/80 text-white px-4 py-2 rounded-xl border border-primary/30">
                        <span className="flex items-center gap-2 text-sm">
                          📄 {selectedFile.name}
                        </span>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-400 hover:text-red-500 font-bold text-lg"
                          title="Xóa file"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Input Row */}
                    <div className="flex items-center gap-3">
                      {/* Add File Button */}
                      <Button
                        type="button"
                        onClick={handleAttachClick}
                        className="p-1.5 text-text-muted hover:text-primary transition-colors duration-300"
                        title="Đính kèm file"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                      </Button>

                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Hỏi bất cứ điều gì về tài liệu của bạn..."
                        className="flex-1 bg-transparent text-white placeholder-text-muted/60 text-lg outline-none"
                      />

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* AI Agent Selector */}
                        <Button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-white hover:bg-primary/20 rounded-lg transition-all"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          <span className="text-sm">Docmentor Agent</span>
                          <svg
                            className="w-2 h-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Button>

                        {/* Plan Button */}
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-2 text-text-muted hover:text-white hover:bg-primary/20 rounded-lg transition-all"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          ></svg>
                        </button>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={
                            (!inputValue.trim() && !selectedFile) || isLoading
                          }
                          className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                        >
                          <span>{isLoading ? "Đang tải..." : "Bắt đầu"}</span>

                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Bottom Import Options 
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-muted">
                <span>hoặc tải lên từ</span>

                <button className="flex items-center gap-2 px-4 py-2 bg-accent/60 backdrop-blur-sm border border-primary/10 rounded-lg hover:border-primary/30 hover:bg-accent/80 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a.75.75 0 01.75.75v5.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 7.26a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" />
                    <path d="M5.273 4.5a1.25 1.25 0 00-1.205.918l-1.523 5.52c-.006.02-.01.041-.015.062H6a1 1 0 01.894.553l.448.894a1 1 0 00.894.553h3.438a1 1 0 00.86-.49l.606-1.02A1 1 0 0114 11h3.47a1.318 1.318 0 00-.015-.062l-1.523-5.52a1.25 1.25 0 00-1.205-.918h-.977a.75.75 0 010-1.5h.977a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.732V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h.977a.75.75 0 010 1.5h-.977z" />
                  </svg>
                  <span>Figma</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-accent/60 backdrop-blur-sm border border-primary/10 rounded-lg hover:border-primary/30 hover:bg-accent/80 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroChat;
