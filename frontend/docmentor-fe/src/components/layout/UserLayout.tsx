import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header"; // dùng path rút gọn hơn
import Sidebar from "../../components/layout/Sidebar";
import Breadcrumb from "../../components/layout/Breadcrumb";

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Breadcrumb có thể linh hoạt (sau này có thể lấy từ router)
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/user" },
    { label: "Dashboard", path: "/user" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (ẩn nút auth nếu đã đăng nhập) */}
      <Header hideAuthButtons={true} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <div className="p-4 md:p-6 lg:p-8">
            <Breadcrumb items={breadcrumbItems} />
            {/* ✅ Render các trang con như Dashboard, Profile, ... */}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay khi sidebar mở ở mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UserLayout;
