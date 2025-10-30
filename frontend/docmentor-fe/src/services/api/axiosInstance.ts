// Axios instance setup
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Lấy URL từ file .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Bạn có thể thêm các interceptors ở đây sau này
// Ví dụ: Tự động đính kèm token xác thực vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Giả sử bạn lưu token ở localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
