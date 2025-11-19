// ============== AdminLayout.tsx ==============
import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="sticky top-0 z-30 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Dashboard Admin
          </h2>
          <p className="text-text-muted text-sm mt-2">
            Quản lý hệ thống và dữ liệu tài liệu
          </p>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
