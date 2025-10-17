// User dashboard components
const actions = [
  { label: "Tải tài liệu mới", icon: "📤" },
  { label: "Tạo truy vấn AI", icon: "🤖" },
  { label: "Phân tích tài liệu", icon: "📊" },
  { label: "Xem thống kê", icon: "📈" },
];

const QuickActions = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        ⚡ Hành động nhanh
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-100 transition"
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
