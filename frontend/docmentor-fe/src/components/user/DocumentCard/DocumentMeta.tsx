import React from "react";
import { Document } from "@/types/document.types";
import { format } from "date-fns";

// ✅ Hàm format dung lượng file (copy từ DocumentCard hoặc dùng chuẩn này)
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface DocumentMetaProps {
  document: Document;
}

export const DocumentMeta: React.FC<DocumentMetaProps> = ({ document }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {document.summary}
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <strong>Ngày tải lên:</strong>{" "}
          {format(new Date(document.uploadDate), "dd/MM/yyyy HH:mm")}
        </li>
        <li>
          <strong>Loại file:</strong>{" "}
          <span className="uppercase font-semibold">{document.type}</span>
        </li>
        <li>
          <strong>Kích thước:</strong> {formatBytes(document.fileSize)}
        </li>
      </ul>
    </div>
  );
};
