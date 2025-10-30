/*import React from "react";
import { Document } from "@/types/document.types";

interface DocumentActionsProps {
  document: Document;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
}) => {
  const handleDownload = () => alert(`Downloading ${document.title}`);
  const handleSave = () => alert(`Saving ${document.title}`);
  const handleShare = () => alert(`Sharing ${document.title}`);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mt-4">
      <h3 className="font-bold mb-3">Hành động</h3>
      <div className="flex flex-col space-y-2">
        <button onClick={handleDownload} className="btn-primary">
          Tải xuống
        </button>
        <button onClick={handleSave} className="btn-secondary">
          Lưu vào thư viện
        </button>
        <button onClick={handleShare} className="btn-secondary">
          Chia sẻ
        </button>
      </div>
    </div>
  );
};
// Lưu ý: Bạn cần định nghĩa class `btn-primary`, `btn-secondary` trong file CSS global.*/
