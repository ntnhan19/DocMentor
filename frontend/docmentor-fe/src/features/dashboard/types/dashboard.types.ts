// src/features/dashboard/types/dashboard.types.ts

export interface UserStats {
  totalDocuments: number;
  totalQueries: number;
  totalChatSessions: number;
  studyTimeMinutes: number;
}

export interface RecentDocument {
  id: string;
  title: string;
  type: "pdf" | "docx" | "txt";
  category: string;
  lastViewed: string;
  thumbnail?: string;
  pageCount?: number;
}

export interface RecentQuery {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  documentTitle?: string;
  status: "answered" | "pending" | "failed";
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: "blue" | "green" | "purple" | "orange";
}

export interface DashboardData {
  user: {
    name: string;
    email: string;
    avatar?: string;
    joinedDate: string;
  };
  stats: UserStats;
  recentDocuments: RecentDocument[];
  recentQueries: RecentQuery[];
  quickActions: QuickAction[];
}

// API Response types
export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}

export interface StatsResponse {
  success: boolean;
  data: UserStats;
}
