/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bảng màu mới dựa trên theme trong ảnh
        background: "#100D20", // Màu nền chính (tím than đậm)
        accent: "#1A162D", // Màu nền phụ cho card, input...
        primary: "#8A42FF", // Màu nhấn chính (tím)
        secondary: "#00D4FF", // Màu nhấn phụ (xanh cyan)
        "text-muted": "#A9A5B8", // Màu chữ phụ (xám nhạt)
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "scale-up": "scaleUp 0.4s ease-out",
        "bounce-slow": "bounce 2s infinite",
        // Thêm hiệu ứng float mới
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // Keyframe cho hiệu ứng float
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
