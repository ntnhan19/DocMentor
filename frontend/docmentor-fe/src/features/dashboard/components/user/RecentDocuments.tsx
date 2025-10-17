// User dashboard components
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
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        📚 Tài liệu gần đây
      </h3>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-medium text-gray-800">{doc.title}</p>
              <p className="text-sm text-gray-500">
                {doc.category} • {doc.type} • {doc.lastViewed}
              </p>
            </div>
            <div className="text-sm text-indigo-600 font-semibold">
              {doc.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDocuments;
