// src/app/providers/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  realAuthService,
  User,
  RegisterData,
} from "../../services/auth/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = realAuthService.getToken();
        const currentUser = await realAuthService.getCurrentUser();

        if (token && currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Traditional email/password login
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const response = await realAuthService.login(email, password, rememberMe);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }, []);

  // ✨ NEW: Google OAuth login
  const loginWithGoogle = useCallback(async (credential: string) => {
    try {
      setIsLoading(true); // Bật loading

      // 1. Gọi API Backend để đổi credential lấy User Info
      const response = await realAuthService.loginWithGoogle(credential);

      // 2. Cập nhật State cho toàn bộ ứng dụng
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("❌ Google login error in Provider:", error);
      throw error; // Ném lỗi ra để LoginPage hiển thị thông báo
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      await realAuthService.register(data);
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await realAuthService.logout();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const authValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
  }), [user, isAuthenticated, isLoading, login, loginWithGoogle, logout, register]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
