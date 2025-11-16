// ============== UserSignupChart.tsx ==============
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  date: string;
  users: number;
}

interface UserSignupChartProps {
  data: ChartData[];
}

export const UserSignupChart: React.FC<UserSignupChartProps> = ({
  data: providedData,
}) => {
  // Mock data nếu không nhận dữ liệu từ props
  const data =
    providedData && providedData.length > 0
      ? providedData
      : [
          { date: "T2", users: 120 },
          { date: "T3", users: 290 },
          { date: "T4", users: 200 },
          { date: "T5", users: 450 },
          { date: "T6", users: 380 },
          { date: "T7", users: 520 },
          { date: "CN", users: 610 },
        ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent to-background border border-primary/20 p-6 backdrop-blur-sm shadow-lg shadow-primary/10">
      <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6 relative z-10">
        Người dùng đăng ký (7 ngày qua)
      </h3>

      <div className="relative z-10 w-full" style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8A42FF20" />
            <XAxis
              dataKey="date"
              stroke="#A9A5B8"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#A9A5B8" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A162D",
                border: "1px solid #8A42FF",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8A42FF"
              strokeWidth={3}
              dot={{ fill: "#00D4FF", r: 5 }}
              activeDot={{ r: 7 }}
              name="Số người dùng mới"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
