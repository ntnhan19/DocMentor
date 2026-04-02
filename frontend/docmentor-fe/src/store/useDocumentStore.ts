// src/store/useDocumentStore.ts
import { create } from "zustand";
import { documentService } from "@/services/document/documentService";

interface DocumentState {
  docStatuses: Record<string, boolean>; // { docId: isProcessed }
  isPolling: boolean;
  pollingDocIds: string[];
  
  // Actions
  setDocStatus: (id: string, isDone: boolean) => void;
  updatePollingDocs: (docIds: string[]) => void;
  checkStatuses: () => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => {
  let timeoutId: any = null;

  const runPolling = async () => {
    const { pollingDocIds } = get();
    if (pollingDocIds.length === 0) {
      set({ isPolling: false });
      return;
    }

    set({ isPolling: true });
    let anyStillProcessing = false;
    const updates: Record<string, boolean> = {};

    try {
      // Kiểm tra song song các tài liệu đang poll
      await Promise.all(
        pollingDocIds.map(async (id) => {
          try {
            // Nếu đã xong từ trước (trong store) thì bỏ qua? 
            // Không, ta cứ check cho chắc hoặc tối ưu ở đây.
            const doc = await documentService.getDocument(id);
            const isDone = doc.processed === true;
            updates[id] = isDone;
            if (!isDone) anyStillProcessing = true;
          } catch (e) {
            updates[id] = false;
            anyStillProcessing = true;
          }
        })
      );

      set((state) => ({
        docStatuses: { ...state.docStatuses, ...updates },
        isPolling: anyStillProcessing,
      }));

      // Nếu vẫn còn file chưa xong -> Đặt lịch tiếp theo (3s)
      if (anyStillProcessing) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(runPolling, 3000);
      }
    } catch (err) {
      console.error("Global Polling Error:", err);
      timeoutId = setTimeout(runPolling, 5000);
    }
  };

  return {
    docStatuses: {},
    isPolling: false,
    pollingDocIds: [],

    setDocStatus: (id, isDone) => 
      set((state) => ({
        docStatuses: { ...state.docStatuses, [id]: isDone }
      })),

    updatePollingDocs: (docIds) => {
      const currentIds = get().pollingDocIds;
      // Chỉ khởi động lại nếu danh sách ID thực sự thay đổi hoặc có ID mới
      if (JSON.stringify([...docIds].sort()) === JSON.stringify([...currentIds].sort())) {
        return;
      }

      set({ pollingDocIds: docIds });
      
      // Nếu có ID mới và chưa có polling chạy -> Chạy ngay
      if (docIds.length > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        runPolling();
      }
    },

    checkStatuses: async () => {
      await runPolling();
    }
  };
});
