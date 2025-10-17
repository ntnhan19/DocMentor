// 404 Not Found Page
// src/pages/public/NotFoundPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
