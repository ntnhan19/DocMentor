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
  // ✨ FIX: Thêm trạng thái 'sending' để không bị lỗi type
  status?: "sent" | "error" | "sending";
  attachment?: {
    fileName: string;
    fileSize: number;
    fileType: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string; // ISO string
}

// ✨ FIX: Export alias Message để ChatContainer không bị lỗi import
export type Message = ChatMessage;
