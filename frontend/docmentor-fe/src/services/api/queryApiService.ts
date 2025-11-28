// General API client
// src/services/api/queryApiService.ts - Real API Service with Axios

import axios, { AxiosInstance, AxiosError } from "axios";

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

interface QueryRequest {
  query_text: string;
  document_ids: number[];
  max_results?: number;
}

interface QueryResponse {
  query_id: number | null;
  query_text: string;
  answer: string;
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

interface QueryFeedbackResponse {
  rating: number;
  text?: string;
  created_at: string;
  user_id: number;
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

interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

// ============================================================
// AXIOS INSTANCE SETUP
// ============================================================

class QueryApiService {
  private axiosInstance: AxiosInstance;
  private apiBaseUrl: string;

  constructor() {
    // ✨ FIX: Thay đổi giá trị mặc định (||) thành URL đã deploy
    this.apiBaseUrl =
      (import.meta as any).env?.VITE_API_URL ||
      "https://docmentor-api.onrender.com";

    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }); // ✨ Request Interceptor - Add Auth Token

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    ); // ✨ Response Interceptor - Handle Errors

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          status: error.response?.status || 500,
          message: error.message,
          detail:
            (error.response?.data as any)?.detail || error.response?.statusText,
        };

        console.error("API Error:", apiError); // Handle 401 Unauthorized

        if (error.response?.status === 401) {
          console.warn("Unauthorized: redirecting to login"); // TODO: Redirect to login page
          localStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_token");
        }

        return Promise.reject(apiError);
      }
    );
  } // ============================================================
  // HELPER METHODS
  // ============================================================

  private getAuthToken(): string | null {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  }

  private handleError(error: any): never {
    if (error.status && error.message) {
      throw error;
    }
    throw {
      status: 500,
      message: "An unknown error occurred",
      detail: error.message,
    };
  } // ============================================================
  // QUERY OPERATIONS
  // ============================================================
  /**
   * 📝 Send a query to AI/RAG service
   */

  async sendQuery(
    queryText: string,
    documentIds: number[],
    maxResults: number = 5
  ): Promise<QueryResponse> {
    try {
      console.log("📤 Sending query:", { queryText, documentIds });

      const response = await this.axiosInstance.post<QueryResponse>("/query/", {
        query_text: queryText,
        document_ids: documentIds,
        max_results: maxResults,
      });

      console.log("✓ Query response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Send query failed:", error);
      this.handleError(error);
    }
  } /**
   * 📋 Get query history with filters and pagination
   */

  async getQueryHistory(params?: HistoryParams): Promise<QueryHistory> {
    try {
      console.log("📤 Fetching query history:", params);

      const queryParams = new URLSearchParams();
      if (params?.skip !== undefined)
        queryParams.append("skip", params.skip.toString());
      if (params?.limit !== undefined)
        queryParams.append("limit", params.limit.toString());
      if (params?.date_from) queryParams.append("date_from", params.date_from);
      if (params?.date_to) queryParams.append("date_to", params.date_to);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.order) queryParams.append("order", params.order);

      const response = await this.axiosInstance.get<QueryHistory>(
        `/query/history?${queryParams.toString()}`
      );

      console.log("✓ History fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch history failed:", error);
      this.handleError(error);
    }
  } /**
   * 🔍 Get details of a single query
   */

  async getQueryDetail(queryId: number): Promise<QueryResponse> {
    try {
      console.log("📤 Fetching query detail:", queryId);

      const response = await this.axiosInstance.get<QueryResponse>(
        `/query/${queryId}`
      );

      console.log("✓ Query detail:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch query detail failed:", error);
      this.handleError(error);
    }
  } /**
   * 🗑️ Delete a query
   */

  async deleteQuery(
    queryId: number
  ): Promise<{ message: string; deleted_id: number }> {
    try {
      console.log("📤 Deleting query:", queryId);

      const response = await this.axiosInstance.delete<{
        message: string;
        deleted_id: number;
      }>(`/query/${queryId}`);

      console.log("✓ Query deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Delete query failed:", error);
      this.handleError(error);
    }
  } // ============================================================
  // FEEDBACK OPERATIONS
  // ============================================================
  /**
   * ⭐ Submit feedback/rating for a query
   */

  async submitFeedback(feedback: QueryFeedbackCreate): Promise<any> {
    try {
      console.log("📤 Submitting feedback:", feedback); // Validate rating

      if (feedback.rating < 1 || feedback.rating > 5) {
        throw {
          status: 422,
          message: "Invalid rating",
          detail: "Rating must be between 1 and 5",
        };
      }

      const response = await this.axiosInstance.post("/query/feedback", {
        query_id: feedback.query_id,
        rating: feedback.rating,
        feedback_text: feedback.feedback_text || null,
      });

      console.log("✓ Feedback submitted:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Submit feedback failed:", error);
      this.handleError(error);
    }
  } /**
   * 📖 Get feedback for a query
   */

  async getFeedback(queryId: number): Promise<QueryFeedbackResponse | null> {
    try {
      console.log("📤 Fetching feedback for query:", queryId);

      const response = await this.axiosInstance.get<QueryFeedbackResponse>(
        `/query/${queryId}/feedback`
      );

      console.log("✓ Feedback fetched:", response.data);
      return response.data;
    } catch (error) {
      // 404 is acceptable (no feedback yet)
      if ((error as any).status === 404) {
        console.log("ℹ️ No feedback found for query:", queryId);
        return null;
      }
      console.error("❌ Fetch feedback failed:", error);
      this.handleError(error);
    }
  } // ============================================================
  // STATISTICS
  // ============================================================
  /**
   * 📊 Get query statistics
   */

  async getQueryStats(): Promise<QueryStatsResponse> {
    try {
      console.log("📤 Fetching query stats");

      const response =
        await this.axiosInstance.get<QueryStatsResponse>("/query/stats");

      console.log("✓ Stats fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch stats failed:", error);
      this.handleError(error);
    }
  } // ============================================================
  // UTILITY METHODS
  // ============================================================
  /**
   * Set auth token (call this after login)
   */

  setAuthToken(token: string, persistent: boolean = false): void {
    if (persistent) {
      localStorage.setItem("auth_token", token);
      sessionStorage.removeItem("auth_token");
    } else {
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
    }
  } /**
   * Clear auth token (call this on logout)
   */

  clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  } /**
   * Get axios instance for advanced usage
   */

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ============================================================
// SINGLETON EXPORT
// ============================================================

export const queryApiService = new QueryApiService();

export type {
  QueryRequest,
  QueryResponse,
  QueryHistory,
  QueryFeedbackCreate,
  QueryFeedbackResponse,
  QueryStatsResponse,
  HistoryParams,
  SourceSchema,
  ApiError,
};
