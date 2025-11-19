// Admin management service
// Dữ liệu giả cho Thống kê tổng quan
const mockAdminStats = {
  totalUsers: 1345,
  totalDocuments: 4890,
  totalQueries: 56789,
};

// Dữ liệu giả cho Phân loại tài liệu
const mockDocTypeStats = [
  { name: "PDF", value: 3200 },
  { name: "DOCX", value: 950 },
  { name: "PPTX", value: 430 },
  { name: "TXT", value: 310 },
];

// Dữ liệu giả cho Thống kê người dùng đăng ký (7 ngày qua)
const mockUserSignupStats = [
  { date: "Ngày 1", users: 15 },
  { date: "Ngày 2", users: 22 },
  { date: "Ngày 3", users: 18 },
  { date: "Ngày 4", users: 30 },
  { date: "Ngày 5", users: 25 },
  { date: "Ngày 6", users: 40 },
  { date: "Ngày 7", users: 55 },
];

export const adminService = {
  // Lấy các chỉ số tổng quan
  getDashboardStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAdminStats;
  },

  // Lấy dữ liệu phân loại tài liệu
  getDocTypeStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDocTypeStats;
  },

  // Lấy dữ liệu đăng ký người dùng
  getUserSignupStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUserSignupStats;
  },
};
