// Document types
export interface Document {
  id: string;
  title: string;
  type: "pdf" | "docx" | "txt" | "pptx"; // Các loại file hỗ trợ

  uploadDate: string; // Sử dụng ISO string format (e.g., "2025-10-23T14:00:00.000Z")
  fileSize: number; // Kích thước file tính bằng bytes
  summary: string;
  thumbnailUrl?: string; // URL ảnh thumbnail (tùy chọn)
}
