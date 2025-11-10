import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  hideAuthButtons?: boolean;
  user?: {
    name: string;
    avatar?: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ hideAuthButtons, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll for header style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  //const navItems = [{ label: "Trang chủ", path: "/" }];

  const handleNavClick = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(path);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-sm shadow-lg py-3 border-b border-accent"
          : "bg-background py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white">DocMentor</span>
          </div>

          {/* Desktop Navigation */}
          {/*<nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="font-medium text-text-muted transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // ✅ Nếu đã đăng nhập, hiển thị user info
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <span className="text-white text-sm">{user.name}</span>
              </div>
            ) : !hideAuthButtons ? (
              // ✅ Nếu chưa login và không ẩn nút
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 font-semibold rounded-lg text-text-muted hover:text-white transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(138,66,255,0.5)] hover:shadow-[0_0_25px_rgba(138,66,255,0.7)]"
                >
                  Đăng ký
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-accent rounded-lg shadow-lg">
            <nav className="flex flex-col">
              {/*navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="px-4 py-3 text-left text-text-muted hover:bg-background/50 hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))*/}
              {!hideAuthButtons && !user && (
                <div className="border-t border-background mt-2 pt-2 px-4 space-y-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full text-center px-4 py-2 text-text-muted font-semibold rounded-lg hover:bg-background/50 transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
