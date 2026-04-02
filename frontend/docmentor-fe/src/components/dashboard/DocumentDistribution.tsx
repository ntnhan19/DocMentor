import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "@/services/dashboard/dashboardService";
import { FiPieChart } from "react-icons/fi";

const COLORS = ["#FFFFFF", "#86868B", "#424245", "#F5F5F7", "#1D1D1F"];

export const DocumentDistribution: React.FC = () => {
  // ✅ Thay useQuery bằng state + useEffect
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDocumentDistribution();
        setData(res);
      } catch (err) {
        console.error("Distribution Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = Array.isArray(data)
    ? data.map((item: any) => ({
        name: item.file_type?.toUpperCase() || "KHÁC",
        value: item.count || 0,
      }))
    : [];

  if (loading)
    return <div className="h-80 bg-white/5 rounded-3xl animate-pulse"></div>;

  if (error || chartData.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-80 apple-glass rounded-[32px] border border-white/5 shadow-2xl">
        <FiPieChart className="w-12 h-12 mb-4 text-white/10" />
        <p className="text-sm font-medium text-white/30 tracking-wide">Chưa có dữ liệu phân bố</p>
      </div>
    );

  return (
    <div className="p-8 apple-glass border border-white/5 rounded-[32px] shadow-2xl h-full relative overflow-hidden group">
      <h3 className="flex items-center gap-3 mb-8 text-[11px] font-bold text-white/30 uppercase tracking-widest">
        <FiPieChart size={14} /> Phân bố tài liệu
      </h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
              }}
              itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "600" }}
              labelStyle={{ display: "none" }}
              cursor={{ fill: "transparent" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              formatter={(value) => <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
