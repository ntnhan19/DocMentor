// User document components
import React from "react";
import Input from "../../../../components/common/Input/Input"; // Giả sử bạn có component Input chung

interface DocumentSearchProps {
  onSearch: (query: string) => void;
}

export const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch }) => {
  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder="Tìm kiếm tài liệu theo tên..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch(e.target.value)
        }
        className="w-full"
      />
    </div>
  );
};
