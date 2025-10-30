import React, { TextareaHTMLAttributes } from "react";

// Tương tự InputProps, nhưng dành cho thẻ <textarea>
export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"; // Thêm resize-y để cho phép thay đổi chiều cao
  const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}

      <textarea
        className={`${baseClasses} ${error ? errorClasses : ""} ${className}`}
        rows={4} // Chiều cao mặc định là 4 dòng
        {...props}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default TextArea;
