import React, { ReactNode, useState } from "react";
import Button from "@/components/common/Button";
import {
  Palette,
  Globe,
  Lock,
  Trash2,
  Database,
  Shield,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

// ===================================================================
// Các component con được định nghĩa ngay trong file để dễ quản lý
// ===================================================================

// Component 1: Hộp chứa cho mỗi nhóm cài đặt
const SettingsSection: React.FC<{
  title: string;
  children: ReactNode;
  icon: ReactNode;
}> = ({ title, children, icon }) => {
  return (
    <section className="mb-6 bg-accent/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 animate-fade-in hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

// Component 2: Một hàng cài đặt
const SettingsRow: React.FC<{
  title: string;
  description: string;
  action: ReactNode;
}> = ({ title, description, action }) => {
  return (
    <div className="flex items-center justify-between min-h-[64px] p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 group">
      <div className="flex-1 pr-4">
        <p className="font-semibold text-white/90 group-hover:text-white transition-colors mb-1">
          {title}
        </p>
        <p className="text-sm text-text-muted group-hover:text-white/70 transition-colors">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0">{action}</div>
    </div>
  );
};

// Component 3: Nút chọn Theme Sáng/Tối
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState("system"); // Giá trị có thể là 'light', 'dark', 'system'

  const themes = [
    { value: "light", label: "Sáng", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Tối", icon: <Moon className="w-4 h-4" /> },
    {
      value: "system",
      label: "Hệ thống",
      icon: <Monitor className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center space-x-1 bg-accent/80 p-1.5 rounded-xl border border-primary/20">
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300
            ${
              theme === value
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105"
                : "text-text-muted hover:text-white hover:bg-primary/10"
            }
          `}
        >
          {icon}
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};

// ===================================================================
// Component chính của Trang Cài đặt
// ===================================================================
const SettingsPage: React.FC = () => {
  // Logic xử lý các hành động (tạm thời dùng alert)
  const handleChangePassword = () => {
    alert("Chuyển đến trang hoặc modal đổi mật khẩu...");
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat không? Hành động này không thể hoàn tác."
      )
    ) {
      alert("Đang xóa lịch sử...");
      // Gọi service để xóa ở đây
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt(
      'Để xác nhận, vui lòng gõ "DELETE" vào ô bên dưới:'
    );
    if (confirmation === "DELETE") {
      alert("Tài khoản của bạn sẽ bị xóa vĩnh viễn.");
      // Gọi service để xóa tài khoản ở đây
    } else {
      alert("Hành động đã được hủy.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header với gradient */}
      <div className="mb-10 animate-slide-in-right">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Cài đặt
        </h1>
        <p className="text-text-muted text-lg">Tùy chỉnh trải nghiệm của bạn</p>
      </div>

      {/* === PHẦN GIAO DIỆN === */}
      <SettingsSection
        title="Giao diện"
        icon={<Palette className="w-6 h-6 text-primary" />}
      >
        <SettingsRow
          title="Chủ đề"
          description="Tùy chỉnh giao diện sáng, tối hoặc theo hệ thống của bạn."
          action={<ThemeToggle />}
        />
        <SettingsRow
          title="Ngôn ngữ"
          description="Chọn ngôn ngữ hiển thị cho ứng dụng."
          action={
            <select
              className="bg-accent/80 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm border border-primary/20 
                             text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 
                             hover:border-primary/40 transition-all duration-300 cursor-pointer"
            >
              <option className="bg-accent">Tiếng Việt</option>
              <option className="bg-accent">English</option>
            </select>
          }
        />
      </SettingsSection>

      {/* === PHẦN TÀI KHOẢN === */}
      <SettingsSection
        title="Tài khoản"
        icon={<Shield className="w-6 h-6 text-primary" />}
      >
        <SettingsRow
          title="Đổi mật khẩu"
          description="Thay đổi mật khẩu đăng nhập để tăng cường bảo mật."
          action={
            <Button
              onClick={handleChangePassword}
              className="bg-primary/20 hover:bg-primary/30 text-primary hover:text-white border border-primary/30 hover:border-primary/50 transition-all duration-300"
            >
              <Lock className="w-4 h-4 mr-2" />
              Thay đổi
            </Button>
          }
        />
        <SettingsRow
          title="Xóa tài khoản"
          description="Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu. Không thể hoàn tác."
          action={
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tài khoản
            </Button>
          }
        />
      </SettingsSection>

      {/* === PHẦN DỮ LIỆU & AI === */}
      <SettingsSection
        title="Dữ liệu & AI"
        icon={<Database className="w-6 h-6 text-primary" />}
      >
        <SettingsRow
          title="Xóa toàn bộ lịch sử chat"
          description="Xóa tất cả các cuộc hội thoại. Tài liệu đã tải lên không bị ảnh hưởng."
          action={
            <Button
              variant="secondary"
              onClick={handleClearHistory}
              className="bg-secondary/20 hover:bg-secondary/30 text-secondary hover:text-white border border-secondary/30 hover:border-secondary/50 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa lịch sử
            </Button>
          }
        />
      </SettingsSection>

      {/* Footer Info */}
      <div className="mt-10 p-6 bg-accent/30 backdrop-blur-sm border border-primary/10 rounded-2xl animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Shield className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-white/90 mb-1">
              Bảo mật & Quyền riêng tư
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Dữ liệu của bạn được mã hóa và bảo mật. Chúng tôi không bao giờ
              chia sẻ thông tin cá nhân của bạn với bên thứ ba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
