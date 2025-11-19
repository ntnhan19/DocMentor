import axios, { AxiosInstance } from "axios";

// Types khớp với Backend Response
export interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  totalQueries: number;
}

export interface DocTypeStat {
  name: string;
  value: number;
}

export interface UserSignupStat {
  date: string;
  users: number;
}

class AdminApiService {
  private axiosInstance: AxiosInstance;
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl =
      (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
    this.axiosInstance = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    // Add Auth Token (Admin cần token)
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response =
      await this.axiosInstance.get<DashboardStats>("/analytics/stats");
    return response.data;
  }

  async getDocTypeStats(): Promise<DocTypeStat[]> {
    const response = await this.axiosInstance.get<DocTypeStat[]>(
      "/analytics/doc-types"
    );
    return response.data;
  }

  async getUserSignupStats(): Promise<UserSignupStat[]> {
    const response = await this.axiosInstance.get<UserSignupStat[]>(
      "/analytics/user-signups"
    );
    return response.data;
  }
}

export const adminApiService = new AdminApiService();
