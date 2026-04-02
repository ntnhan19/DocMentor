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
