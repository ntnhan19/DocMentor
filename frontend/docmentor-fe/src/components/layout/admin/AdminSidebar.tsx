// ============== AdminSidebar.tsx ==============
import React from "react";

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-accent to-background fixed h-full border-r border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/10">
      <div className="p-6 border-b border-primary/20">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Admin
        </h1>
        <p className="text-text-muted text-xs mt-1">Quản lý hệ thống</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-xl text-text-muted hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 border border-transparent hover:border-primary/30 transition-all duration-300 font-medium"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-3 rounded-xl text-text-muted hover:text-white hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 border border-transparent hover:border-primary/30 transition-all duration-300 font-medium"
            >
              Quản lý Users
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
