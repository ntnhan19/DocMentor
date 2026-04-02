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
    <div className="relative w-full group">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Tìm kiếm trong thư viện..."
          className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[14px] text-white placeholder-white/20 focus:outline-none focus:bg-white/[0.06] focus:border-white/10 focus:ring-4 focus:ring-white/5 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white transition-all bg-white/10 hover:bg-white/20 rounded-full p-1"
            title="Xóa"
          >
            <FiX className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
