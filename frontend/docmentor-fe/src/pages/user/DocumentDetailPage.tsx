// Document Detail
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { documentService } from "@/services/document/documentService";
import { Document } from "@/types/document.types";
import { DocumentViewer } from "@/features/documents/components/user/DocumentViewer";
import { DocumentMeta } from "@/components/user/DocumentCard/DocumentMeta";

const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        const data = await documentService.getDocumentById(documentId);
        if (data) {
          setDocument(data);
        } else {
          setError("Không tìm thấy tài liệu.");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải tài liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải tài liệu...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!document) {
    return <div className="text-center mt-10">Không có dữ liệu.</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Cột trái - Viewer */}
        <div className="lg:col-span-2">
          <DocumentViewer document={document} />
        </div>

        {/* Cột phải - Thông tin & Hành động */}
        <div className="lg:col-span-1">
          <DocumentMeta document={document} />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
