//============================================
// ChatInput.tsx - UPDATED Logic for ChatContainer Integration
// ============================================
import React, { useState, useRef } from "react";
import Button from "@/components/common/Button";

interface ChatInputProps {
  // Cập nhật signature để phù hợp với cách ChatContainer gọi
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onOpenDocumentModal?: () => void;

  // ✨ THÊM: Props để nhận state file từ ChatContainer
  onFileSelect?: (file: File) => void;
  selectedFile?: File | null;
  onClearFile?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onOpenDocumentModal,
  onFileSelect,
  selectedFile, // Nhận từ props thay vì state nội bộ
  onClearFile,
}) => {
  const [inputValue, setInputValue] = useState("");
  // ❌ Đã xóa state selectedFile nội bộ để dùng props
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✨ GỌI Callback của cha thay vì set state nội bộ
      if (onFileSelect) {
        onFileSelect(file);
      }
      setIsMenuOpen(false);
    }
    // Reset value để cho phép chọn lại cùng file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    // ✨ GỌI Callback của cha
    if (onClearFile) {
      onClearFile();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDocumentButtonClick = () => {
    onOpenDocumentModal?.();
    setIsMenuOpen(false);
  };

  // Đóng menu khi click ngoài
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra selectedFile từ props
    if ((inputValue.trim() || selectedFile) && !isLoading) {
      // ChatContainer đã nắm giữ selectedFile, nên chỉ cần gửi text
      onSendMessage(inputValue.trim());
      setInputValue("");
      // Không cần gọi handleClearFile() ở đây vì ChatContainer sẽ tự reset file sau khi gửi thành công
    }
  };

  return (
    <div className="border-t border-primary/20 bg-accent/40 backdrop-blur-sm p-4">
      {/* Sử dụng selectedFile từ props để hiển thị */}
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.docx,.txt,.pptx"
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
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            ref={menuRef}
          >
            <Button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-text-muted hover:text-primary transition-colors duration-300"
              title="Thêm tài liệu"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V6a1 1 0 011-1z" />
              </svg>
            </Button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-accent/95 backdrop-blur-lg border border-primary/30 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                {/* Tài liệu của tôi */}
                <button
                  type="button"
                  onClick={handleDocumentButtonClick}
                  className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-primary/20 transition-colors border-b border-primary/10"
                >
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium">Tài liệu của tôi</p>
                    <p className="text-xs text-text-muted">Chọn từ thư viện</p>
                  </div>
                </button>

                {/* Tải từ máy tính */}
                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-primary/20 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-secondary flex-shrink-0"
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
                  <div className="text-left">
                    <p className="font-medium">Tải từ máy tính</p>
                    <p className="text-xs text-text-muted">Upload file</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || (!inputValue.trim() && !selectedFile)}
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
