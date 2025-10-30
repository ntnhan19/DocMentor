// src/app/providers/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { realAuthService, User } from "../../services/auth/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;  // Làm logout async để phù hợp với real service
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Thêm state riêng để track auth status

  useEffect(() => {
    // Check if user is already logged in (async vì real service dùng API verify)
    const initAuth = async () => {
      try {
        const currentUser = await realAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const authStatus = await realAuthService.isAuthenticated();  // Verify token với backend
          setIsAuthenticated(authStatus);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const response = await realAuthService.login(email, password, rememberMe);
      setUser(response.user);
      setIsAuthenticated(true);  // Set auth status sau login thành công
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;  // Re-throw để component gọi login handle error
    }
  };

  const logout = async () => {
    try {
      await realAuthService.logout();  // Gọi API logout nếu có
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};