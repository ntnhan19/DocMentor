//============================================
// ChatInput.tsx
// ============================================
import React, { useState, useRef } from "react";
import Button from "@/components/common/Button";

interface ChatInputProps {
  // Hàm này giờ có thể nhận thêm một file (tùy chọn)
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Kích hoạt input ẩn khi bấm nút đính kèm
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Xóa file đã chọn
  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý khi gửi form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cho phép gửi khi có text hoặc có file
    if ((inputValue.trim() || selectedFile) && !isLoading) {
      onSendMessage(inputValue.trim(), selectedFile || undefined);
      setInputValue("");
      handleClearFile(); // Reset cả file sau khi gửi
    }
  };

  return (
    <div className="border-t border-primary/20 bg-accent/40 backdrop-blur-sm p-4">
      {/* Hiển thị thông tin file đã chọn */}
      {selectedFile && (
        <div className="mb-2 px-3 py-2 bg-accent/80 rounded-lg flex justify-between items-center text-sm animate-fade-in">
          <span className="truncate text-white/80">
            Đang đính kèm:{" "}
            <span className="font-medium text-white">{selectedFile.name}</span>
          </span>
          <button
            onClick={handleClearFile}
            className="ml-2 text-text-muted hover:text-white text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Input ẩn để xử lý việc chọn file */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.docx,.txt,.pptx" // Giới hạn các loại file được phép
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hỏi bất cứ điều gì về tài liệu của bạn..."
            className="w-full px-4 py-3 bg-accent/60 border border-primary/20 rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || (!inputValue.trim() && !selectedFile)} // Cập nhật điều kiện disabled
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Đang gửi...</span>
            </>
          ) : (
            <>
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Gửi</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
