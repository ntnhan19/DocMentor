import React, { useState, useEffect, useCallback } from "react";
import { FiEdit2, FiX } from "react-icons/fi";

import { documentService } from "@/services/document/documentService";
import { Document } from "@/types/document.types";
import { DocumentGrid } from "@/features/documents/components/user/DocumentGrid";
import { DocumentList } from "@/features/documents/components/user/DocumentList";
import { DocumentSearch } from "@/features/documents/components/user/DocumentSearch";
import {
  DocumentFilter,
  Filters,
} from "@/features/documents/components/user/DocumentFilter";
import { Pagination } from "@/components/common/Pagination/Pagination";
import { useDebounce } from "@/hooks/common/useDebounce";
import Button from "@/components/common/Button";
import { DocumentUploadModal } from "@/features/documents/components/user/DocumentUploadModal";

type ViewMode = "grid" | "list";
type SortOption =
  | "date_desc"
  | "date_asc"
  | "title_asc"
  | "size_asc"
  | "size_desc";

interface ExtendedFilters extends Filters {
  sortBy?: SortOption;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [filters, setFilters] = useState<ExtendedFilters>({
    sortBy: "date_desc",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // Giữ là string
  const [editingTitle, setEditingTitle] = useState("");

  const DOCUMENTS_PER_PAGE = 10;

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments({
        page: currentPage,
        limit: DOCUMENTS_PER_PAGE,
        query: debouncedSearchQuery,
      });
      setDocuments(response.data);
      setTotalPages(Math.ceil(response.total / DOCUMENTS_PER_PAGE));
      setError(null);
    } catch (err) {
      setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    let result = [...documents];

    if (filters.type) {
      result = result.filter((doc) => doc.type === filters.type);
    }

    if (filters.sortBy === "date_desc") {
      result.sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    } else if (filters.sortBy === "date_asc") {
      result.sort(
        (a, b) =>
          new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
      );
    } else if (filters.sortBy === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === "size_asc") {
      result.sort((a, b) => a.fileSize - b.fileSize);
    } else if (filters.sortBy === "size_desc") {
      result.sort((a, b) => b.fileSize - a.fileSize);
    }

    setFilteredDocuments(result);
  }, [documents, filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<ExtendedFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleStartEdit = (doc: Document) => {
    setEditingId(String(doc.id)); // Convert to string immediately
    setEditingTitle(doc.title || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (editingTitle.trim()) {
      try {
        await documentService.renameDocument(id, editingTitle);
        setDocuments((prev) =>
          prev.map((doc) =>
            String(doc.id) === id ? { ...doc, title: editingTitle } : doc
          )
        );
        setEditingId(null);
      } catch (error) {
        console.error("Failed to update document:", error);
        setError("Cập nhật tên tài liệu thất bại.");
      }
    } else {
      setEditingId(null);
    }
  }; // FIX: Cập nhật state documents trực tiếp bằng dữ liệu từ modal

  const handleUploadSuccess = (newDoc: Document) => {
    // Đã khớp signature với modal
    setIsUploadModalOpen(false); // Cập nhật State documents trực tiếp để bỏ qua cache cũ
    setDocuments((prevDocuments) => {
      // Đảm bảo không có ID trùng lặp
      if (prevDocuments.some((doc) => doc.id === newDoc.id)) {
        return prevDocuments;
      }
      return [newDoc, ...prevDocuments]; // Thêm vào đầu danh sách
    }); // Cập nhật tổng số trang (Đã sửa lỗi cảnh báo bằng cách không dùng giá trị cũ)
    setTotalPages(Math.ceil((documents.length + 1) / DOCUMENTS_PER_PAGE)); // Tùy chọn: Gọi fetchDocuments sau một thời gian ngắn để đồng bộ hóa total count chính xác
    // setTimeout(() => fetchDocuments(), 5000);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      try {
        await documentService.deleteDocument(id);
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => String(doc.id) !== id)
        );
      } catch (error) {
        console.error("Failed to delete document:", error);
        setError("Xóa tài liệu thất bại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 relative pb-24">
            {/* Header */}     {" "}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent to-background border border-primary/20 p-6 md:p-8 mb-6 animate-fade-in">
               {" "}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               {" "}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
               {" "}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   {" "}
          <div className="animate-slide-in-left">
                       {" "}
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                            <FiEdit2 className="w-8 h-8" />              Thư
              viện tài liệu            {" "}
            </h1>
                       {" "}
            <p className="text-text-muted text-sm md:text-base">
                            Quản lý và tìm kiếm tài liệu của bạn một cách dễ
              dàng            {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="flex items-center gap-3 animate-slide-in-right">
                       {" "}
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
                            + Tải lên tài liệu            {" "}
            </Button>
                       {" "}
            <div className="flex items-center bg-accent/80 backdrop-blur-sm rounded-xl p-1 border border-primary/20">
                           {" "}
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                    : "text-text-muted hover:text-white"
                }`}
              >
                               {" "}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                                   {" "}
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                 {" "}
                </svg>
                             {" "}
              </button>
                           {" "}
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                    : "text-text-muted hover:text-white"
                }`}
              >
                               {" "}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                                   {" "}
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                                 {" "}
                </svg>
                             {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
               {" "}
        <div className="bg-accent/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20 shadow-lg">
                   {" "}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                       {" "}
            <div className="flex-1 w-full">
                            <DocumentSearch onSearch={handleSearch} />         
               {" "}
            </div>
                       {" "}
            <div className="flex-shrink-0">
                           {" "}
              <DocumentFilter onFilterChange={handleFilterChange} />         
               {" "}
            </div>
                                 {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
            {/* Documents */}     {" "}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
               {" "}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-accent/40 backdrop-blur-sm rounded-xl border border-primary/20">
                       {" "}
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-secondary rounded-full"></div>
                     {" "}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                       {" "}
            <div className="flex items-center justify-center gap-2 mb-2">
                            <FiX className="w-5 h-5 text-red-400" />           
                <p className="text-red-400">{error}</p>         {" "}
            </div>
                     {" "}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-accent/40 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
                       {" "}
            <p className="text-text-muted">Không tìm thấy tài liệu</p>       
             {" "}
          </div>
        ) : (
          <>
                       {" "}
            {viewMode === "grid" ? (
              <DocumentGrid
                documents={filteredDocuments}
                onDelete={handleDeleteDocument}
                editingId={editingId}
                editingTitle={editingTitle}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onEditingTitleChange={setEditingTitle}
              />
            ) : (
              <DocumentList
                documents={filteredDocuments}
                onDelete={handleDeleteDocument}
                editingId={editingId}
                editingTitle={editingTitle}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onEditingTitleChange={setEditingTitle}
              />
            )}
                       {" "}
            <div className="mt-8">
                           {" "}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
                         {" "}
            </div>
                     {" "}
          </>
        )}
             {" "}
      </div>
            {/* Upload Modal */}
           {" "}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
         {" "}
    </div>
  );
};

export default DocumentsPage;
