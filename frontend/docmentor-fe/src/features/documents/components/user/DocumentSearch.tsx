// src/features/documents/components/user/DocumentSearch.tsx
import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface DocumentSearchProps {
  onSearch: (query: string) => void;
}

export const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider"></label>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Tìm kiếm tài liệu..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-accent border border-primary/30 text-white placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary/50"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-white transition-colors"
            title="Xóa"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
