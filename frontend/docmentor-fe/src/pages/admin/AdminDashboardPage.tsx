// Admin Dashboard
import React, { useEffect, useState } from "react";
import { adminService } from "@/services/admin/adminService";
import { StatCard } from "@/components/admin/StatCard"; // <-- Đã đổi đường dẫn
import { DocTypePieChart } from "@/components/admin/DocTypePieChart"; // <-- Đã đổi đường dẫn
import { UserSignupChart } from "@/components/admin/UserSignupChart"; // <-- Đã đổi đường dẫn
import { Users, FileText, MessageSquare } from "lucide-react";

// ... (Interface và code logic của component giữ nguyên như câu trả lời trước) ...

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [docStats, setDocStats] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, docStatsData, userStatsData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getDocTypeStats(),
          adminService.getUserSignupStats(),
        ]);
        setStats(statsData);
        setDocStats(docStatsData);
        setUserStats(userStatsData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center">Đang tải dữ liệu thống kê...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* 1. Các thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số người dùng"
          value={stats?.totalUsers || 0}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Tổng số tài liệu"
          value={stats?.totalDocuments || 0}
          icon={<FileText size={24} />}
        />
        <StatCard
          title="Tổng số truy vấn"
          value={stats?.totalQueries || 0}
          icon={<MessageSquare size={24} />}
        />
      </div>

      {/* 2. Các biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocTypePieChart data={docStats} />
        <UserSignupChart data={userStats} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
