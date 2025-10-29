// User dashboard components
interface QuickStatsProps {
  stats: {
    totalDocuments: number;
    totalQueries: number;

    streak: number;
  };
}

const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  const items = [
    { label: "Tài liệu", value: stats.totalDocuments },
    { label: "Truy vấn AI", value: stats.totalQueries },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition"
        >
          <p className="text-2xl font-bold text-indigo-600">{item.value}</p>
          <p className="text-sm text-gray-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
