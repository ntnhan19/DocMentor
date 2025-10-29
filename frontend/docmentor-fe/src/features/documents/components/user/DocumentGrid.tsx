// src/features/documents/components/user/DocumentGrid.tsx

import React from "react";
import { Document } from "@/types/document.types";
import { DocumentCard } from "@/components/user/DocumentCard/DocumentCard";
// ❌ Thẻ <Link> đã được loại bỏ ở đây

// ✨ 1. Thêm các props mới để quản lý việc lựa chọn
interface DocumentGridProps {
  documents: Document[];
  onDelete: (id: string) => void;
  selectedDocIds: string[];
  onSelectionChange: (id: string) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDelete,
  // ✨ 2. Nhận các props mới
  selectedDocIds,
  onSelectionChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {" "}
      {documents.map((doc) => (
        // ✨ 3. Truyền các props isSelected và onSelectionChange xuống DocumentCard
        //    Thẻ <Link> đã được loại bỏ. `key` được chuyển vào DocumentCard.
        <DocumentCard
          key={doc.id}
          document={doc}
          view="grid"
          onDelete={onDelete}
          isSelected={selectedDocIds.includes(doc.id)}
          onSelectionChange={onSelectionChange}
        />
      ))}
         {" "}
    </div>
  );
};
