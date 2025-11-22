// src/features/chat/components/DocumentSelectionModal.tsx - FIXED
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCheck, FiArrowLeft } from "react-icons/fi";
import { documentService } from "@/services/document/documentService";
import { Document } from "@/types/document.types";
import Button from "@/components/common/Button";
import { useDebounce } from "@/hooks/common/useDebounce";

interface DocumentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentsSelected: (
    documents: Array<{ id: string; title: string }>
  ) => void;
}

export const DocumentSelectionModal: React.FC<DocumentSelectionModalProps> = ({
  isOpen,
  onClose,
  onDocumentsSelected,
}) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<(string | number)[]>([]); // ✨ Accept both types
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const DOCUMENTS_PER_PAGE = 8;

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, currentPage, debouncedSearchQuery]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments({
        page: currentPage,
        limit: DOCUMENTS_PER_PAGE,
        query: debouncedSearchQuery,
      });
      setDocuments(response.data);
      setTotalPages(Math.ceil(response.total / DOCUMENTS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDocument = (docId: string | number) => {
    setSelectedDocIds((prev) =>
      prev.some((id) => String(id) === String(docId)) // ✨ Convert to string for comparison
        ? prev.filter((id) => String(id) !== String(docId))
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((doc) => doc.id));
    }
  };

  const handleConfirm = () => {
    const selected = documents.filter(
      (doc) => selectedDocIds.some((id) => String(id) === String(doc.id)) // ✨ Safe comparison
    );
    onDocumentsSelected(
      selected.map((doc) => ({
        id: String(doc.id), // ✨ Convert to string
        title: doc.title,
      }))
    );
  };

  const handleNavigateToDocuments = () => {
    localStorage.setItem(
      "selectedDocIds",
      JSON.stringify(selectedDocIds.map((id) => String(id)))
    );
    navigate("/user/documents");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-accent/95 backdrop-blur-lg border border-primary/30 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b border-primary/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Chọn tài liệu để chat
          </h2>
          <p className="text-text-muted text-sm">
            Chọn một hoặc nhiều tài liệu từ "Tài liệu của tôi"
          </p>
        </div>

        {/* Search Bar */}
        <div className="border-b border-primary/20 p-4">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-accent/60 border border-primary/20 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Nút chuyển sang Documents */}
            <Button
              onClick={handleNavigateToDocuments}
              className="p-2.5 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors"
              title="Quản lý tài liệu"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-secondary rounded-full"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted gap-4">
              <p>Không tìm thấy tài liệu nào</p>
              <Button
                onClick={() => navigate("/user/documents")}
                className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-primary hover:bg-primary/30 transition-colors text-sm"
              >
                Đến trang Tài liệu
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Select All */}
              <div
                onClick={handleSelectAll}
                className="p-3 bg-accent/80 border border-primary/20 rounded-lg cursor-pointer hover:bg-accent/90 transition-colors flex items-center gap-3"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedDocIds.length === documents.length
                      ? "bg-primary border-primary"
                      : "border-primary/50 hover:border-primary"
                  }`}
                >
                  {selectedDocIds.length === documents.length && (
                    <FiCheck className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-white flex-1">
                  Chọn tất cả ({documents.length})
                </span>
              </div>

              {/* Document Items */}
              {documents.map((doc) => (
                <div
                  key={String(doc.id)} // ✨ Ensure string key
                  onClick={() => handleToggleDocument(doc.id)}
                  className="p-3 bg-accent/80 border border-primary/20 rounded-lg cursor-pointer hover:bg-accent/90 transition-colors flex items-center gap-3"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedDocIds.some((id) => String(id) === String(doc.id)) // ✨ Safe comparison
                        ? "bg-primary border-primary"
                        : "border-primary/50 hover:border-primary"
                    }`}
                  >
                    {selectedDocIds.some(
                      (id) => String(id) === String(doc.id)
                    ) && ( // ✨ Safe comparison
                      <FiCheck className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {doc.title}
                    </p>
                    <p className="text-text-muted text-sm">
                      {new Date(doc.uploadDate).toLocaleDateString("vi-VN")} •{" "}
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-primary/20 p-4 flex items-center justify-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm disabled:opacity-50"
            >
              Trước
            </Button>
            <span className="text-text-muted text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-primary/20 p-4 flex items-center justify-between bg-accent/60">
          <p className="text-text-muted text-sm">
            Đã chọn{" "}
            <span className="font-bold text-primary">
              {selectedDocIds.length}
            </span>{" "}
            tài liệu
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              className="px-6 py-2.5 bg-accent/80 border border-primary/20 text-white rounded-lg hover:bg-accent transition-colors"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedDocIds.length === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              Xác nhận ({selectedDocIds.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
