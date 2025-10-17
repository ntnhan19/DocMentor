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
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🤖 Truy vấn AI gần đây
      </h3>
      <div className="space-y-4">
        {queries.map((q) => (
          <div key={q.id} className="border border-gray-100 rounded-lg p-3">
            <p className="font-medium text-gray-800 mb-1">“{q.query}”</p>
            <p className="text-sm text-gray-600">{q.answer}</p>
            <p className="text-xs text-gray-400 mt-2">
              {q.time} • {q.sources} nguồn
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQueries;
