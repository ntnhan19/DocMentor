import React from "react";
import { Document } from "@/types/document.types";

interface DocumentViewerProps {
  document: Document;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  // Giả lập đường dẫn đến file trong thư mục `public` của bạn
  // Ví dụ: public/assets/placeholders/doc-001.pdf
  const fileUrl = `/assets/placeholders/${document.id}.${document.type}`;

  const renderContent = () => {
    // Dựa vào loại file để quyết định cách hiển thị
    switch (document.type) {
      case "pdf":
        return (
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={document.title}
          />
        );
      case "docx":
      case "pptx":
        // Dùng Google Docs Viewer để xem trước các file Office
        const googleViewerUrl = `https://docs.google.com/gview?url=${window.location.origin}${fileUrl}&embedded=true`;
        return (
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-0"
            title={document.title}
          />
        );
      case "txt":
        // Với file txt, bạn có thể fetch và hiển thị nội dung trực tiếp
        return <p className="p-4">Xem trước file TXT sẽ được hỗ trợ sau.</p>;
      default:
        return <p className="p-4">Không hỗ trợ xem trước cho loại file này.</p>;
    }
  };

  return (
    <div className="w-full h-[80vh] border rounded-lg bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {renderContent()}
    </div>
  );
};
