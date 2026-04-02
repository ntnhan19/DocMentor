import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatBoxProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
}) => {
  return (
    <div
      className="p-6 transition-all duration-500 apple-glass rounded-2xl hover:bg-white/[0.05] group border border-white/5 hover:border-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-widest text-white/30 uppercase">{title}</p>
          <div className="flex items-baseline gap-2 mt-3">
            <h3 className="text-3xl font-semibold tracking-tight text-white">{value}</h3>
            {unit && <span className="text-xs font-medium text-white/20">{unit}</span>}
          </div>

          {/* Trend Section (Optional) */}
          {trend && (
            <div
              className={`mt-3 flex items-center gap-1 text-[11px] font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}
            >
              {trend.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>
                {trend.value}% {trend.isPositive ? "tăng" : "giảm"}
              </span>
            </div>
          )}
        </div>

        {/* Icon Section */}
        {icon && (
          <div className="rounded-xl p-3 bg-white/5 text-white/40 group-hover:bg-white group-hover:text-black transition-all duration-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
