// User dashboard components
// ===== RECOMMENDED DOCS =====
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
    <div className="bg-accent border border-white/5 p-6 rounded-xl shadow-xl animate-slide-in-right">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🎯</span>
        <h3 className="text-xl font-bold text-white">Gợi ý cho bạn</h3>
      </div>
      <ul className="space-y-3">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="group bg-background border border-white/5 rounded-lg p-4 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 cursor-pointer"
          >
            <p className="font-semibold text-white group-hover:text-secondary transition-colors mb-1">
              {rec.title}
            </p>
            <p className="text-sm text-text-muted mb-2">{rec.reason}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                  style={{ width: `${rec.match}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-secondary">
                {rec.match}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedDocs;
