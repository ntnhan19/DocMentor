import React, { ReactNode, useState } from "react";
import Button from "@/components/common/Button";
import {
  Palette,
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
    <section className="p-8 mb-8 apple-glass border-white/5 rounded-[32px] hover:border-white/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-8 text-white">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          {icon}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
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
    <div className="flex items-center justify-between min-h-[72px] p-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 group border border-transparent hover:border-white/5">
      <div className="flex-1 pr-4">
        <p className="mb-1 font-semibold transition-colors text-white/90 group-hover:text-white">
          {title}
        </p>
        <p className="text-sm transition-colors text-text-muted group-hover:text-white/70">
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
    <div className="flex items-center space-x-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300
            ${
              theme === value
                ? "bg-white text-black font-bold shadow-2xl shadow-white/10"
                : "text-white/30 hover:text-white hover:bg-white/5"
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
    <div className="max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      {/* Header với gradient */}
      <div className="mb-12 animate-in slide-in-from-right-4 duration-700">
        <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl tracking-tight">
          Cài đặt
        </h1>
        <p className="text-[17px] font-medium text-apple-primary-muted">Tùy chỉnh không gian làm việc DocMentor của bạn</p>
      </div>

      {/* === PHẦN GIAO DIỆN === */}
      <SettingsSection
        title="Giao diện"
        icon={<Palette className="w-6 h-6 text-white/50" />}
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
              className="bg-white/[0.03] px-5 py-2.5 rounded-xl text-[14px] border border-white/5 
                             text-white focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-white/10 
                             hover:bg-white/[0.05] transition-all duration-300 cursor-pointer font-medium"
            >
              <option className="bg-black">Tiếng Việt</option>
              <option className="bg-black">English</option>
            </select>
          }
        />
      </SettingsSection>

      {/* === PHẦN TÀI KHOẢN === */}
      <SettingsSection
        title="Tài khoản"
        icon={<Shield className="w-6 h-6 text-white/50" />}
      >
        <SettingsRow
          title="Đổi mật khẩu"
          description="Thay đổi mật khẩu đăng nhập để tăng cường bảo mật."
          action={
            <Button
              onClick={handleChangePassword}
              className="bg-white text-black hover:bg-white/90 font-bold px-6 h-11 rounded-full shadow-xl shadow-white/5 active:scale-95 transition-all"
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
              variant="danger"
              onClick={handleDeleteAccount}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-6 h-11 rounded-full font-bold active:scale-95 transition-all outline-none"
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
        icon={<Database className="w-6 h-6 text-white/50" />}
      >
        <SettingsRow
          title="Xóa toàn bộ lịch sử chat"
          description="Xóa tất cả các cuộc hội thoại. Tài liệu đã tải lên không bị ảnh hưởng."
          action={
            <Button
              variant="secondary"
              onClick={handleClearHistory}
              className="bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5 px-6 h-11 rounded-full font-bold active:scale-95 transition-all uppercase text-[12px] tracking-widest"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa lịch sử
            </Button>
          }
        />
      </SettingsSection>

      {/* Footer Info */}
      <div className="p-8 mt-12 apple-glass border-white/5 rounded-[32px] animate-in fade-in duration-1000">
        <div className="flex items-start gap-5">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
            <Shield className="w-6 h-6 text-white/30" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-white/90">
              Bảo mật & Quyền riêng tư
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">
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
