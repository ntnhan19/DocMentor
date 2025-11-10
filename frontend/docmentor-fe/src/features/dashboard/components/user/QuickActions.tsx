// User dashboard components
// ===== QUICK ACTIONS =====
const actions = [
  { label: "Tải tài liệu mới", icon: "📤", color: "primary" },
  { label: "Tạo truy vấn AI", icon: "🤖", color: "secondary" },
  { label: "Phân tích tài liệu", icon: "📊", color: "purple" },
  { label: "Xem thống kê", icon: "📈", color: "pink" },
];

const QuickActions = () => {
  return (
    <div className="bg-accent border border-white/5 p-6 rounded-xl shadow-xl animate-slide-in-right">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">⚡</span>
        <h3 className="text-xl font-bold text-white">Hành động nhanh</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="group flex items-center gap-3 p-4 bg-background border border-white/5 hover:border-primary/50 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
