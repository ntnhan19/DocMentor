import { Document } from "@/types/document.types";

// Dữ liệu giả lập
const mockDocuments: Document[] = [
  {
    id: "doc-001",
    title: "Giáo trình Quản lý dự án CNTT",
    type: "pdf",

    uploadDate: "2025-10-20T10:00:00.000Z",
    fileSize: 5242880,
    summary:
      "Tài liệu cơ bản về các phương pháp quản lý dự án phần mềm hiện đại...",
  },
  {
    id: "doc-002",
    title: "Phân tích và Thiết kế hệ thống",
    type: "docx",

    uploadDate: "2025-10-18T15:30:00.000Z",
    fileSize: 2097152,
    summary:
      "Hướng dẫn chi tiết về UML, use cases và thiết kế kiến trúc hệ thống.",
  },
  {
    id: "doc-003",
    title: "Slide bài giảng Flutter nâng cao",
    type: "pptx",

    uploadDate: "2025-10-15T09:00:00.000Z",
    fileSize: 10485760,
    summary:
      "Các chủ đề nâng cao trong Flutter: State Management, Animation...",
  },
];

interface GetDocumentsParams {
  page?: number;
  limit?: number;
  query?: string;
}
// ✅ BƯỚC 1: Tạo một hàm helper để xác định loại file từ tên
const getFileTypeFromExtension = (filename: string): Document["type"] => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "pdf";
    case "docx":
      return "docx";
    case "pptx":
      return "pptx";
    case "txt":
      return "txt";
    default:
      return "txt"; // Mặc định là file text nếu không nhận diện được
  }
};

export const documentService = {
  getDocuments: async ({
    page = 1,
    limit = 10,
    query = "",
  }: GetDocumentsParams): Promise<{ data: Document[]; total: number }> => {
    console.log(`(MOCK) Fetching documents with query: "${query}"`);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredDocuments = [...mockDocuments];

    if (query) {
      filteredDocuments = filteredDocuments.filter((doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    const total = filteredDocuments.length;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredDocuments.slice(start, end),
      total: total,
    };
  },

  getDocumentById: async (id: string): Promise<Document | null> => {
    console.log(`(MOCK) Fetching document with id: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const document = mockDocuments.find((doc) => doc.id === id);
    return document || null;
  },

  uploadDocument: async (file: File, title?: string): Promise<any> => {
    console.log(`(MOCK) Uploading file: ${file.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Lấy loại file từ tên file thật
    const fileType = getFileTypeFromExtension(file.name);
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: title || file.name,
      type: fileType, // <-- Gán loại file đã nhận diện được
      uploadDate: new Date().toISOString(),
      fileSize: file.size,
      summary: "Tài liệu vừa được tải lên.",
    };
    mockDocuments.unshift(newDoc);

    return { message: "Document uploaded successfully (mock)" };
  },
  deleteDocument: async (id: string): Promise<void> => {
    console.log(`(MOCK) Deleting document with id: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập độ trễ mạng

    const index = mockDocuments.findIndex((doc) => doc.id === id);
    if (index > -1) {
      mockDocuments.splice(index, 1); // Xóa 1 phần tử tại vị trí tìm thấy
    } else {
      console.warn(`(MOCK) Document with id ${id} not found for deletion.`);
    }
  },
};
