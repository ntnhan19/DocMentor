// src/features/chat/components/RightSidebar.tsx

import React, { useState } from "react";
import {
  FiX,
  FiCpu,
  FiUploadCloud,
  FiCheck,
  FiFileText,
  FiList,
  FiCheckSquare,
  FiLoader,
} from "react-icons/fi";
import { Document } from "@/types/document.types";
import { documentService } from "@/services/document/documentService";
// 1. Import Service & Components mới
import {
  analysisService,
  QuizQuestion,
} from "@/services/analysis/analysisService";
import { SummaryViewer } from "./analysis/SummaryViewer";
import { QuizViewer } from "./analysis/QuizViewer";
import { useDocumentStore } from "@/store/useDocumentStore";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocuments: Array<{ id: string; title: string }>;
  onRemoveDocument: (id: string) => void;
  onAddDocument: (doc: { id: string; title: string }) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  selectedDocuments,
  onRemoveDocument,
  onAddDocument,
}) => {
  const [activeTab, setActiveTab] = useState<"context" | "library">("context");
  const [libraryDocs, setLibraryDocs] = useState<Document[]>([]);
  const [, setIsLoadingLibrary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATE CHO AI ANALYSIS ---
  const [activeTool, setActiveTool] = useState<"none" | "summary" | "quiz">(
    "none"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizQuestion[] | null>(null);

  // 1. Kết nối với Global Document Store
  const { docStatuses, updatePollingDocs } = useDocumentStore();

  // 2. Tự động theo dõi các tài liệu đang chọn
  React.useEffect(() => {
    const unprocessedIds = selectedDocuments.map(d => d.id);
    if (unprocessedIds.length > 0) {
      updatePollingDocs(unprocessedIds);
    }
  }, [selectedDocuments, updatePollingDocs]);

  React.useEffect(() => {
    if (activeTab === "library" && libraryDocs.length === 0) loadLibrary();
  }, [activeTab]);

  const loadLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await documentService.getDocuments({ page: 1, limit: 20 });
      setLibraryDocs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const doc = await documentService.uploadDocument(file, file.name);
      onAddDocument({ id: String(doc.id), title: doc.title });
      setActiveTab("context");
    } catch (error) {
      alert("Lỗi upload file");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 2. HANDLER: GENERATE SUMMARY ---
  const handleGenerateSummary = async () => {
    if (selectedDocuments.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu để tóm tắt.");
      return;
    }
    // Lấy tài liệu đầu tiên
    const targetDocId = parseInt(selectedDocuments[0].id);

    setIsAnalyzing(true);
    setActiveTool("summary"); // Chuyển state UI ngay
    setSummaryResult(null); // Reset cũ

    try {
      const res = await analysisService.generateSummary(targetDocId, "medium");
      setSummaryResult(res.summary);
    } catch (error) {
      console.error(error);
      alert("Không thể tạo tóm tắt. Vui lòng thử lại.");
      setActiveTool("none");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- 3. HANDLER: GENERATE QUIZ ---
  const handleGenerateQuiz = async () => {
    if (selectedDocuments.length === 0) {
      alert("Vui lòng chọn ít nhất một tài liệu để tạo câu hỏi.");
      return;
    }
    const targetDocId = parseInt(selectedDocuments[0].id);

    setIsAnalyzing(true);
    setActiveTool("quiz");
    setQuizResult(null);

    try {
      const questions = await analysisService.generateQuiz(
        targetDocId,
        5,
        "medium"
      );
      setQuizResult(questions);
    } catch (error) {
      console.error(error);
      alert("Không thể tạo câu hỏi. Vui lòng thử lại.");
      setActiveTool("none");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <aside
      className={`fixed top-16 right-0 bottom-0 w-80 bg-[#100D20] border-l border-white/5 z-30 transition-transform duration-300 shadow-2xl flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#100D20] flex-shrink-0">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-white uppercase">
          <FiCpu className="text-secondary" /> Công cụ AI
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* --- 4. RENDER: CONTENT CHÍNH --- 
          Nếu đang dùng tool (Summary/Quiz) thì hiển thị Viewer, 
          Ngược lại hiển thị danh sách tài liệu như cũ 
      */}

      {/* Nếu đang loading tool */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center flex-1 space-y-3">
          <FiLoader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-gray-400 animate-pulse">
            AI đang đọc tài liệu...
          </p>
        </div>
      )}

      {/* Nếu có kết quả Summary */}
      {!isAnalyzing && activeTool === "summary" && summaryResult && (
        <SummaryViewer
          summary={summaryResult}
          onClose={() => setActiveTool("none")}
        />
      )}

      {/* Nếu có kết quả Quiz */}
      {!isAnalyzing && activeTool === "quiz" && quizResult && (
        <QuizViewer
          questions={quizResult}
          onClose={() => setActiveTool("none")}
        />
      )}

      {/* Mặc định: Hiển thị List tài liệu (Chỉ hiện khi KHÔNG dùng tool) */}
      {!isAnalyzing && activeTool === "none" && (
        <>
          {/* TABS */}
          <div className="flex p-2 bg-[#141126] border-b border-white/5 flex-shrink-0">
            <button
              onClick={() => setActiveTab("context")}
              className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "context" ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
            >
              Ngữ cảnh ({selectedDocuments.length})
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "library" ? "bg-primary text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
            >
              + Thêm mới
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            {activeTab === "context" && (
              <div className="space-y-6">
                {/* Danh sách tài liệu đã chọn */}
                <div className="space-y-3">
                  {selectedDocuments.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                      <p className="text-xs text-gray-400">
                        Chưa có tài liệu nào
                      </p>
                    </div>
                  ) : (
                    selectedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative p-3 bg-[#1A162D] rounded-xl border border-white/5 hover:border-primary/30 transition-all"
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg h-fit ${docStatuses[doc.id] === false ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
                            {docStatuses[doc.id] === false ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiFileText />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug text-gray-200 line-clamp-2">
                              {doc.title}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveDocument(doc.id)}
                          className="absolute -top-2 -right-2 bg-[#25203b] text-gray-400 hover:text-red-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-lg"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* AI Tools Buttons */}
                <div className="pt-4 border-t border-white/5">
                  <h4 className="mb-4 text-xs font-bold text-gray-500 uppercase">
                    Gợi ý tác vụ
                  </h4>
                  <div className="grid gap-2">
                    <button
                      onClick={handleGenerateSummary}
                      disabled={selectedDocuments.length === 0}
                      className="flex items-center gap-3 p-3 transition-all border border-transparent bg-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-1.5 bg-green-500/10 text-green-400 rounded-lg group-hover:bg-green-500/20">
                        <FiList />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white">
                          Tóm tắt ngữ cảnh
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Tạo bản tóm tắt nhanh nội dung
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={handleGenerateQuiz}
                      disabled={selectedDocuments.length === 0}
                      className="flex items-center gap-3 p-3 transition-all border border-transparent bg-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500/20">
                        <FiCheckSquare />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-medium text-gray-300 group-hover:text-white">
                          Tạo câu hỏi ôn tập
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Trắc nghiệm kiến thức 5 câu
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "library" && (
              // (Giữ nguyên phần render Library cũ của bạn)
              <div className="space-y-6">
                {/* ... Upload & List Library ... */}
                <label
                  className={`block p-6 border border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer text-center transition-all ${isUploading ? "opacity-50" : ""}`}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept=".pdf,.docx,.txt"
                  />
                  <FiUploadCloud className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="text-sm text-white">Tải lên từ máy tính</p>
                </label>
                <div>
                  <h4 className="mb-3 text-xs font-bold text-gray-500 uppercase">
                    Thư viện của tôi
                  </h4>
                  <div className="space-y-2">
                    {libraryDocs.map((doc) => {
                      const isSelected = selectedDocuments.some(
                        (d) => d.id === String(doc.id)
                      );
                      return (
                        <button
                          key={doc.id}
                          onClick={() =>
                            !isSelected &&
                            onAddDocument({
                              id: String(doc.id),
                              title: doc.title,
                            })
                          }
                          disabled={isSelected}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all border ${isSelected ? "bg-primary/10 border-primary/30 opacity-60" : "bg-[#1A162D] border-transparent hover:bg-white/5"}`}
                        >
                          <div
                            className={`p-1.5 rounded-md ${isSelected ? "text-primary" : "text-gray-400"}`}
                          >
                            {isSelected ? <FiCheck /> : <FiFileText />}
                          </div>
                          <span className="flex-1 text-sm text-gray-300 truncate">
                            {doc.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};
