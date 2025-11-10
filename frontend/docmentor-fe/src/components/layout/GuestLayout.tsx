// src/layouts/GuestLayout.tsx

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";

const GuestLayout: React.FC = () => {
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

      {/* Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-primary/10">
        <Header hideAuthButtons={false} />
      </div>

      {/* Main Layout Container */}
      <div className="flex h-screen pt-16 relative z-10">
        {/* Main Content Area - Full width */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Content wrapper */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

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

export default GuestLayout;
