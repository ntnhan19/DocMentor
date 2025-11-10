// src/features/documents/components/user/DocumentGrid.tsx

import React from "react";
import { Document } from "@/types/document.types";
import { DocumentCard } from "@/features/documents/components/user/DocumentCard";

interface DocumentGridProps {
  documents: Document[];
  onDelete: (id: string) => void;
  selectedDocIds: string[];
  onSelectionChange: (id: string) => void;
  editingId?: string | null;
  editingTitle?: string;
  onStartEdit?: (doc: Document) => void;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onEditingTitleChange?: (title: string) => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDelete,
  selectedDocIds,
  onSelectionChange,
  editingId,
  editingTitle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditingTitleChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          view="grid"
          onDelete={onDelete}
          isSelected={selectedDocIds.includes(doc.id)}
          onSelectionChange={onSelectionChange}
          editingId={editingId}
          editingTitle={editingTitle}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditingTitleChange={onEditingTitleChange}
        />
      ))}
    </div>
  );
};
