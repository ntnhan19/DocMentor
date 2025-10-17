interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", active: true },
    {
      label: "Tài liệu của tôi",
      path: "/documents",
      active: false,
    },
    { label: "Chat AI", path: "/chat", active: false },
    { label: "Đã lưu", path: "/saved", active: false },

    { label: "Tìm kiếm nâng cao", path: "/search", active: false },
  ];

  const settingsItems = [
    { label: "Hồ sơ", path: "/profile" },
    { label: "Cài đặt", path: "/settings" },
    { label: "Trợ giúp", path: "/help" },
  ];

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
              <a
                key={index}
                href={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-primary/20 text-primary font-medium shadow-sm border border-primary/30"
                    : "text-text-muted hover:bg-accent hover:text-white"
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="my-6 border-t border-accent" />

          {/* Settings Section */}
          <h3 className="px-4 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Cài đặt
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-text-muted hover:bg-accent hover:text-white transition-all"
              >
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="border-t border-accent pt-4 mt-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 mb-3 border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">BL</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Bich Luan
                </p>
                <p className="text-xs text-text-muted truncate">
                  bichluan253@gmail.com
                </p>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
