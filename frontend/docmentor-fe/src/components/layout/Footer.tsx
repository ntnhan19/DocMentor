import React from "react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Tính năng", path: "#features" },
      { label: "Cách sử dụng", path: "#how-it-works" },
      { label: "Bảng giá", path: "/pricing" },
      { label: "FAQ", path: "#faq" },
    ],
    company: [
      { label: "Về chúng tôi", path: "/about" },
      { label: "Blog", path: "/blog" },
      { label: "Tuyển dụng", path: "/careers" },
      { label: "Liên hệ", path: "/contact" },
    ],
    support: [
      { label: "Trung tâm trợ giúp", path: "/help" },
      { label: "Hướng dẫn", path: "/docs" },
      { label: "API", path: "/api" },
      { label: "Báo cáo lỗi", path: "/report" },
    ],
    legal: [
      { label: "Điều khoản dịch vụ", path: "/terms" },
      { label: "Chính sách bảo mật", path: "/privacy" },
      { label: "Chính sách Cookie", path: "/cookies" },
      { label: "Giấy phép", path: "/license" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: "https://facebook.com",
    },
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      url: "https://twitter.com",
    },
    {
      name: "GitHub",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
      url: "https://github.com",
    },
  ];

  const handleLinkClick = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 w-full">
      {/* Main Footer Content */}
      <div className="w-full px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">DocMentor</span>
            </div>
            <p className="mb-6 leading-relaxed">
              Trợ lý AI thông minh giúp bạn làm việc hiệu quả hơn với tài liệu.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {(Object.keys(footerLinks) as Array<keyof typeof footerLinks>).map(
            (key) => (
              <div key={key}>
                <h3 className="text-white font-semibold mb-4 capitalize">
                  {key === "product"
                    ? "Sản phẩm"
                    : key === "company"
                      ? "Công ty"
                      : key === "support"
                        ? "Hỗ trợ"
                        : "Pháp lý"}
                </h3>
                <ul className="space-y-3">
                  {footerLinks[key].map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className="hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {currentYear} DocMentor. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/terms")}
              className="hover:text-white transition-colors"
            >
              Điều khoản
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className="hover:text-white transition-colors"
            >
              Bảo mật
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
