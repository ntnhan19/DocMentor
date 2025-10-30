import { UserProfile } from "@/types/user.types";

// Dữ liệu người dùng giả
let mockUser: UserProfile = {
  id: "user-01",
  fullName: "John Doe",
  email: "user@example.com",
  avatarUrl: "https://i.pravatar.cc/150?u=user@example.com",
  createdAt: "2025-10-01T10:00:00.000Z",
};

export const userService = {
  // Lấy thông tin hồ sơ
  getProfile: async (): Promise<UserProfile> => {
    console.log("(MOCK) Fetching user profile...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUser;
  },

  // Cập nhật thông tin hồ sơ
  updateProfile: async (updates: {
    fullName?: string;
  }): Promise<UserProfile> => {
    console.log("(MOCK) Updating user profile with:", updates);
    await new Promise((resolve) => setTimeout(resolve, 800));
    mockUser = { ...mockUser, ...updates };
    return mockUser;
  },

  // Giả lập đổi mật khẩu
  changePassword: async (
    oldPass: string,
    newPass: string
  ): Promise<{ message: string }> => {
    console.log("(MOCK) Changing password...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Trong mock, chúng ta luôn cho là thành công
    return { message: "Password changed successfully" };
  },
};
