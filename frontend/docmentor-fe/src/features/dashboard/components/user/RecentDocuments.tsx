// User dashboard components
// ===== RECENT DOCUMENTS =====
interface Document {
  id: number;
  title: string;
  type: string;
  views: number;
  lastViewed: string;
  progress: number;
  category: string;
}

interface RecentDocumentsProps {
  documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  return (
    <div className="bg-accent border border-white/5 p-6 rounded-xl shadow-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">📚</span>
        <h3 className="text-xl font-bold text-white">Tài liệu gần đây</h3>
      </div>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group relative bg-background border border-white/5 rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-white group-hover:text-primary transition-colors">
                  {doc.title}
                </p>
                <p className="text-sm text-text-muted mt-1">
                  <span className="inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                      {doc.category}
                    </span>
                    <span>•</span>
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.lastViewed}</span>
                  </span>
                </p>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-muted">Tiến độ</span>
                    <span className="text-xs font-semibold text-primary">
                      {doc.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${doc.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;
