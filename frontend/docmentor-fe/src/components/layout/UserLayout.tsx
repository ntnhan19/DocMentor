import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative gradient backgrounds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-30">
        <Header hideAuthButtons={true} />
      </div>

      {/* Main Layout */}
      <div className="flex pt-16 relative z-10">
        {/* Sidebar with animation */}
        <div className="animate-slide-in-left">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out">
          {/* Content wrapper with backdrop blur */}
          <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
            {/* Glass morphism container */}
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced overlay khi sidebar mở ở mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Decorative grid pattern overlay (subtle) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(138, 66, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 66, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

export default UserLayout;
