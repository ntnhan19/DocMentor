import React from "react";
import { Document } from "@/types/document.types";
import { format } from "date-fns";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

interface DocumentCardProps {
  document: Document;
  view: "grid" | "list";
  onDelete: (id: string) => void;
  // ✅ Added onView prop
  onView: (id: string) => void;
  isSelected: boolean;
  editingId?: string | null;
  editingTitle?: string;
  onStartEdit?: (doc: Document) => void;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onEditingTitleChange?: (title: string) => void;
}

const typeToIconPath: Record<string, string> = {
  pdf: "/assets/icons/document-types/pdf.svg",
  docx: "/assets/icons/document-types/docx.svg",
  txt: "/assets/icons/document-types/txt.svg",
  pptx: "/assets/icons/document-types/pptx.svg",
};

const typeToGradient: Record<string, string> = {
  pdf: "from-white/10 to-white/5",
  docx: "from-white/10 to-white/5",
  txt: "from-white/10 to-white/5",
  pptx: "from-white/10 to-white/5",
};

const typeToBorder: Record<string, string> = {
  pdf: "border-white/10",
  docx: "border-white/10",
  txt: "border-white/10",
  pptx: "border-white/10",
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  view,
  onDelete,
  onView, // ✅
  isSelected,
  
  editingId,
  editingTitle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingTitleChange,
}) => {
  const { id, title, type, uploadDate, fileSize, summary } = document;
  const iconSrc = typeToIconPath[type];
  const formattedDate = format(new Date(uploadDate), "dd/MM/yyyy");
  const isEditing = editingId === String(id);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(String(document.id));
  };

  // ✅ New handler for card click
  const handleCardClick = () => {
    if (!isEditing) {
      onView(String(id));
    }
  };

  if (view === "list") {
    return (
      <div
        onClick={handleCardClick}
        className={`group relative overflow-hidden apple-glass border rounded-2xl p-5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 animate-in fade-in cursor-pointer ${
          isSelected
            ? "ring-1 ring-white ring-offset-black ring-offset-4"
            : "border-white/5"
        }`}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 z-20 bg-secondary text-white rounded-full p-1 shadow-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div
            className={`bg-gradient-to-br ${typeToGradient[type]} border ${typeToBorder[type]} rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
          >
            <img src={iconSrc} alt={`${type} icon`} className="w-10 h-10" />
          </div>
          <div className="flex-grow min-w-0">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={editingTitle || ""}
                  onChange={(e) => onEditingTitleChange?.(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg bg-background border border-primary/50 text-white focus:outline-none focus:border-primary text-sm"
                  placeholder="Tên tài liệu..."
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveEdit?.(String(id));
                  }}
                  className="p-1.5 rounded-lg bg-white text-black hover:bg-white/90 shadow-lg"
                  title="Lưu"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEdit?.();
                  }}
                  className="p-1.5 rounded-lg bg-white/10 text-white/40 hover:text-white hover:bg-white/20"
                  title="Hủy"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-[17px] text-white truncate group-hover:text-white transition-all duration-300">
                    {title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEdit?.(document);
                    }}
                    className="p-1.5 rounded-lg text-white/30 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100 flex-shrink-0 transition-all"
                    title="Chỉnh sửa"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-text-muted line-clamp-1">
                  {summary || "Không có mô tả"}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {formatBytes(fileSize)}
              </p>
              <p className="text-xs text-text-muted">{formattedDate}</p>
            </div>
            {!isEditing && (
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                title="Xóa tài liệu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col h-80 apple-glass border rounded-[32px] overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-2 animate-in fade-in cursor-pointer ${
        isSelected
          ? "ring-1 ring-white ring-offset-black ring-offset-4"
          : "border-white/5"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 left-3 z-20 bg-secondary text-white rounded-full p-1 shadow-lg">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {!isEditing && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-accent/90 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          title="Xóa tài liệu"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
      <div
        className={`relative bg-white/[0.03] border-b border-white/5 p-6 flex justify-center items-center h-32 group-hover:scale-105 transition-transform duration-500`}
      >
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={iconSrc}
          alt={`${type} icon`}
          className="w-16 h-16 drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="relative z-10 p-4 flex-grow flex flex-col">
        {isEditing ? (
          <div className="flex gap-2 mb-2">
            <input
              autoFocus
              type="text"
              value={editingTitle || ""}
              onChange={(e) => onEditingTitleChange?.(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-primary/50 text-white focus:outline-none focus:border-primary"
              placeholder="Tên tài liệu..."
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveEdit?.(String(id));
              }}
              className="p-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30"
              title="Lưu"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit?.();
              }}
              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              title="Hủy"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[17px] mb-2 text-white line-clamp-2 group-hover:text-white transition-all duration-300 tracking-tight">
              {title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit?.(document);
              }}
              className="p-1.5 rounded-lg text-white/30 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100 flex-shrink-0 transition-all"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-sm text-text-muted mb-3 line-clamp-3 flex-grow">
          {summary || "Không có mô tả cho tài liệu này"}
        </p>
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
            <div className="flex items-center gap-2 text-white/30">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-white/70">
                {formatBytes(fileSize)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
