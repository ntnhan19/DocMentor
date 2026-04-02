// src/services/chat/chatService.ts

import apiClient from "@/services/api/apiClient";
import { queryApiService } from "@/services/api/queryApiService";
import { ChatMessage, Conversation } from "@/types/chat.types";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const convertToChatMessages = (queries: any[]): ChatMessage[] => {
  const messages: ChatMessage[] = [];

  queries.forEach((query) => {
    // 1. User message (Giữ nguyên)
    const attachedDocs =
      query.documents?.map((doc: any) => ({
        id: doc.id.toString(),
        title: doc.title,
      })) || [];

    messages.push({
      id: `msg-user-${query.id}`,
      text: query.query_text,
      sender: "user",
      timestamp: query.created_at,
      status: "sent",
      attachedDocuments: attachedDocs.length > 0 ? attachedDocs : undefined,
    });

    // 2. AI message (SỬA ĐOẠN NÀY)
    if (query.response_text) {
      // 🔥 FIX QUAN TRỌNG: Xử lý sources dù nó là String hay Array
      let parsedSources = [];
      try {
        if (typeof query.sources === "string") {
          // Trường hợp 1: Database trả về chuỗi JSON (khi reload trang)
          parsedSources = JSON.parse(query.sources);
        } else if (Array.isArray(query.sources)) {
          // Trường hợp 2: API trả về mảng object (khi vừa chat xong)
          parsedSources = query.sources;
        }
      } catch (error) {
        console.error("❌ Lỗi parse sources:", error, query.sources);
        parsedSources = [];
      }

      // Map thủ công từ snake_case (Backend) sang camelCase (Frontend)
      const mappedSources = parsedSources.map((src: any) => ({
        documentId: src.documentId ?? (src.document_id?.toString()),
        documentTitle: src.documentTitle ?? (src.document_title || "Tài liệu"),
        pageNumber: src.pageNumber ?? src.page_number,
        // Backend có thể trả về 'score' hoặc 'similarity_score' tùy endpoint
        similarityScore: src.similarityScore ?? (src.score || src.similarity_score),
        text: src.text, // ✅ Bổ sung nội dung đoạn trích dẫn (snippet)
      }));

      messages.push({
        id: `msg-ai-${query.id}`,
        text: query.response_text,
        sender: "ai",
        timestamp: query.created_at,
        sources: mappedSources, // ✅ Gán biến đã xử lý kỹ
      });
    }
  });

  // Sắp xếp lại theo thời gian để đảm bảo tin nhắn hiển thị đúng thứ tự
  return messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// ============================================================
// CHAT SERVICE
// ============================================================

export const chatService = {
  // ✅ 1. Lấy danh sách hội thoại
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiClient.get("/conversations/", {
        params: { skip: 0, limit: 100 },
      });

      return response.data.conversations.map((conv: any) => ({
        id: conv.id.toString(),
        title: conv.title,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        isPinned: conv.is_pinned || false,
        documentCount: conv.document_count || 0,
      }));
    } catch (error) {
      console.error("Get conversations error", error);
      return [];
    }
  },

  // ✅ 2. Lấy nội dung chi tiết cuộc trò chuyện
  getChatHistory: async (conversationId: string): Promise<ChatMessage[]> => {
    if (conversationId.startsWith("temp-")) return [];

    try {
      const response = await apiClient.get(`/conversations/${conversationId}`);
      // Log kiểm tra dữ liệu trả về (bạn có thể tắt đi sau khi fix xong)
      // console.log("📥 Raw History Data:", response.data);
      return convertToChatMessages(response.data.queries || []);
    } catch (error) {
      console.error("Get history error", error);
      return [];
    }
  },

  // ✅ 3. Tạo cuộc trò chuyện mới
  createNewConversation: async (payload: {
    title: string;
    initialMessage: string;
    documentIds?: (string | number)[];
  }): Promise<Conversation> => {
    const numericDocIds = (payload.documentIds || [])
      .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
      .filter((id): id is number => !isNaN(id));

    // Bước 1: Tạo Conversation rỗng
    const response = await apiClient.post("/conversations/", {
      title: payload.title,
      document_ids: numericDocIds,
    });

    const conversationId = response.data.id;

    // Bước 2: Gửi câu hỏi đầu tiên vào conversation đó
    await queryApiService.sendQuery(
      payload.initialMessage,
      numericDocIds,
      15, // maxResults
      conversationId
    );

    return {
      id: conversationId.toString(),
      title: response.data.title,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      isPinned: false,
    };
  },

  // ✅ 4. Đổi tên
  renameConversation: async (id: string, newTitle: string): Promise<void> => {
    await apiClient.put(`/conversations/${id}`, { title: newTitle });
  },

  // ✅ 5. Ghim/Bỏ ghim (Update)
  updateConversation: async (id: string, updates: { isPinned?: boolean }) => {
    await apiClient.put(`/conversations/${id}`, updates);
  },

  // ✅ 6. Xóa
  deleteConversation: async (id: string): Promise<void> => {
    await apiClient.delete(`/conversations/${id}`);
  },

  // ✅ 7. Guest Session
  startGuestSession: async (payload: { message: string; file?: File }) => {
    const response = await queryApiService.sendQuery(payload.message, [], 5);
    return { sessionId: response.query_id?.toString() || "" };
  },

  getSuggestedQueries: async () => [
    "Tóm tắt tài liệu này",
    "Những điểm chính là gì?",
    "So sánh các khái niệm",
    "Tạo câu hỏi trắc nghiệm",
  ],
};
