// src/services/api/queryApiService.ts - Real API Service with Axios

import apiClient from "./apiClient";

// ============================================================
// TYPES
// ============================================================

interface SourceSchema {
  document_id: number;
  document_title?: string;
  page_number?: number;
  similarity_score?: number;
  text?: string;
}


interface QueryResponse {
  query_id: number | null;
  query_text: string;
  answer: string;
  is_processing?: boolean; // ✅ Thêm cờ nhận diện trạng thái đang xử lý
  sources: SourceSchema[];
  processing_time_ms: number;
  confidence_score: number;
  created_at: string;
}

interface QueryHistory {
  queries: QueryResponse[];
  total: number;
}

interface QueryFeedbackCreate {
  query_id: number;
  rating: number; // 1-5
  feedback_text?: string;
}


interface QueryStatsResponse {
  total_queries: number;
  avg_rating: number;
  activity_last_7_days: Array<{ date: string; count: number }>;
}

interface HistoryParams {
  skip?: number;
  limit?: number;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  search?: string;
  sort_by?: "date" | "rating" | "relevance";
  order?: "asc" | "desc";
}



// ============================================================
// AXIOS INSTANCE SETUP
// ============================================================

class QueryApiService {
  // ✅ API: Gửi câu hỏi (Query / RAG)
  async sendQuery(
    queryText: string,
    documentIds: number[],
    maxResults: number = 15, // Tăng lên 15 để hỗ trợ so sánh
    conversationId?: number
  ): Promise<QueryResponse> {
    try {
      // Logic URL param
      const url = conversationId
        ? `/query/?conversation_id=${conversationId}`
        : "/query/";

      const response = await apiClient.post<QueryResponse>(url, {
        query_text: queryText,
        document_ids: documentIds,
        max_results: maxResults,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Send query failed:", error);
      throw error; // Để component hiển thị lỗi
    }
  }

  // ✅ API: Gửi câu hỏi dạng STREAM (REAL-TIME)
  async sendQueryStream(
    queryText: string,
    documentIds: number[],
    onChunk: (data: { chunk?: string; answer?: string; sources?: any[]; is_done?: boolean; is_processing?: boolean; query_id?: number }) => void,
    conversationId?: number,
    maxResults: number = 15
  ): Promise<void> {
    try {
      // 🔒 FIX: Lấy đúng KEY token như trong apiClient.ts
      const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
      const url = `${apiClient.defaults.baseURL}${conversationId ? `/query/?conversation_id=${conversationId}` : "/query/"}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query_text: queryText,
          document_ids: documentIds,
          max_results: maxResults,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // SSE parsing: Tách theo \n\n
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Giữ lại phần chưa hoàn chỉnh cuối cùng

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              onChunk(data);
            } catch (e) {
              console.error("❌ Error parsing stream line:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Streaming query failed:", error);
      throw error;
    }
  }

  // ✅ API: Lấy lịch sử chat
  async getQueryHistory(params?: HistoryParams): Promise<QueryHistory> {
    const response = await apiClient.get<QueryHistory>("/query/history", {
      params: params, // Axios tự động xử lý việc ghép query string (?skip=...)
    });
    return response.data;
  }

  // ✅ API: Gửi Feedback
  async submitFeedback(feedback: QueryFeedbackCreate): Promise<any> {
    const response = await apiClient.post("/query/feedback", {
      query_id: feedback.query_id,
      rating: feedback.rating,
      feedback_text: feedback.feedback_text,
    });
    return response.data;
  }

  // ✅ API: Lấy thống kê
  async getQueryStats(): Promise<QueryStatsResponse> {
    const response = await apiClient.get<QueryStatsResponse>("/query/stats");
    return response.data;
  }
}

export const queryApiService = new QueryApiService();
