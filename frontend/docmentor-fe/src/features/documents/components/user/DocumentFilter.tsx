import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface Filters {
  type?: string;
  status?: string;
  dateRange?: "all" | "today" | "week" | "month" | "3months";
  sortBy?: "date_desc" | "date_asc" | "title_asc" | "size_asc" | "size_desc";
}

interface DocumentFilterProps {
  onFilterChange: (filters: Partial<Filters>) => void;
}

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filters>({
    sortBy: "date_desc",
    dateRange: "all",
    status: "all",
  });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const closeAllDropdowns = () => {
    setIsSortDropdownOpen(false);
    setIsTypeDropdownOpen(false);
    setIsStatusDropdownOpen(false);
    setIsDateDropdownOpen(false);
  };

  const handleSortChange = (sortBy: Filters["sortBy"]) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
    closeAllDropdowns();
  };

  const handleTypeChange = (type: string) => {
    const newType = type === "all" ? undefined : type;
    const newFilters = { ...filters, type: newType };
    setFilters(newFilters);
    console.log("🔍 Filter by type:", {
      selectedType: type,
      filters: newFilters,
    });
    onFilterChange(newFilters);
    closeAllDropdowns();
  };

  const handleStatusChange = (status: string) => {
    const newStatus = status === "all" ? undefined : status;
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    console.log("🔍 Filter by status:", {
      selectedStatus: status,
      filters: newFilters,
    });
    onFilterChange(newFilters);
    closeAllDropdowns();
  };

  const handleDateChange = (dateRange: Filters["dateRange"]) => {
    const newFilters = { ...filters, dateRange };
    setFilters(newFilters);
    console.log("🔍 Filter by date:", {
      selectedRange: dateRange,
      filters: newFilters,
    });
    onFilterChange(newFilters);
    closeAllDropdowns();
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

  const getTypeLabel = () => {
    switch (filters.type) {
      case "pdf":
        return "PDF";
      case "docx":
        return "DOCX";
      case "txt":
        return "TXT";
      default:
        return "Tất cả loại";
    }
  };

  const getStatusLabel = () => {
    switch (filters.status) {
      case "ready":
        return "✓ Sẵn sàng";
      case "processing":
        return "⟳ Đang xử lý";
      case "failed":
        return "✗ Lỗi";
      default:
        return "Tất cả trạng thái";
    }
  };

  const getDateLabel = () => {
    switch (filters.dateRange) {
      case "today":
        return "Hôm nay";
      case "week":
        return "7 ngày qua";
      case "month":
        return "30 ngày qua";
      case "3months":
        return "90 ngày qua";
      default:
        return "Tất cả thời gian";
    }
  };

  const sortOptions = [
    { label: "Mới nhất", value: "date_desc" as const },
    { label: "Cũ nhất", value: "date_asc" as const },
    { label: "Tên A-Z", value: "title_asc" as const },
    { label: "Kích thước (Lớn)", value: "size_desc" as const },
    { label: "Kích thước (Nhỏ)", value: "size_asc" as const },
  ];

  const typeOptions = [
    { label: "Tất cả loại", value: "all" },
    { label: "PDF", value: "pdf" },
    { label: "DOCX", value: "docx" },
    { label: "TXT", value: "txt" },
  ];

  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "✓ Sẵn sàng", value: "ready" },
    { label: "⟳ Đang xử lý", value: "processing" },
    { label: "✗ Lỗi", value: "failed" },
  ];

  const dateOptions = [
    { label: "Tất cả thời gian", value: "all" as const },
    { label: "Hôm nay", value: "today" as const },
    { label: "7 ngày qua", value: "week" as const },
    { label: "30 ngày qua", value: "month" as const },
    { label: "90 ngày qua", value: "3months" as const },
  ];

  return (
    <div className="w-full">
      {/* Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Filter by Type */}
        <div className="relative flex-1 sm:flex-none min-w-[120px]">
          <button
            onClick={() => {
              closeAllDropdowns();
              setIsTypeDropdownOpen(!isTypeDropdownOpen);
            }}
            className="w-full px-4 py-2.5 rounded-xl apple-glass text-white hover:bg-white/10 transition-all flex items-center justify-between gap-2 font-medium text-sm"
          >
            <span className="truncate">{getTypeLabel()}</span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 transition-transform ${isTypeDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isTypeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-56 apple-glass-heavy border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in slide-in-from-top-2 duration-300">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={`w-full px-4 py-2 rounded-xl text-left text-sm transition-all flex items-center gap-2 ${
                    (option.value === "all" && !filters.type) ||
                    filters.type === option.value
                      ? "bg-white text-black font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{option.label}</span>
                  {((option.value === "all" && !filters.type) ||
                    filters.type === option.value) && (
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

        {/* Filter by Status */}
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <button
            onClick={() => {
              closeAllDropdowns();
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
            }}
            className="w-full px-3 py-2.5 rounded-lg bg-accent border border-primary/30 text-white hover:border-primary/50 transition-all flex items-center justify-between gap-2 font-medium hover:bg-accent/80 text-sm"
          >
            <span className="truncate">{getStatusLabel()}</span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-64 apple-glass-heavy border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in slide-in-from-top-2 duration-300">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full px-4 py-2 rounded-xl text-left text-sm transition-all flex items-center gap-2 ${
                    (option.value === "all" && !filters.status) ||
                    filters.status === option.value
                      ? "bg-white text-black font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{option.label}</span>
                  {((option.value === "all" && !filters.status) ||
                    filters.status === option.value) && (
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

        {/* Filter by Date */}
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <button
            onClick={() => {
              closeAllDropdowns();
              setIsDateDropdownOpen(!isDateDropdownOpen);
            }}
            className="w-full px-3 py-2.5 rounded-lg bg-accent border border-primary/30 text-white hover:border-primary/50 transition-all flex items-center justify-between gap-2 font-medium hover:bg-accent/80 text-sm"
          >
            <span className="truncate">{getDateLabel()}</span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDateDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-64 apple-glass-heavy border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in slide-in-from-top-2 duration-300">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateChange(option.value)}
                  className={`w-full px-4 py-2 rounded-xl text-left text-sm transition-all flex items-center gap-2 ${
                    filters.dateRange === option.value
                      ? "bg-white text-black font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{option.label}</span>
                  {filters.dateRange === option.value && (
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

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[120px]">
          <button
            onClick={() => {
              closeAllDropdowns();
              setIsSortDropdownOpen(!isSortDropdownOpen);
            }}
            className="w-full px-3 py-2.5 rounded-lg bg-accent border border-primary/30 text-white hover:border-primary/50 transition-all flex items-center justify-between gap-2 font-medium hover:bg-accent/80 text-sm"
          >
            <span className="truncate">{getSortLabel()}</span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full sm:w-56 apple-glass-heavy border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in slide-in-from-top-2 duration-300">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-2 rounded-xl text-left text-sm transition-all flex items-center gap-2 ${
                    filters.sortBy === option.value
                      ? "bg-white text-black font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5"
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
            closeAllDropdowns();
            const resetFilters: Filters = {
              sortBy: "date_desc",
              dateRange: undefined,
              status: undefined,
            };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all font-bold text-[13px] uppercase tracking-widest active:scale-95 duration-300 flex items-center justify-center gap-2"
        >
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentFilter;
