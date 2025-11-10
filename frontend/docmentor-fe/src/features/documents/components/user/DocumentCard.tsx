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

// ✨ 1. Thêm props mới vào interface
interface DocumentCardProps {
  document: Document;
  view: "grid" | "list";
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
  editingId?: string | null;
  editingTitle?: string;
  onStartEdit?: (doc: Document) => void;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onEditingTitleChange?: (title: string) => void;
}

const typeToIconPath = {
  pdf: "/assets/icons/document-types/pdf.svg",
  docx: "/assets/icons/document-types/docx.svg",
  txt: "/assets/icons/document-types/txt.svg",
  pptx: "/assets/icons/document-types/pptx.svg",
};

const typeToGradient = {
  pdf: "from-red-500/20 to-red-600/20",
  docx: "from-blue-500/20 to-blue-600/20",
  txt: "from-gray-500/20 to-gray-600/20",
  pptx: "from-orange-500/20 to-orange-600/20",
};

const typeToBorder = {
  pdf: "border-red-500/30",
  docx: "border-blue-500/30",
  txt: "border-gray-500/30",
  pptx: "border-orange-500/30",
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  view,
  onDelete,
  // ✨ 2. Nhận các props mới
  isSelected,
  onSelectionChange,
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
  const isEditing = editingId === id;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(document.id);
  };

  if (view === "list") {
    return (
      <div
        onClick={() => !isEditing && onSelectionChange(id)}
        className={`group relative overflow-hidden bg-accent/40 backdrop-blur-sm border rounded-xl p-4 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in cursor-pointer ${isSelected ? "ring-2 ring-primary ring-offset-background ring-offset-2" : "border-primary/20"}`}
      >
        {/* Selected Indicator */}
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
        )}{" "}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
        <div className="relative z-10 flex items-center gap-4">
          {" "}
          <div
            className={`bg-gradient-to-br ${typeToGradient[type]} border ${typeToBorder[type]} rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
          >
            {" "}
            <img
              src={iconSrc}
              alt={`${type} icon`}
              className="w-10 h-10"
            />{" "}
          </div>{" "}
          <div className="flex-grow min-w-0">
            {" "}
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
                    onSaveEdit?.(id);
                  }}
                  className="p-1 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30"
                  title="Lưu"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEdit?.();
                  }}
                  className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  title="Hủy"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-lg text-white truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-300">
                    {title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEdit?.(document);
                    }}
                    className="p-1 rounded-lg text-primary hover:bg-primary/20 opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Chỉnh sửa"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-text-muted line-clamp-1">
                  {summary || "Không có mô tả"}
                </p>
              </>
            )}{" "}
          </div>{" "}
          <div className="flex items-center gap-4 flex-shrink-0">
            {" "}
            <div className="text-right">
              {" "}
              <p className="text-sm font-semibold text-white">
                {formatBytes(fileSize)}
              </p>{" "}
              <p className="text-xs text-text-muted">{formattedDate}</p>{" "}
            </div>{" "}
            {!isEditing && (
              <button
                onClick={handleDeleteClick}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                title="Xóa tài liệu"
              >
                {" "}
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
                </svg>{" "}
              </button>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  } // Grid View

  return (
    <div
      onClick={() => !isEditing && onSelectionChange(id)}
      className={`group relative flex flex-col h-80 bg-accent/40 backdrop-blur-sm border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-fade-in cursor-pointer ${isSelected ? "ring-2 ring-primary ring-offset-background ring-offset-2" : "border-primary/20"}`}
    >
      {/* Selected Indicator */}
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
      )}{" "}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
      {!isEditing && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-accent/90 backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          title="Xóa tài liệu"
        >
          {" "}
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
          </svg>{" "}
        </button>
      )}{" "}
      <div
        className={`relative bg-gradient-to-br ${typeToGradient[type]} border-b ${typeToBorder[type]} p-6 flex justify-center items-center h-32 group-hover:scale-105 transition-transform duration-300`}
      >
        {" "}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
        <img
          src={iconSrc}
          alt={`${type} icon`}
          className="w-16 h-16 drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300"
        />{" "}
      </div>{" "}
      <div className="relative z-10 p-4 flex-grow flex flex-col">
        {" "}
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
                onSaveEdit?.(id);
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
            <h3 className="font-bold text-lg mb-2 text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-300">
              {title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit?.(document);
              }}
              className="p-1 rounded-lg text-primary hover:bg-primary/20 opacity-0 group-hover:opacity-100 flex-shrink-0"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
        )}{" "}
        <p className="text-sm text-text-muted mb-3 line-clamp-3 flex-grow">
          {summary || "Không có mô tả cho tài liệu này"}
        </p>{" "}
        <div className="mt-auto pt-3 border-t border-primary/20">
          {" "}
          <div className="flex items-center justify-between text-xs">
            {" "}
            <div className="flex items-center gap-1.5 text-text-muted">
              {" "}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formattedDate}</span>{" "}
            </div>{" "}
            <div className="flex items-center gap-1.5">
              {" "}
              <div className="px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-lg font-semibold text-white">
                {formatBytes(fileSize)}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
