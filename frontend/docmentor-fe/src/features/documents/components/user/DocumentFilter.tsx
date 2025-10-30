import React from "react";

// Định nghĩa lại đúng kiểu Filters, khớp với DocumentsPage
export interface Filters {
  type?: string;
  sortBy?: "date_desc" | "date_asc" | "title_asc";
}

interface DocumentFilterProps {
  onFilterChange: (filters: Partial<Filters>) => void;
}

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-4">
      {/* Filter by Type */}
      <select
        onChange={(e) => onFilterChange({ type: e.target.value })}
        className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">Tất cả loại</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
        <option value="pptx">PPTX</option>
      </select>

      {/* Sort By */}
      <select
        onChange={(e) =>
          onFilterChange({
            sortBy: e.target.value as "date_desc" | "date_asc" | "title_asc",
          })
        }
        className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="date_desc">Mới nhất</option>
        <option value="date_asc">Cũ nhất</option>
        <option value="title_asc">Tên A-Z</option>
      </select>
    </div>
  );
};
