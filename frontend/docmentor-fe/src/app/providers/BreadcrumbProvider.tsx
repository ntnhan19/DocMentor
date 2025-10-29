import React, { createContext, useState, useContext, ReactNode } from "react";

// Định nghĩa hình dạng của một item trong breadcrumb (một mẩu bánh mì)
export interface BreadcrumbItem {
  label: string;
  path: string;
}

// Định nghĩa những gì "bảng thông báo" sẽ chứa:
// 1. Danh sách các item (items)
// 2. Một hàm để thay đổi danh sách đó (setItems)
interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
}

// 1. TẠO RA BẢNG THÔNG BÁO (CONTEXT)
// Lúc đầu nó chưa có gì cả (undefined).
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

// 2. TẠO COMPONENT ĐỂ "TREO BẢNG THÔNG BÁO" LÊN
// Component này sẽ bao bọc toàn bộ layout của bạn.
// Nó chịu trách nhiệm tạo ra và quản lý "trí nhớ" (state) cho breadcrumb.
export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  // Nó cung cấp "items" và "setItems" cho tất cả các component con bên trong nó.
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// 3. TẠO MỘT LỐI TẮT TIỆN LỢI (CUSTOM HOOK)
// Thay vì các trang con phải làm nhiều bước phức tạp để truy cập "bảng thông báo",
// chúng chỉ cần gọi hook `useBreadcrumbs()` này là có thể đọc và ghi ngay lập tức.
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    // Lỗi này sẽ xảy ra nếu bạn quên bao bọc layout bằng <BreadcrumbProvider>
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};
