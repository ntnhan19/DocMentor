import React, { useState, useEffect, useCallback } from "react";
// ✨ 1. Import hook và icon cần thiết cho tính năng mới
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

import { documentService } from "@/services/document/documentService";
import { Document } from "@/types/document.types";
import { DocumentGrid } from "@/features/documents/components/user/DocumentGrid";
import { DocumentList } from "@/features/documents/components/user/DocumentList";
import { DocumentSearch } from "@/features/documents/components/user/DocumentSearch";
import { Pagination } from "@/components/common/Pagination/Pagination";
import { useDebounce } from "@/hooks/common/useDebounce";
import Button from "@/components/common/Button";
import { DocumentUploadModal } from "@/features/documents/components/user/DocumentUploadModal";

type ViewMode = "grid" | "list";

const DocumentsPage: React.FC = () => {
  // --- Toàn bộ state gốc của bạn được giữ nguyên ---
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // ✨ 2. Thêm state và hook mới cho việc chọn và điều hướng

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const DOCUMENTS_PER_PAGE = 10; // --- Toàn bộ các hàm xử lý gốc của bạn được giữ nguyên ---

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
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    fetchDocuments();
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      try {
        await documentService.deleteDocument(id);
        // ✨ Cập nhật nhỏ: Đồng bộ hóa state khi xóa
        setSelectedDocIds((prev) => prev.filter((docId) => docId !== id));
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete document:", error);
        setError("Xóa tài liệu thất bại.");
      }
    }
  };

  // ✨ 3. Thêm các hàm xử lý mới cho tính năng lựa chọn
  const handleSelectionChange = (docId: string) => {
    setSelectedDocIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(docId)) {
        return prevSelectedIds.filter((id) => id !== docId);
      } else {
        return [...prevSelectedIds, docId];
      }
    });
  };

  const handleStartChat = () => {
    if (selectedDocIds.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu để bắt đầu trò chuyện.");
      return;
    }
    const queryParams = new URLSearchParams({
      docIds: selectedDocIds.join(","),
    }).toString();
    navigate(`/user/chat?${queryParams}`);
  };

  return (
    // ✨ 4. Thêm `relative pb-24` vào div ngoài cùng
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 relative pb-24">
            {/* --- Toàn bộ JSX gốc của bạn từ đây... --- */}     {" "}
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
                            Thư viện tài liệu            {" "}
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${viewMode === "grid" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30" : "text-text-muted hover:text-white"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                             {" "}
              </button>
                           {" "}
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${viewMode === "list" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30" : "text-text-muted hover:text-white"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
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
                    <DocumentSearch onSearch={handleSearch} />       {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
               {" "}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-accent/40 backdrop-blur-sm rounded-xl border border-primary/20">
            {/*...*/}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            {/*...*/}
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-accent/40 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
            {/*...*/}
          </div>
        ) : (
          <>
                       {" "}
            {viewMode === "grid" ? (
              <DocumentGrid
                documents={documents}
                onDelete={handleDeleteDocument} // ✨ 5. Truyền props mới xuống component con
                selectedDocIds={selectedDocIds}
                onSelectionChange={handleSelectionChange}
              />
            ) : (
              <DocumentList
                documents={documents}
                onDelete={handleDeleteDocument} // ✨ 5. Truyền props mới xuống component con
                selectedDocIds={selectedDocIds}
                onSelectionChange={handleSelectionChange}
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
            {/* --- Kết thúc JSX gốc của bạn --- */}     {" "}
      {/* ✨ 6. Thêm Thanh Hành Động Nổi (Floating Action Bar) */}
      {selectedDocIds.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg p-4 z-20 animate-slide-up">
          <div className="bg-accent/80 backdrop-blur-lg border border-primary/30 rounded-2xl shadow-2xl flex justify-between items-center p-4">
            <p className="font-medium text-white">
              Đã chọn{" "}
              <span className="font-bold text-secondary">
                {selectedDocIds.length}
              </span>{" "}
              tài liệu
            </p>
            <Button
              onClick={handleStartChat}
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/40 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <FiMessageSquare />
              Bắt đầu Chat
            </Button>
          </div>
        </div>
      )}
            {/* Modal upload của bạn giữ nguyên vị trí */}
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
