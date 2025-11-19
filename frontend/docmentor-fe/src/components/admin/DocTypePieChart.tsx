// ============== DocTypePieChart.tsx ==============
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface DocTypePieChartProps {
  data: ChartData[];
}

const COLORS = ["#8A42FF", "#00D4FF", "#FF6B6B", "#4ECDC4"];

export const DocTypePieChart: React.FC<DocTypePieChartProps> = ({ data }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent to-background border border-primary/20 p-6 backdrop-blur-sm shadow-lg shadow-primary/10">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 relative z-10">
        Phân loại tài liệu
      </h3>

      <div className="relative z-10" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A162D",
                border: "1px solid #8A42FF",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
