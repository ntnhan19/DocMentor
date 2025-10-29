// src/features/documents/components/DocumentItem.tsx

import React from "react";
// Bạn cần cài đặt thư viện icon: npm install react-icons
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
} from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho tài liệu để tái sử dụng
export interface Document {
  id: number;
  title: string;
  type: "PDF" | "DOCX" | "PPTX" | "TXT";
  lastViewed: string;
  progress: number;
}

interface DocumentItemProps {
  document: Document;
  isSelected: boolean;
  onSelectionChange: (id: number) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  isSelected,
  onSelectionChange,
}) => {
  // Hàm để chọn icon dựa trên loại file
  const getIcon = () => {
    switch (document.type) {
      case "PDF":
        return <FaFilePdf className="text-red-500 w-8 h-8" />;
      case "DOCX":
        return <FaFileWord className="text-blue-500 w-8 h-8" />;
      case "PPTX":
        return <FaFilePowerpoint className="text-orange-500 w-8 h-8" />;
      default:
        return <FaFileAlt className="text-gray-500 w-8 h-8" />;
    }
  };

  return (
    // Thay đổi giao diện khi được chọn
    <div
      className={`flex items-center p-4 border rounded-xl transition-all duration-300 cursor-pointer ${
        isSelected
          ? "bg-primary/20 border-primary"
          : "bg-accent/60 border-primary/20 hover:bg-accent"
      }`}
      onClick={() => onSelectionChange(document.id)} // Cho phép click cả hàng để chọn
    >
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={isSelected}
          readOnly // readOnly vì ta đã xử lý click trên cả div cha
          className="h-5 w-5 rounded bg-accent border-primary/50 text-primary focus:ring-primary/50 cursor-pointer"
        />
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          {" "}
          {/* Thêm min-w-0 để truncate hoạt động */}
          <p className="font-bold text-white truncate">{document.title}</p>
          <p className="text-sm text-text-muted">
            Xem lần cuối: {document.lastViewed}
          </p>
        </div>
      </div>
      <div className="w-32 text-right ml-4">
        <p className="text-sm text-white">Tiến độ</p>
        <div className="w-full bg-accent/80 rounded-full h-1.5 mt-1">
          <div
            className="bg-secondary h-1.5 rounded-full"
            style={{ width: `${document.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DocumentItem;
