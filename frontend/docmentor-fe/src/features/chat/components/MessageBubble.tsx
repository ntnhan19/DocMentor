// Chat component
import React from "react";
import { ChatMessage } from "@/types/chat.types";
// ✨ Import icon để hiển thị loại file
import { FiFileText, FiFile } from "react-icons/fi";

interface MessageBubbleProps {
  message: ChatMessage;
}

// ✨ Thêm các hàm helper này vào đầu file
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf"))
    return <FiFileText className="w-5 h-5 text-red-400" />;
  if (fileType.includes("doc"))
    return <FiFileText className="w-5 h-5 text-blue-400" />;
  return <FiFile className="w-5 h-5 text-gray-400" />;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
            {/* Avatar */}      {!isUser}      {/* Message Content */}     {" "}
      <div
        className={`max-w-xl rounded-lg px-4 py-2 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        }`}
      >
        {/* ✨ THÊM MỚI: Khối JSX này chỉ hiển thị khi có file đính kèm */}
        {message.attachment && (
          <div className="mb-2 p-2 bg-black/10 dark:bg-black/20 rounded-md border border-gray-500/20">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getFileIcon(message.attachment.fileType)}
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm truncate">
                  {message.attachment.fileName}
                </p>
                <p className="text-xs opacity-70">
                  {formatBytes(message.attachment.fileSize)}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* --- Phần JSX gốc của bạn được giữ nguyên --- */}       {" "}
        {message.text && <p>{message.text}</p>}       {" "}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 border-t border-gray-300 dark:border-gray-600 pt-2 text-xs">
                        <h4 className="font-bold mb-1">Nguồn tham khảo:</h4>   
                   {" "}
            {message.sources.map((source, index) => (
              <a
                href={`/documents/${source.documentId}`}
                key={index}
                className="block text-blue-300 hover:underline"
              >
                                - {source.documentTitle} (Trang{" "}
                {source.pageNumber || "N/A"})              {" "}
              </a>
            ))}
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};
