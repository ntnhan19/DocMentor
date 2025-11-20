// src/services/api/documentApiService.ts - Real API Service for Documents

import axios, { AxiosInstance } from "axios";

// ============================================================
// TYPES
// ============================================================

interface DocumentResponse {
  id: string | number; // ✅ Accept both string and number
  user_id: number;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  metadata_?: Record<string, any>;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

interface DocumentListResponse {
  total: number;
  documents: DocumentResponse[];
}

interface DocumentUploadResponse {
  message: string;
  document: DocumentResponse;
}

interface DocumentStatsResponse {
  total_documents: number;
  total_size: number;
  by_type: Record<string, number>;
  processed_count: number;
  unprocessed_count: number;
}

interface DocumentFilters {
  skip?: number;
  limit?: number;
  search?: string;
  file_type?: string;
  sort_by?: "date_desc" | "date_asc" | "title_asc" | "size_asc" | "size_desc";
}

interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

// ============================================================
// DOCUMENT API SERVICE
// ============================================================

class DocumentApiService {
  private axiosInstance: AxiosInstance;
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl =
      (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";

    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 60000, // 60s for file upload
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✨ Request Interceptor - Add Auth Token
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
    );

    // ✨ Response Interceptor - Handle Errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: any) => {
        const apiError: ApiError = {
          status: error.response?.status || 500,
          message: error.message,
          detail: error.response?.data?.detail || error.response?.statusText,
        };

        console.error("API Error:", apiError);

        if (error.response?.status === 401) {
          console.warn("Unauthorized: redirecting to login");
          localStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_token");
        }

        return Promise.reject(apiError);
      }
    );
  }

  // ============================================================
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
  }

  // ============================================================
  // DOCUMENT OPERATIONS
  // ============================================================

  /**
   * 📄 Upload a document
   */
  async uploadDocument(
    file: File,
    title?: string
  ): Promise<DocumentUploadResponse> {
    try {
      console.log("📤 Uploading document:", { fileName: file.name, title });

      const formData = new FormData();
      formData.append("file", file);
      if (title) {
        formData.append("title", title);
      }

      const response = await this.axiosInstance.post<DocumentUploadResponse>(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✓ Document uploaded:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Upload document failed:", error);
      this.handleError(error);
    }
  }

  /**
   * 📋 Get user documents with filters
   */
  async getDocuments(filters?: DocumentFilters): Promise<DocumentListResponse> {
    try {
      console.log("📤 Fetching documents:", filters);

      const params = new URLSearchParams();
      if (filters?.skip !== undefined)
        params.append("skip", filters.skip.toString());
      if (filters?.limit !== undefined)
        params.append("limit", filters.limit.toString());
      if (filters?.search) params.append("search", filters.search);
      if (filters?.file_type) params.append("file_type", filters.file_type);
      if (filters?.sort_by) params.append("sort_by", filters.sort_by);

      const response = await this.axiosInstance.get<DocumentListResponse>(
        `/documents/?${params.toString()}`
      );

      console.log("✓ Documents fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch documents failed:", error);
      this.handleError(error);
    }
  }

  /**
   * 🔍 Get single document
   */
  async getDocument(documentId: string): Promise<DocumentResponse> {
    try {
      console.log("📤 Fetching document:", documentId);

      const response = await this.axiosInstance.get<DocumentResponse>(
        `/documents/${documentId}`
      );

      console.log("✓ Document fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch document failed:", error);
      this.handleError(error);
    }
  }

  /**
   * ✏️ Update document (title, metadata)
   */
  async updateDocument(
    documentId: string,
    title?: string,
    metadata?: Record<string, any>
  ): Promise<DocumentResponse> {
    try {
      console.log("📤 Updating document:", { documentId, title });

      const response = await this.axiosInstance.put<DocumentResponse>(
        `/documents/${documentId}`,
        {
          title,
          metadata,
        }
      );

      console.log("✓ Document updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Update document failed:", error);
      this.handleError(error);
    }
  }

  /**
   * 🗑️ Delete document
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      console.log("📤 Deleting document:", documentId);

      await this.axiosInstance.delete(`/documents/${documentId}`);

      console.log("✓ Document deleted:", documentId);
    } catch (error) {
      console.error("❌ Delete document failed:", error);
      this.handleError(error);
    }
  }

  /**
   * 📊 Get document statistics
   */
  async getDocumentStats(): Promise<DocumentStatsResponse> {
    try {
      console.log("📤 Fetching document stats");

      const response =
        await this.axiosInstance.get<DocumentStatsResponse>("/documents/stats");

      console.log("✓ Stats fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Fetch stats failed:", error);
      this.handleError(error);
    }
  }

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Set auth token (call after login)
   */
  setAuthToken(token: string, persistent: boolean = false): void {
    if (persistent) {
      localStorage.setItem("auth_token", token);
      sessionStorage.removeItem("auth_token");
    } else {
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
    }
  }

  /**
   * Clear auth token (call on logout)
   */
  clearAuthToken(): void {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ============================================================
// SINGLETON EXPORT
// ============================================================

export const documentApiService = new DocumentApiService();

export type {
  DocumentResponse,
  DocumentListResponse,
  DocumentUploadResponse,
  DocumentStatsResponse,
  DocumentFilters,
  ApiError,
};
