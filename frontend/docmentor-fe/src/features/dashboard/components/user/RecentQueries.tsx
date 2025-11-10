// ===== RECENT QUERIES =====
interface Query {
  id: number;
  query: string;
  answer: string;
  time: string;
  sources: number;
}

interface RecentQueriesProps {
  queries: Query[];
}

const RecentQueries: React.FC<RecentQueriesProps> = ({ queries }) => {
  return (
    <div className="bg-accent border border-white/5 p-6 rounded-xl shadow-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">🤖</span>
        <h3 className="text-xl font-bold text-white">Truy vấn AI gần đây</h3>
      </div>
      <div className="space-y-4">
        {queries.map((q) => (
          <div
            key={q.id}
            className="bg-background border border-white/5 rounded-lg p-4 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-lg flex-shrink-0">💬</span>
              <p className="font-semibold text-white">"{q.query}"</p>
            </div>
            <p className="text-sm text-text-muted leading-relaxed ml-8">
              {q.answer}
            </p>
            <div className="flex items-center gap-3 mt-3 ml-8">
              <span className="text-xs text-text-muted">{q.time}</span>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full font-medium">
                {q.sources} nguồn
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQueries;
