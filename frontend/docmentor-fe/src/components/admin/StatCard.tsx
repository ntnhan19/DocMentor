// ============== StatCard.tsx ==============
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-background border border-primary/20 p-6 backdrop-blur-sm shadow-lg shadow-primary/10 hover:border-primary/50 transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-all duration-300"></div>

      <div className="relative z-10">
        <p className="text-text-muted text-sm font-medium mb-3">{title}</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl md:text-4xl font-bold text-white">{value}</p>
          <div className="text-4xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};
