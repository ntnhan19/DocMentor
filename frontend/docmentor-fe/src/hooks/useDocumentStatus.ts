// src/hooks/useDocumentStatus.ts
import { useEffect, useMemo } from "react";
import { useDocumentStore } from "@/store/useDocumentStore";

export const useDocumentStatus = (
  selectedDocuments: Array<{ id: string; title: string }>
) => {
  const { docStatuses, updatePollingDocs } = useDocumentStore();

  // 1. Chỉ cập nhật danh sách cần poll khi ID thay đổi
  useEffect(() => {
    if (!selectedDocuments || selectedDocuments.length === 0) {
      updatePollingDocs([]);
      return;
    }

    const idsToPoll = selectedDocuments.map((d) => d.id);
    updatePollingDocs(idsToPoll);
  }, [selectedDocuments.length, selectedDocuments]);

  // 2. Tính toán xem có tài liệu nào đang được xử lý không
  const isProcessing = useMemo(() => {
    if (!selectedDocuments || selectedDocuments.length === 0) return false;
    
    return selectedDocuments.some(
      (doc) => docStatuses[doc.id] === false || docStatuses[doc.id] === undefined
    );
  }, [selectedDocuments, docStatuses]);

  return { isProcessing, docStatuses };
};
