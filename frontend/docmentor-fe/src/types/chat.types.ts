// src/types/chat.types.ts

// Chat types
export interface SourceReference {
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string; // ISO string format
  sources?: SourceReference[];
  status?: "sent" | "error";
  // ✨ Thêm thuộc tính này để lưu thông tin file đính kèm
  attachment?: {
    fileName: string;
    fileSize: number; // lưu dưới dạng bytes
    fileType: string; // ví dụ: 'pdf', 'docx'
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string; // ISO string
}
