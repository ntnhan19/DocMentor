// src/components/layout/Header.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { realAuthService, User } from "@/services/auth/authService";
import { FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";

interface HeaderProps {
  hideAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideAuthButtons }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await realAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    realAuthService.logout();
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "Chat AI", path: "/user/chat" },
    { label: "Tài liệu của tôi", path: "/user/documents" },
  ];

  return (
    // ✅ FIX 1: h-16 cố định chiều cao
    // ✅ FIX 2: bg-[#100D20] đặc (không trong suốt) để che nội dung khi scroll
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b border-white/5 apple-glass ${
        isScrolled ? "shadow-2xl shadow-black/40" : ""
      }`}
    >
      <div className="w-full h-full px-4 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* LEFT: Logo & Brand */}
          <div
            className="flex items-center w-64 gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="object-contain w-8 h-8 invert transition-transform group-hover:scale-105"
            />
            <span className="text-[17px] font-bold tracking-tight text-white/90">
              DocMentor
            </span>
          </div>

          {/* CENTER: Navigation */}
          <div className="items-center justify-center flex-1 hidden md:flex">
            {user && (
              <nav className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                {menuItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`px-5 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
                        isActive
                          ? "bg-white text-black shadow-md"
                          : "text-white/40 hover:text-white/90 hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* RIGHT: User Profile */}
          <div className="flex items-center justify-end w-auto gap-4 lg:w-80">
            {user ? (
              <div className="relative flex items-center gap-3 pl-6 group">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-semibold leading-none text-white/90">
                    {user.full_name}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1 font-medium">{user.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full p-[1px] bg-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/5">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="User"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {(user.full_name || "U").charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-52 apple-glass-heavy border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all scale-95 group-hover:scale-100 origin-top-right p-1.5">
                  <button
                    onClick={() => navigate("/user/settings")}
                    className="w-full px-4 py-2.5 text-[13px] text-left text-white/60 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <FiSettings size={14} /> Cài đặt
                  </button>
                  <div className="h-px my-1 bg-white/5 mx-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-[13px] text-left text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <FiLogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : !hideAuthButtons ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-white/90 transition-all shadow-xl shadow-white/5"
                >
                  Đăng ký
                </button>
              </div>
            ) : null}
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/70 hover:text-white md:hidden"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
