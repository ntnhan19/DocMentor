// src/features/documents/components/user/DocumentFilter.tsx

import React, { useState } from "react";

export interface Filters {
  type?: string;
  sortBy?: "date_desc" | "date_asc" | "title_asc" | "size_asc" | "size_desc";
}

interface DocumentFilterProps {
  onFilterChange: (filters: Partial<Filters>) => void;
}

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filters>({ sortBy: "date_desc" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSortChange = (sortBy: Filters["sortBy"]) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setIsDropdownOpen(false);
  };

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case "date_desc":
        return "Mới nhất";
      case "date_asc":
        return "Cũ nhất";
      case "title_asc":
        return "A-Z";
      case "size_desc":
        return "Kích thước (Lớn)";
      case "size_asc":
        return "Kích thước (Nhỏ)";
      default:
        return "Sắp xếp";
    }
  };

  const sortOptions = [
    { label: "Mới nhất", value: "date_desc" as const },
    { label: "Cũ nhất", value: "date_asc" as const },
    { label: "Tên A-Z", value: "title_asc" as const },
    { label: "Kích thước (Lớn)", value: "size_desc" as const },
    { label: "Kích thước (Nhỏ)", value: "size_asc" as const },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
      {/* Filter by Type */}

      {/* Sort Dropdown */}
      <div className="relative">
        <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider"></label>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2.5 rounded-lg bg-accent border border-primary/30 text-white hover:border-primary/50 transition-all flex items-center gap-2 font-medium hover:bg-accent/80"
        >
          <span>{getSortLabel()}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-48 bg-accent border border-primary/30 rounded-lg shadow-lg shadow-primary/20 z-10 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2.5 text-left transition-all flex items-center gap-2 ${
                  filters.sortBy === option.value
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "text-text-muted hover:text-white hover:bg-primary/20"
                }`}
              >
                <span>{option.label}</span>
                {filters.sortBy === option.value && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          const resetFilters = { sortBy: "date_desc" as const };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="px-6 py-2.5 rounded-lg bg-accent/50 border border-primary/20 text-text-muted hover:text-white hover:bg-accent hover:border-primary/50 transition-all font-medium hover:shadow-lg hover:shadow-primary/10 duration-300"
      >
        ↺ Đặt lại
      </button>
    </div>
  );
};
