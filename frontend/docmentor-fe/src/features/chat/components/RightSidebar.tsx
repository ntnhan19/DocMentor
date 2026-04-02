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
      className={`fixed top-16 right-0 bottom-0 w-80 bg-black border-l border-white/5 z-30 transition-transform duration-300 shadow-2xl flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/5 bg-black flex-shrink-0">
        <h3 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/30 uppercase">
          <FiCpu className="text-white/40" /> Công cụ AI
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-white/20 hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* --- 4. RENDER: CONTENT CHÍNH --- */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <FiLoader className="w-8 h-8 text-white/30 animate-spin" />
          <p className="text-[12px] text-white/20 animate-pulse font-medium">
            AI đang phân tích...
          </p>
        </div>
      )}

      {/* Summary Viewer */}
      {!isAnalyzing && activeTool === "summary" && summaryResult && (
        <div className="flex-1 overflow-hidden">
          <SummaryViewer
            summary={summaryResult}
            onClose={() => setActiveTool("none")}
          />
        </div>
      )}

      {/* Quiz Viewer */}
      {!isAnalyzing && activeTool === "quiz" && quizResult && (
        <div className="flex-1 overflow-hidden">
          <QuizViewer
            questions={quizResult}
            onClose={() => setActiveTool("none")}
          />
        </div>
      )}

      {/* Mặc định: Hiển thị List tài liệu */}
      {!isAnalyzing && activeTool === "none" && (
        <>
          {/* TABS */}
          <div className="flex p-2 bg-white/[0.02] border-b border-white/5 flex-shrink-0">
            <button
              onClick={() => setActiveTab("context")}
              className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-lg transition-all ${activeTab === "context" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
            >
              Ngữ cảnh ({selectedDocuments.length})
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-lg transition-all ${activeTab === "library" ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}
            >
              + Thêm mới
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
            {activeTab === "context" && (
              <div className="space-y-8">
                {/* Selected Documents */}
                <div className="space-y-3">
                  {selectedDocuments.length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                      <p className="text-[11px] text-white/20">
                        Chưa có tài liệu nào
                      </p>
                    </div>
                  ) : (
                    selectedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300"
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-xl h-fit ${docStatuses[doc.id] === false ? "bg-white/5 text-white/20" : "bg-white/10 text-white/60"}`}>
                            {docStatuses[doc.id] === false ? (
                              <FiLoader className="animate-spin w-4 h-4" />
                            ) : (
                              <FiFileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium leading-relaxed text-white/80 line-clamp-2">
                              {doc.title}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveDocument(doc.id)}
                          className="absolute -top-2 -right-2 bg-black text-white/40 hover:text-red-400 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-2xl"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* AI Tools Area */}
                <div className="pt-6 border-t border-white/5">
                  <h4 className="mb-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    Gợi ý tác vụ AI
                  </h4>
                  <div className="grid gap-3">
                    <button
                      onClick={handleGenerateSummary}
                      disabled={selectedDocuments.length === 0}
                      className="flex items-center gap-4 p-4 transition-all apple-glass rounded-2xl hover:bg-white/5 group disabled:opacity-30 disabled:cursor-not-allowed group border border-white/5"
                    >
                      <div className="p-2.5 bg-white/5 text-white/60 rounded-xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <FiList size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[13px] font-semibold text-white/90">
                          Tóm tắt nhanh
                        </span>
                        <span className="text-[10px] text-white/30 font-medium">
                          Phân tích nội dung chính
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={handleGenerateQuiz}
                      disabled={selectedDocuments.length === 0}
                      className="flex items-center gap-4 p-4 transition-all apple-glass rounded-2xl hover:bg-white/5 group disabled:opacity-30 disabled:cursor-not-allowed group border border-white/5"
                    >
                      <div className="p-2.5 bg-white/5 text-white/60 rounded-xl group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <FiCheckSquare size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[13px] font-semibold text-white/90">
                          Tạo Quiz ôn tập
                        </span>
                        <span className="text-[10px] text-white/30 font-medium">
                          Kiểm tra lại kiến thức
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "library" && (
              <div className="space-y-8">
                <label
                  className={`block p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/5 cursor-pointer text-center transition-all group ${isUploading ? "opacity-30" : ""}`}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept=".pdf,.docx,.txt"
                  />
                  <FiUploadCloud className="w-8 h-8 mx-auto mb-3 text-white/20 group-hover:text-white transition-colors" />
                  <p className="text-[13px] font-semibold text-white/80">Tải lên tài liệu</p>
                  <p className="text-[10px] text-white/20 mt-1">PDF, DOCX, TXT</p>
                </label>
                <div>
                  <h4 className="mb-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    Thư viện sẵn có
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
                          disabled={isSelected || isUploading}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${isSelected ? "bg-white/10 border-white/20 opacity-50" : "bg-white/[0.02] border-transparent hover:bg-white/5 hover:border-white/5"}`}
                        >
                          <div className={`p-1.5 rounded-lg ${isSelected ? "text-white" : "text-white/20"}`}>
                            {isSelected ? <FiCheck /> : <FiFileText size={14} />}
                          </div>
                          <span className="flex-1 text-[13px] text-white/70 truncate font-medium">
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
