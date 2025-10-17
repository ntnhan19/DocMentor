import WelcomeBanner from "../../features/dashboard/components/user/WelcomeBanner";
import QuickStats from "../../features/dashboard/components/user/QuickStats";
import RecentDocuments from "../../features/dashboard/components/user/RecentDocuments";
import RecentQueries from "../../features/dashboard/components/user/RecentQueries";
import StudyProgress from "../../features/dashboard/components/user/StudyProgress";
import RecommendedDocs from "../../features/dashboard/components/user/RecommendedDocs";
import QuickActions from "../../features/dashboard/components/user/QuickActions";

export default function UserDashboard() {
  // ==== MOCK DATA NGAY TẠI ĐÂY ====
  const mockUser = {
    name: "Bich Luan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    level: "Pro Member",
    joinDate: "2025-10-17",
  };

  const mockStats = {
    totalDocuments: 248,
    totalQueries: 1547,
    studyHours: 127,
    streak: 15,
  };

  const mockRecentDocs = [
    {
      id: 1,
      title: "Lập trình Web với React",
      type: "PDF",
      views: 23,
      lastViewed: "2 giờ trước",
      progress: 75,
      category: "Lập trình",
    },
    {
      id: 2,
      title: "Thuật toán và Cấu trúc dữ liệu",
      type: "DOCX",
      views: 15,
      lastViewed: "5 giờ trước",
      progress: 45,
      category: "Khoa học máy tính",
    },
    {
      id: 3,
      title: "Machine Learning cơ bản",
      type: "PDF",
      views: 31,
      lastViewed: "1 ngày trước",
      progress: 90,
      category: "AI",
    },
    {
      id: 4,
      title: "Thiết kế Database",
      type: "PDF",
      views: 18,
      lastViewed: "2 ngày trước",
      progress: 60,
      category: "Database",
    },
  ];

  const mockRecentQueries = [
    {
      id: 1,
      query: "React hooks hoạt động như thế nào?",
      answer:
        "React Hooks là các hàm đặc biệt cho phép bạn sử dụng state và lifecycle trong functional components.",
      time: "1 giờ trước",
      sources: 3,
    },
    {
      id: 2,
      query: "So sánh quicksort và mergesort",
      answer:
        "Quicksort có độ phức tạp trung bình O(n log n) và thường nhanh hơn Mergesort trong thực tế.",
      time: "3 giờ trước",
      sources: 2,
    },
    {
      id: 3,
      query: "REST API là gì?",
      answer:
        "REST là kiến trúc cho phép giao tiếp giữa client và server thông qua HTTP với các phương thức GET, POST, PUT, DELETE.",
      time: "5 giờ trước",
      sources: 4,
    },
  ];

  const mockRecommendations = [
    {
      id: 1,
      title: "Advanced React Patterns",
      reason: "Dựa trên tài liệu React bạn đã học",
      match: 95,
    },
    {
      id: 2,
      title: "System Design Interview",
      reason: "Phù hợp với mục tiêu học tập của bạn",
      match: 88,
    },
    {
      id: 3,
      title: "TypeScript Deep Dive",
      reason: "Bổ sung kiến thức JavaScript",
      match: 82,
    },
  ];

  // ==== JSX TRẢ VỀ ====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <WelcomeBanner user={mockUser} streak={mockStats.streak} />
        <QuickStats stats={mockStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentDocuments documents={mockRecentDocs} />
            <RecentQueries queries={mockRecentQueries} />
          </div>

          <div className="space-y-6">
            <QuickActions />
            <StudyProgress />
            <RecommendedDocs recommendations={mockRecommendations} />
          </div>
        </div>
      </div>
    </div>
  );
}
