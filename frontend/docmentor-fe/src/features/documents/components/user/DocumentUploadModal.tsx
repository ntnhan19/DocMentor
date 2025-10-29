// User document components
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { documentService } from "@/services/document/documentService";

import Button from "@/components/common/Button";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void; // Callback để báo cho trang cha biết upload thành công
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    try {
      await documentService.uploadDocument(selectedFile, selectedFile.name);
      // Upload thành công
      onUploadSuccess();
      handleClose();
    } catch (err) {
      setError("Tải lên thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 z-50">
        <h2 className="text-2xl font-bold mb-4">Tải lên tài liệu mới</h2>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 dark:border-gray-600"}
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Thả file vào đây...</p>
          ) : (
            <p>Kéo và thả file vào đây, hoặc nhấn để chọn file</p>
          )}
          <p className="text-xs text-gray-500 mt-2">Hỗ trợ PDF, DOCX, TXT</p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p>
              Đã chọn:{" "}
              <span className="font-semibold">{selectedFile.name}</span>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={handleClose} variant="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            "Tải lên"
          </Button>
        </div>
      </div>
    </div>
  );
};
