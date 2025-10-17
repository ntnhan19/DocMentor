// src/services/auth/mockAuthService.ts

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

// Mock users database
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "123456",
    name: "John Doe",
    role: "user" as const,
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
    avatar: "https://ui-avatars.com/api/?name=Admin+User",
  },
];

class MockAuthService {
  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Mock login function
  async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<LoginResponse> {
    console.log("🔑 Login attempt:", { email, rememberMe });

    await this.delay(1500); // Simulate network delay

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      console.log("❌ Login failed: Invalid credentials");
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Create mock token
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Store in localStorage or sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };

    storage.setItem("auth_token", token);
    storage.setItem("user", JSON.stringify(userData));

    console.log("✅ Login successful:", {
      user: userData.email,
      role: userData.role,
      storage: rememberMe ? "localStorage" : "sessionStorage",
    });

    return {
      success: true,
      user: userData,
      token,
      message: "Đăng nhập thành công!",
    };
  }

  // Mock logout function
  logout(): void {
    console.log("🚪 Logging out...");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    console.log("✅ Logout complete");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    const isAuth = !!token;
    console.log("🔍 Check authenticated:", isAuth);
    return isAuth;
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!userStr) {
      console.log("👤 No user found in storage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("👤 Current user:", user.email);
      return user;
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      return null;
    }
  }

  // Get token
  getToken(): string | null {
    return (
      localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
    );
  }
}

export const mockAuthService = new MockAuthService();
export type { User, LoginResponse };
