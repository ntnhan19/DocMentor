import React, { useEffect, useState } from "react";
import {
  dashboardService,
  ProcessingStatusData,
} from "@/services/dashboard/dashboardService";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export const ProcessingStatus: React.FC = () => {
  const [data, setData] = useState<ProcessingStatusData>({
    processing: [],
    failed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getProcessingStatus();
        setData(res);
      } catch (err) {
        console.error("Processing Status Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { processing, failed } = data;

  if (loading)
    return <div className="h-40 bg-white/5 rounded-2xl animate-pulse"></div>;

  if (processing.length === 0 && failed.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-8 mb-10 lg:grid-cols-2">
      {/* Cột Đang Xử Lý - Apple Glass */}
      <div className="p-8 apple-glass border border-white/5 rounded-[24px] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 text-white border rounded-xl bg-white/10 border-white/10">
            <FiLoader className="w-5 h-5 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Đang xử lý <span className="ml-2 text-sm font-medium text-white/30">({processing.length})</span>
          </h3>
        </div>

        {processing.length === 0 ? (
          <p className="py-10 text-[13px] font-medium text-center text-white/20 italic">
            Hệ thống đang sẵn sàng cho tài liệu mới
          </p>
        ) : (
          <div className="space-y-4">
            {processing.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 transition-all group/item"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-lg bg-white/5">
                    {doc.file_type}
                  </span>
                  <span className="text-[14px] font-medium text-white/90 truncate group-hover/item:text-white">
                    {doc.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cột Lỗi - Apple Subtle Red */}
      {failed.length > 0 && (
        <div className="p-8 bg-red-500/[0.02] border border-red-500/10 rounded-[24px] shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 text-red-400 border rounded-xl bg-red-500/10 border-red-500/20">
              <FiAlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Xử lý thất bại <span className="ml-2 text-sm font-medium text-red-400/40">({failed.length})</span>
            </h3>
          </div>

          <div className="space-y-4">
            {failed.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white/[0.02] rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="pr-4 text-[14px] font-medium text-white/90 truncate">
                    {doc.title}
                  </span>
                  <span className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded-lg">
                    {doc.file_type}
                  </span>
                </div>
                <p className="flex items-center gap-2 mt-3 text-[12px] font-medium text-red-400/80 bg-red-500/10 p-3 rounded-xl border border-red-500/5">
                  <FiAlertCircle size={14} className="flex-shrink-0" />
                  {doc.error || "Lỗi không xác định"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
