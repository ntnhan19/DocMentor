// Hook: useDebounce
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt một timeout để cập nhật giá trị sau một khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy timeout nếu value thay đổi (tránh thực thi timeout cũ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
