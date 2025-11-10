// src/services/chat/chatService.ts - Unified Mock Service

import { ChatMessage, Conversation } from "@/types/chat.types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

// ✨ MOCK MODE - Đổi thành false để dùng real API
const USE_MOCK_MODE = true;

// --- Types (Real API) ---
interface QueryHistoryResponse {
  queries: QueryResponse[];
  total: number;
}

interface SendFeedbackPayload {
  queryId: string;
  feedback: string;
  rating?: number;
}

// --- Mock Data ---
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
  "conv-1": [],
  "conv-2": [],
};

const MOCK_RESPONSES = [
  "Tài liệu này nói về những nội dung rất quan trọng. Theo phân tích của tôi, điểm chính là: 1) Cấu trúc cơ bản được giải thích rõ ràng, 2) Các ví dụ thực tế hỗ trợ hiểu biết, 3) Kết luận cung cấp hướng dẫn thực tiễn.",
  "Dựa trên tài liệu, tôi có thể tóm tắt: Đây là một hướng dẫn toàn diện bao gồm các khái niệm cơ bản và nâng cao. Các phần chính được trình bày logic và dễ theo dõi.",
  "Tài liệu cung cấp thông tin chi tiết về chủ đề này. Những điểm nổi bật bao gồm: - Định nghĩa rõ ràng - Ứng dụng thực tế - Các trường hợp nghiên cứu - Khuyến nghị để tiếp tục học tập.",
  "Phân tích tài liệu cho thấy: Nội dung được tổ chức tốt với các phần có thể dễ dàng tìm được. Mức độ chi tiết phù hợp cho cả người mới bắt đầu và người có kinh nghiệm.",
  "Tôi đã xem xét tài liệu này và thấy rằng nó bao gồm các khái niệm cốt lõi, ví dụ minh họa và bài tập thực hành. Đây là một tài liệu tham khảo tuyệt vời cho việc học tập.",
];

const suggestedQueries = [
  "Tóm tắt tài liệu này",
  "Những điểm chính là gì?",
  "Giải thích chi tiết hơn",
  "So sánh với...",
  "Tạo câu hỏi trắc nghiệm",
];

// --- Types ---
interface QueryResponse {
  queryId: string;
  message: string;
  response: string;
  timestamp: string;
}

interface SendMessageWithFilePayload {
  message: string;
  file: File;
  conversationId?: string | null;
  sessionId?: string | null;
}

interface StartGuestSessionPayload {
  message: string;
  file?: File;
}

interface CreateNewConversationPayload {
  title: string;
  initialMessage: string;
  file?: File;
}

// --- Helper Functions ---
const getToken = (): string | null => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

const generateMockResponse = (message: string): QueryResponse => {
  const randomResponse =
    MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  const queryId = `query-${Date.now()}`;
  const timestamp = new Date().toISOString();

  return {
    queryId,
    message,
    response: randomResponse,
    timestamp,
  };
};

const createMessage = (
  id: string,
  text: string,
  sender: "user" | "ai",
  file?: File
): ChatMessage => ({
  id,
  text,
  sender,
  timestamp: new Date().toISOString(),
  status: sender === "user" ? "sent" : undefined,
  attachment:
    file && sender === "user"
      ? {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }
      : undefined,
});

const convertToChatMessage = (query: QueryResponse): ChatMessage[] => {
  const messages: ChatMessage[] = [];

  messages.push({
    id: `msg-user-${query.queryId}`,
    text: query.message,
    sender: "user",
    timestamp: query.timestamp,
    status: "sent",
  });

  messages.push({
    id: `msg-ai-${query.queryId}`,
    text: query.response,
    sender: "ai",
    timestamp: new Date(
      new Date(query.timestamp).getTime() + 1000
    ).toISOString(),
  });

  return messages;
};

