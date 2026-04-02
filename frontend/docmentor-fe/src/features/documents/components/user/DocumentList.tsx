// src/features/documents/components/user/DocumentList.tsx
import React, { useState } from "react";
import { Document } from "@/types/document.types";
import { DocumentCard } from "@/features/documents/components/user/DocumentCard";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { documentService } from "@/services/document/documentService";

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  editingId?: string | null;
  editingTitle?: string;
  onStartEdit?: (doc: Document) => void;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onEditingTitleChange?: (title: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  onView,
  editingId,
  editingTitle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingTitleChange,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewText, setPreviewText] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const loadPreview = async (doc: Document) => {
    setSelectedDoc(doc);
    setIsLoadingPreview(true);
    setPreviewError(null);
    setPreviewText("");

    try {
      const blob = await documentService.getDocumentContent(String(doc.id));
      const fileType = doc.type.toLowerCase();

      if (fileType === "txt") {
        const text = await blob.text();
        const lines = text.split("\n").slice(0, 20).join("\n");
        setPreviewText(
          lines.substring(0, 2000) + (lines.length > 2000 ? "..." : "")
        );
      } else if (fileType === "pdf") {
        setPreviewText("📄 PDF Document\n\nNhấn vào tài liệu để xem chi tiết");
      } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
        setPreviewText("🖼️ Image File\n\nNhấn vào tài liệu để xem chi tiết");
      } else {
        setPreviewText(
          `📎 ${fileType.toUpperCase()} File\n\nNhấn vào tài liệu để xem chi tiết`
        );
      }
    } catch (err) {
      console.error("❌ Preview error:", err);
      setPreviewError("Không thể tải xem trước");
      setPreviewText(doc.summary || "Không có nội dung");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <>
      <div className="space-y-4 animate-fade-in">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onMouseEnter={() => loadPreview(doc)}
            onMouseLeave={() => setSelectedDoc(null)}
          >
            <DocumentCard
              document={doc}
              view="list"
              onDelete={onDelete}
              onView={onView}
              isSelected={false}
              editingId={editingId}
              editingTitle={editingTitle}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onEditingTitleChange={onEditingTitleChange}
            />
          </div>
        ))}
      </div>

      {/* Preview Panel - Apple Glass Heavy */}
      {selectedDoc && (
        <div className="fixed right-6 bottom-6 w-[400px] apple-glass-heavy rounded-[32px] border border-white/10 p-8 flex flex-col shadow-2xl z-50 max-h-[75vh] animate-in slide-in-from-right-10 duration-500">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-[19px] tracking-tight leading-tight line-clamp-2">
                {selectedDoc.title}
              </h3>
              <p className="text-[11px] font-bold text-white/30 mt-2 uppercase tracking-widest">
                {selectedDoc.type.toUpperCase()} • {(selectedDoc.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={() => setSelectedDoc(null)}
              className="p-2.5 rounded-full text-white/30 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
              title="Đóng"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto min-h-0 mb-4">
            {isLoadingPreview ? (
              <div className="flex flex-col items-center justify-center gap-4 h-52">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                <span className="text-[13px] font-medium text-white/30">
                  Đang chuẩn bị nội dung...
                </span>
              </div>
            ) : previewError ? (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-400 font-semibold">Lỗi</p>
                  <p className="text-xs text-red-300 mt-1">{previewError}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <pre className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap font-mono break-words">
                  {previewText || "Không có nội dung mô tả"}
                </pre>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-4">
            <button
              onClick={() => onView(String(selectedDoc.id))}
              className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] hover:bg-white/90 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
            >
              Mở tài liệu đầy đủ
            </button>
          </div>
        </div>
      )}
    </>
  );
};
