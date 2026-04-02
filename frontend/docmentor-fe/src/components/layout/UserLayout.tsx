import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import AppSidebar from "./AppSidebar";

const UserLayout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes("/user/chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Decorative subtle highlights (Low opacity white/gray instead of purple) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px]"></div>
      </div>

      {/* Header cố định */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header hideAuthButtons={true} />
      </div>

      {/* Layout chính */}
      <div
        className={`relative z-10 pt-16 ${isChatPage ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        {isChatPage ? (
          // ChatPage sẽ tự lo layout sidebar của nó
          <main className="flex flex-col w-full h-full">
            <Outlet />
          </main>
        ) : (
          // Các trang Dashboard/Docs dùng Sidebar mặc định
          <div className="w-full min-h-[calc(100vh-4rem)]">
            <AppSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <main
              className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : ""}`}
            >
              <div className="h-full animate-fade-in">
                <Outlet />
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Decorative grid pattern overlay (Subtle Monochrome) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default UserLayout;
