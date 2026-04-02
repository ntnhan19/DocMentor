import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiMessageSquare,
  FiMessageCircle,
  FiStar,
  FiRefreshCw,
} from "react-icons/fi";
import { StatBox } from "@/components/dashboard/StatBox";
import { DocumentDistribution } from "@/components/dashboard/DocumentDistribution";
import { ProcessingStatus } from "@/components/dashboard/ProcessingStatus";
// Import service mới tạo
import {
  dashboardService,
  DashboardStats,
} from "@/services/dashboard/dashboardService";

const UserDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm tải dữ liệu dùng service chuẩn
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Gọi qua apiClient (có token) nên sẽ không bị lỗi CORS/500 nữa
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Dashboard Error:", err);
      // Nếu apiClient đã bắt lỗi 401 thì nó tự redirect, ở đây chỉ catch lỗi mạng khác
      setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefetch = () => {
    fetchData();
    // Trick nhỏ để refresh các component con (vì chúng tự gọi API riêng)
    // Cách tốt nhất là dùng React Context hoặc Redux, nhưng reload nhanh gọn cho project này:
    window.location.reload();
  };

  if (error) {
    return (
      <div className="p-8 text-center min-h-screen bg-black pt-24">
        <p className="mb-4 text-red-400/80 text-sm font-medium">{error}</p>
        <button
          onClick={handleRefetch}
          className="px-6 py-2 text-black bg-white rounded-full font-bold text-xs hover:bg-white/90 transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 lg:p-12 pt-28 text-white">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-semibold tracking-tight text-white">
            Xin chào 👋
          </h1>
          <p className="text-[15px] text-white/40 font-medium">
            Đây là tổng quan hoạt động học tập của bạn hôm nay.
          </p>
        </div>
        <button
          onClick={handleRefetch}
          className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white/60 transition-all border apple-glass border-white/5 rounded-xl hover:text-white hover:bg-white/5"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Làm mới dữ liệu
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          title="Tài liệu"
          value={stats?.documents.total || 0}
          icon={<FiFileText size={20} />}
        />
        <StatBox
          title="Câu hỏi"
          value={stats?.queries.total || 0}
          icon={<FiMessageSquare size={20} />}
        />
        <StatBox
          title="Hội thoại"
          value={stats?.conversations.total || 0}
          icon={<FiMessageCircle size={20} />}
        />
        <StatBox
          title="Đánh giá"
          value={
            stats?.feedback.average_rating
              ? stats.feedback.average_rating.toFixed(1)
              : "N/A"
          }
          unit="/ 5.0"
          icon={<FiStar size={20} />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Status */}
        <div className="space-y-10 lg:col-span-2">
          <ProcessingStatus />
        </div>

        {/* Right: Charts & Info */}
        <div className="space-y-10">
          <DocumentDistribution />

          {/* Storage Box - Apple Style */}
          <div className="p-8 apple-glass border border-white/5 rounded-[24px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <FiFileText size={80} />
            </div>
            <h3 className="mb-1 text-[11px] font-bold text-white/30 uppercase tracking-widest">Dung lượng sử dụng</h3>
            <div className="mb-6 text-3xl font-semibold tracking-tight text-white">
              {stats
                ? (stats.documents.total_size_bytes / 1024 / 1024).toFixed(2)
                : 0}{" "}
              <span className="text-sm font-medium text-white/40">MB</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000"
                style={{ width: "12%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-3">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Hạn mức: 100MB</p>
               <p className="text-[10px] font-bold text-white/60">12%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
