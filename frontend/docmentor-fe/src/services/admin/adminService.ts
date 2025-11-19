import { adminApiService } from "../api/adminApiService";

// --- SWITCH: Chuyển sang FALSE để dùng dữ liệu thật ---
const USE_MOCK_DATA = false;

// ... (Giữ lại các mock data cũ để fallback nếu cần hoặc xóa đi) ...
const mockAdminStats = {
  totalUsers: 1345,
  totalDocuments: 4890,
  totalQueries: 56789,
};
// ...

export const adminService = {
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 500));
      return mockAdminStats;
    }
    try {
      return await adminApiService.getDashboardStats();
    } catch (error) {
      console.error("Error fetching stats:", error);
      return { totalUsers: 0, totalDocuments: 0, totalQueries: 0 }; // Fallback an toàn
    }
  },

  getDocTypeStats: async () => {
    if (USE_MOCK_DATA) {
      // ... return mock data
      return [];
    }
    try {
      return await adminApiService.getDocTypeStats();
    } catch (error) {
      console.error("Error fetching doc types:", error);
      return [];
    }
  },

  getUserSignupStats: async () => {
    if (USE_MOCK_DATA) {
      // ... return mock data
      return [];
    }
    try {
      return await adminApiService.getUserSignupStats();
    } catch (error) {
      console.error("Error fetching user signups:", error);
      return [];
    }
  },
};
