// src/services/chat/chatService.ts

import { ChatMessage, Conversation } from "@/types/chat.types";

// --- Dữ liệu giả (không thay đổi) ---
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Tóm tắt QL Dự án",
    createdAt: "2025-10-26T10:00:00.000Z",
  },
  {
    id: "conv-2",
    title: "Hỏi về Flutter State",
    createdAt: "2025-10-25T15:30:00.000Z",
  },
];
const mockChatHistory: { [key: string]: ChatMessage[] } = {
  "conv-1": [
    /* ... */
  ],
  "conv-2": [
    /* ... */
  ],
};
const suggestedQueries = [
  "Tóm tắt tài liệu...",
  "So sánh...",
  "Liệt kê ý chính...",
];

// --- Các hàm gốc của bạn ---
const createConversationWithContext = async (
  docIds: string[]
): Promise<Conversation> => {
  console.log("Gửi yêu cầu tạo conversation với các document ID:", docIds);
  // Giả lập: Tạo conversation mới và trả về
  await new Promise((res) => setTimeout(res, 500));
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    title: `Trò chuyện về ${docIds.length} tài liệu`,
    createdAt: new Date().toISOString(),
  };
  mockConversations.unshift(newConv); // Thêm vào đầu mảng mock
  mockChatHistory[newConv.id] = []; // Tạo lịch sử chat rỗng
  return newConv;
};

// ✨ 1. Interface mới cho payload khi gửi file
interface SendMessageWithFilePayload {
  message: string;
  file: File;
  conversationId?: string | null;
  sessionId?: string | null;
}

// ✨ 2. Hàm mới để gửi tin nhắn kèm file (sử dụng FormData)
const sendMessageWithFile = async (
  payload: SendMessageWithFilePayload
): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append("message", payload.message);
  formData.append("file", payload.file);

  if (payload.conversationId)
    formData.append("conversationId", payload.conversationId);
  if (payload.sessionId) formData.append("sessionId", payload.sessionId);

  console.log(
    "(MOCK) Đang gửi tin nhắn và file:",
    payload.message,
    payload.file.name
  );

  // --- Giả lập API call ---
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    id: `msg-ai-${Date.now()}`,
    text: `(Câu trả lời giả lập) Tôi đã phân tích file "${payload.file.name}". ${payload.message ? `Đối với câu hỏi "${payload.message}", đây là kết quả...` : "Đây là kết quả phân tích..."}`,
    sender: "ai",
    timestamp: new Date().toISOString(),
  };
  // --- Kết thúc giả lập ---
};

// --- Service ---
export const chatService = {
  createConversationWithContext,
  getConversations: async (): Promise<Conversation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockConversations;
  },
  renameConversation: async (
    id: string,
    newTitle: string
  ): Promise<Conversation> => {
    console.log(`(MOCK) Renaming conversation ${id} to "${newTitle}"`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const conversation = mockConversations.find((c) => c.id === id);
    if (!conversation) throw new Error("Conversation not found");
    conversation.title = newTitle;
    return conversation;
  },
  deleteConversation: async (id: string): Promise<void> => {
    console.log(`(MOCK) Deleting conversation ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockConversations.findIndex((c) => c.id === id);
    if (index > -1) mockConversations.splice(index, 1);
  },
  getChatHistory: async (conversationId: string): Promise<ChatMessage[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockChatHistory[conversationId] || [];
  },
  sendMessage: async (
    _conversationId: string,
    messageText: string,
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    console.log(`(MOCK) Streaming message for: ${messageText}`);
    const fullResponse = `Đây là câu trả lời được stream cho câu hỏi "${messageText}".`;
    const chunks = fullResponse.split(" ");
    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      onChunk(chunk + " ");
    }
  },
  getSuggestedQueries: async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return suggestedQueries;
  },

  // ✨ 3. Thêm hàm mới vào service object
  sendMessageWithFile,
};
