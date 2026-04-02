import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiX } from "react-icons/fi";

import { documentService } from "@/services/document/documentService";
import { Document, Folder } from "@/types/document.types";
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
import { FolderManager } from "@/features/documents/components/user/FolderManager";

type ViewMode = "grid" | "list";
type SortOption =
  | "date_desc"
  | "date_asc"
  | "title_asc"
  | "size_asc"
  | "size_desc";

interface ExtendedFilters extends Filters {
  sortBy?: SortOption;
  dateRange?: "all" | "today" | "week" | "month" | "3months";
  status?: string;
}

const DOCUMENTS_PER_PAGE = 10;

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<
    string | number | null
  >(null);
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      const foldersList = await documentService.getFolders();
      setFolders(foldersList);
    } catch (err) {
      console.error("Failed to fetch folders:", err);
      setError("Không thể tải thư mục. Vui lòng thử lại sau.");
    }
  }, []);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments({
        page: currentPage,
        limit: DOCUMENTS_PER_PAGE,
        query: debouncedSearchQuery,
        folderId: selectedFolderId || undefined,
      });
      setDocuments(response.data);
      setTotalPages(Math.ceil(response.total / DOCUMENTS_PER_PAGE));
      setError(null);
    } catch (err: any) {
      console.error("❌ Fetch documents error:", err);
      if (err?.status === 401) {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
        navigate("/login", { replace: true });
        return;
      }
      setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, selectedFolderId, navigate]);

  // Apply filters
  useEffect(() => {
    let result = [...documents];

    if (filters.type) {
      const filterType = filters.type.toLowerCase();
      result = result.filter(
        (doc) => (doc.type?.toLowerCase() || "") === filterType
      );
    }

    if (filters.status) {
      result = result.filter((doc) => doc.status === filters.status);
    }

    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      let daysAgo = 0;

      switch (filters.dateRange) {
        case "today":
          daysAgo = 0;
          break;
        case "week":
          daysAgo = 7;
          break;
        case "month":
          daysAgo = 30;
          break;
        case "3months":
          daysAgo = 90;
          break;
      }

      const cutoffDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );

      result = result.filter((doc) => new Date(doc.uploadDate) >= cutoffDate);
    }

    switch (filters.sortBy) {
      case "date_desc":
        result.sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
        break;
      case "date_asc":
        result.sort(
          (a, b) =>
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        );
        break;
      case "title_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "size_asc":
        result.sort((a, b) => a.fileSize - b.fileSize);
        break;
      case "size_desc":
        result.sort((a, b) => b.fileSize - a.fileSize);
        break;
    }

    setFilteredDocuments(result);
  }, [documents, filters]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);
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
  const handleViewDocument = (id: string) => {
    navigate(`/user/documents/${id}`);
  };

  const handleStartEdit = (doc: Document) => {
    setEditingId(String(doc.id));
    setEditingTitle(doc.title || "");
  };
  const handleSaveEdit = async (id: string) => {
    if (!editingTitle.trim()) return setEditingId(null);
    try {
      await documentService.renameDocument(id, editingTitle);
      setDocuments((prev) =>
        prev.map((doc) =>
          String(doc.id) === id ? { ...doc, title: editingTitle } : doc
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update document:", err);
      setError("Cập nhật tên tài liệu thất bại.");
    }
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?"))
      return;
    try {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => String(doc.id) !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Xóa tài liệu thất bại.");
    }
  };

  // Folder handlers
  const handleSelectFolder = (folderId: string | number | null) => {
    setSelectedFolderId(folderId);
    setCurrentPage(1);
  };

  const handleCreateFolder = async (name: string, description?: string) => {
    try {
      const newFolder = await documentService.createFolder(name, description);
      setFolders((prev) => [...prev, newFolder]);
    } catch (err) {
      console.error("Failed to create folder:", err);
      setError("Tạo thư mục thất bại.");
    }
  };

  const handleDeleteFolder = async (folderId: string | number) => {
    try {
      await documentService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
      if (selectedFolderId === folderId) setSelectedFolderId(null);
    } catch (err) {
      console.error("Failed to delete folder:", err);
      setError("Xóa thư mục thất bại.");
    }
  };

  const handleRenameFolder = async (
    folderId: string | number,
    newName: string
  ) => {
    try {
      await documentService.renameFolder(folderId, newName);
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, name: newName } : folder
        )
      );
    } catch (err) {
      console.error("Failed to rename folder:", err);
      setError("Đổi tên thư mục thất bại.");
    }
  };

  const handleUploadSuccess = (newDoc: Document) => {
    setIsUploadModalOpen(false);
    setDocuments((prev) => [newDoc, ...prev]);
    setTotalPages(Math.ceil((documents.length + 1) / DOCUMENTS_PER_PAGE));
  };

  return (
    <div className="relative min-h-screen p-4 pb-32 bg-black md:p-6 lg:p-8 animate-in fade-in duration-700">
      {/* Header - Apple Minimalist */}
      <div className="relative p-8 mb-8 overflow-hidden border border-white/5 rounded-3xl bg-white/[0.02] md:p-10">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-4 mb-3 text-3xl font-bold text-white md:text-4xl tracking-tight">
              <FiEdit2 className="w-8 h-8 text-white/40" /> Thư viện tài liệu
            </h1>
            <p className="max-w-2xl text-[15px] font-medium text-apple-primary-muted">
              Quản lý và tìm kiếm tài liệu của bạn một cách dễ dàng trong không gian làm việc tập trung.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-white hover:bg-white/90 text-black px-6 h-11 rounded-full font-bold shadow-2xl shadow-white/10 transition-all duration-300 active:scale-95"
            >
              + Tải lên tài liệu
            </Button>
            <div className="flex items-center p-1.5 border border-white/10 bg-white/[0.05] rounded-[14px]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white text-black shadow-lg"
                    : "text-white/30 hover:text-white/70"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <div className="w-px h-5 mx-1 bg-white/10"></div>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white text-black shadow-lg"
                    : "text-white/30 hover:text-white/70"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Folder Manager */}
      <div className="mb-8 p-6 apple-glass-heavy border border-white/5 rounded-3xl animate-in slide-in-from-top-4 duration-500">
        <FolderManager
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={handleSelectFolder}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFolder={handleRenameFolder}
        />
      </div>

      {/* Search & Filter */}
      <div className="relative z-30 mb-10">
        <div className="p-6 apple-glass border border-white/5 rounded-3xl space-y-6">
          <div className="w-full">
            <DocumentSearch onSearch={handleSearch} />
          </div>
          <div className="h-px bg-white/5"></div>
          <div className="w-full">
            <DocumentFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="relative z-10 animate-fade-in">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 border bg-accent/40 backdrop-blur-sm rounded-xl border-primary/20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin border-primary border-t-secondary"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center border bg-red-500/10 border-red-500/30 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiX className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center border bg-accent/40 backdrop-blur-sm border-primary/20 rounded-xl">
            <p className="text-text-muted">Không tìm thấy tài liệu</p>
          </div>
        ) : (
          <>
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
                onView={handleViewDocument}
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
                onView={handleViewDocument}
              />
            )}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default DocumentsPage;
