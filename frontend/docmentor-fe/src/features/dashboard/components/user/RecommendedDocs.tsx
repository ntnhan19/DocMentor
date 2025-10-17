// User dashboard components
interface Recommendation {
  id: number;
  title: string;
  reason: string;
  match: number;
}

interface RecommendedDocsProps {
  recommendations: Recommendation[];
}

const RecommendedDocs: React.FC<RecommendedDocsProps> = ({
  recommendations,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🎯 Gợi ý cho bạn
      </h3>
      <ul className="space-y-3">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
          >
            <p className="font-medium text-gray-800">{rec.title}</p>
            <p className="text-sm text-gray-500">{rec.reason}</p>
            <p className="text-xs text-indigo-600 mt-1 font-semibold">
              Độ phù hợp: {rec.match}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedDocs;