// --- Main Service ---
export const chatService = {
  // ✨ Query Documents (Real API or Mock)
  queryDocuments: async (payload: {
    message: string;
    file?: File;
    docIds?: string[];
  }): Promise<QueryResponse> => {
    if (USE_MOCK_MODE) {
      console.log(
        "🎭 MOCK MODE: Query response for:",
        payload.message,
        payload.file?.name
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return generateMockResponse(payload.message);
    }

    // Real API
    const formData = new FormData();
    formData.append("query_text", payload.message);

    if (payload.file) {
      formData.append("file", payload.file);
    }

    if (payload.docIds && payload.docIds.length > 0) {
      formData.append("document_ids", JSON.stringify(payload.docIds));
    }

    try {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/query/`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) throw new Error("Query failed");

      const data = await response.json();
      return {
        queryId: data.query_id,
        message: payload.message,
        response: data.answer,
        timestamp: data.created_at,
      };
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  },

  // ✨ Start Guest Session
  startGuestSession: async (
    payload: StartGuestSessionPayload
  ): Promise<{ sessionId: string }> => {
    console.log(
      "(MOCK) Bắt đầu session mới với:",
      payload.message,
      payload.file?.name
    );

    if (USE_MOCK_MODE) {
      await new Promise((res) => setTimeout(res, 1500));

      const newSessionId = `guest-session-${Date.now()}`;
      const userMessageText =
        payload.message || `Phân tích file: ${payload.file?.name}`;

      const userMessage = createMessage(
        "msg-guest-1",
        userMessageText,
        "user",
        payload.file
      );

      const queryResponse = generateMockResponse(userMessageText);
      const aiResponse = createMessage(
        "msg-guest-2",
        queryResponse.response,
        "ai"
      );

      mockChatHistory[newSessionId] = [userMessage, aiResponse];
      return { sessionId: newSessionId };
    }

    // Real API
    const queryResponse = await chatService.queryDocuments({
      message: payload.message,
      file: payload.file,
    });

    const sessionId = queryResponse.queryId;
    const messages = convertToChatMessage(queryResponse);
    mockChatHistory[sessionId] = messages;

    return { sessionId };
  },

  // ✨ Create New Conversation
  createNewConversation: async (
    payload: CreateNewConversationPayload
  ): Promise<Conversation> => {
    console.log("(MOCK) Tạo conversation mới từ Hero:", payload.title);

    if (USE_MOCK_MODE) {
      await new Promise((res) => setTimeout(res, 1000));

      const newConvId = `conv-${Date.now()}`;

      const userMessage = createMessage(
        `msg-user-${Date.now()}`,
        payload.initialMessage,
        "user",
        payload.file
      );

      const queryResponse = generateMockResponse(payload.initialMessage);
      const aiResponse = createMessage(
        `msg-ai-${Date.now()}`,
        queryResponse.response,
        "ai"
      );

      const newConversation: Conversation = {
        id: newConvId,
        title: payload.title,
        createdAt: new Date().toISOString(),
      };

      mockConversations.unshift(newConversation);
      mockChatHistory[newConvId] = [userMessage, aiResponse];

      console.log("✓ Conversation tạo thành công:", newConvId);
      return newConversation;
    }

    // Real API
    const queryResponse = await chatService.queryDocuments({
      message: payload.initialMessage,
      file: payload.file,
    });

    const newConversation: Conversation = {
      id: queryResponse.queryId,
      title: payload.title,
      createdAt: queryResponse.timestamp,
    };

    mockConversations.unshift(newConversation);
    const messages = convertToChatMessage(queryResponse);
    mockChatHistory[newConversation.id] = messages;

    return newConversation;
  },

  // ✨ Send Message With File
  sendMessageWithFile: async (
    payload: SendMessageWithFilePayload
  ): Promise<ChatMessage> => {
    console.log("(MOCK) Đang gửi tin nhắn và file:", payload.message);

    if (USE_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const contextId = payload.conversationId || payload.sessionId;
      const queryResponse = generateMockResponse(payload.message);

      const aiResponse = createMessage(
        `msg-ai-${Date.now()}`,
        queryResponse.response,
        "ai"
      );

      if (contextId && mockChatHistory[contextId]) {
        mockChatHistory[contextId].push(aiResponse);
      }

      return aiResponse;
    }

    // Real API
    const queryResponse = await chatService.queryDocuments({
      message: payload.message,
      file: payload.file,
    });

    const contextId = payload.conversationId || payload.sessionId;
    const messages = convertToChatMessage(queryResponse);

    if (contextId && mockChatHistory[contextId]) {
      mockChatHistory[contextId].push(...messages);
    }

    return messages[1]; // Return AI response
  },

  // ✨ Get Conversations
  getConversations: async (): Promise<Conversation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockConversations;
  },

  // ✨ Get Chat History
  getChatHistory: async (conversationId: string): Promise<ChatMessage[]> => {
    console.log(`(MOCK) Getting chat history for: ${conversationId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockChatHistory[conversationId] || [];
  },

  // ✨ Send Message (1 câu trả lời duy nhất - không stream)
  sendMessage: async (
    conversationId: string,
    messageText: string
  ): Promise<void> => {
    console.log(`(MOCK) Sending message for conversation: ${conversationId}`);

    if (USE_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const queryResponse = generateMockResponse(messageText);

      // Thêm user message
      if (mockChatHistory[conversationId]) {
        mockChatHistory[conversationId].push(
          createMessage(`msg-user-${Date.now()}`, messageText, "user")
        );

        // Thêm AI response (1 câu, không stream)
        mockChatHistory[conversationId].push(
          createMessage(`msg-ai-${Date.now()}`, queryResponse.response, "ai")
        );
      }
    } else {
      // Real API
      const response = await chatService.queryDocuments({
        message: messageText,
      });

      if (mockChatHistory[conversationId]) {
        const messages = convertToChatMessage(response);
        mockChatHistory[conversationId].push(...messages);
      }
    }
  },

  // ✨ Rename Conversation
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

  // ✨ Delete Conversation
  deleteConversation: async (id: string): Promise<void> => {
    console.log(`(MOCK) Deleting conversation ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const index = mockConversations.findIndex((c) => c.id === id);
    if (index > -1) mockConversations.splice(index, 1);

    delete mockChatHistory[id];
  },

  // ✨ Create Conversation With Context
  createConversationWithContext: async (
    docIds: string[]
  ): Promise<Conversation> => {
    console.log("(MOCK) Tạo conversation với các document ID:", docIds);

    await new Promise((res) => setTimeout(res, 500));

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: `Trò chuyện về ${docIds.length} tài liệu`,
      createdAt: new Date().toISOString(),
    };

    mockConversations.unshift(newConv);
    mockChatHistory[newConv.id] = [];

    return newConv;
  },

  // ✨ Get Suggested Queries
  getSuggestedQueries: async (): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return suggestedQueries;
  },

  // ✨ Load Chat History (Adapter)
  loadChatHistory: async (): Promise<ChatMessage[]> => {
    try {
      const conversations = await chatService.getConversations();
      const messages: ChatMessage[] = [];

      for (const conv of conversations) {
        const convMessages = await chatService.getChatHistory(conv.id);
        messages.push(...convMessages);
      }

      return messages;
    } catch (error) {
      console.error("Failed to load chat history:", error);
      return [];
    }
  },

  // ✨ Send Chat Message (Adapter)
  sendChatMessage: async (
    message: string,
    file?: File,
    docIds?: string[]
  ): Promise<ChatMessage[]> => {
    try {
      const response = await chatService.queryDocuments({
        message,
        file,
        docIds,
      });

      return convertToChatMessage(response);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  // ✨ Get Query History (Real API)
  getQueryHistory: async (
    limit: number = 50
  ): Promise<QueryHistoryResponse> => {
    if (USE_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        queries: mockConversations.map((conv) => ({
          queryId: conv.id,
          message: conv.title,
          response: "Mock response",
          timestamp: conv.createdAt,
        })),
        total: mockConversations.length,
      };
    }

    try {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/query/history?limit=${limit}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      console.log("✓ Query history:", data);

      return data;
    } catch (error) {
      console.error("History error:", error);
      throw error;
    }
  },

  // ✨ Get Query Detail (Real API)
  getQueryDetail: async (queryId: string): Promise<QueryResponse> => {
    if (USE_MOCK_MODE) {
      return generateMockResponse("Mock detail");
    }

    try {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/query/${queryId}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch query detail");

      const data = await response.json();
      console.log("✓ Query detail:", data);

      return data;
    } catch (error) {
      console.error("Detail error:", error);
      throw error;
    }
  },

  // ✨ Delete Query (Real API)
  deleteQuery: async (queryId: string): Promise<void> => {
    if (USE_MOCK_MODE) {
      console.log("🎭 MOCK MODE: Query deleted:", queryId);
      return;
    }

    try {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/query/${queryId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) throw new Error("Failed to delete query");

      console.log("✓ Query deleted:", queryId);
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  },

  // ✨ Submit Feedback (Real API)
  submitFeedback: async (payload: SendFeedbackPayload): Promise<void> => {
    if (USE_MOCK_MODE) {
      console.log("🎭 MOCK MODE: Feedback submitted:", payload.queryId);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/query/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      console.log("✓ Feedback submitted for query:", payload.queryId);
    } catch (error) {
      console.error("Feedback error:", error);
      throw error;
    }
  },
};
