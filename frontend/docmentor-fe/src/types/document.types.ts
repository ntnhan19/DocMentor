// src/types/document.types.ts

export interface Document {
  id: string | number; // ✨ Accept both string and number from API
  title: string;
  type: string; // pdf, docx, txt, pptx, etc.
  fileSize: number; // bytes
  uploadDate: string; // ISO datetime
  status: "ready" | "processing" | "failed";

  // Optional fields from API
  file_path?: string;
  processed?: boolean;
  metadata?: Record<string, any>;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentFilter {
  type?: string;
  sortBy?: "date_desc" | "date_asc" | "title_asc" | "size_asc" | "size_desc";
}

export interface DocumentStats {
  total_documents: number;
  total_size: number;
  by_type: Record<string, number>;
  processed_count: number;
  unprocessed_count: number;
}
