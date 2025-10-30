import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mockAuthService, User } from "@/services/auth/mockAuthService";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Dùng để xác định menu nào đang active

  // Lấy user khi component mount
  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    mockAuthService.logout();
    setUser(null);
    navigate("/login"); // ✅ Điều hướng sang trang login sau khi logout
  };

  // ✅ Cập nhật đúng đường dẫn (nằm trong /user)
  const menuItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Tài liệu của tôi", path: "/user/documents" },
    { label: "Chat AI", path: "/user/chat" },
  ];

  const settingsItems = [{ label: "Cài đặt", path: "/user/settings" }];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background border-r border-accent z-30 transition-transform duration-300 w-64 overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-4">
        {/* Main Navigation */}
        <div className="flex-1">
          <h3 className="px-4 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Menu chính
          </h3>
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname.startsWith(item.path)
                    ? "bg-primary/20 text-primary font-medium shadow-sm border border-primary/30"
                    : "text-text-muted hover:bg-accent hover:text-white"
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="my-6 border-t border-accent" />

          {/* Settings Section */}

          <div className="space-y-1">
            {settingsItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-text-muted hover:bg-accent hover:text-white transition-all"
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="border-t border-accent pt-4 mt-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 mb-3 border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Khách"}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email || "Chưa đăng nhập"}
                </p>
              </div>
            </div>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-primary hover:bg-primary/10 transition-all"
            >
              <span className="text-sm font-medium">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
