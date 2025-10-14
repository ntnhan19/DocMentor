// Reset Password Page
// src/features/auth/components/ResetPassword.tsx
import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

interface ResetPasswordProps {
  token: string;
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  isLoading?: boolean;
  error?: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  //token,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== formData.newPassword)
      return "Passwords do not match";
    return "";
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData.newPassword, formData.confirmPassword);
    setIsSuccess(true);
  };

  // ✅ Hiển thị giao diện thành công
  if (isSuccess && !error) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Password Reset Successful!
        </h2>
        <p className="text-gray-600">
          Your password has been updated successfully. You can now log in with
          your new password.
        </p>
        <a
          href="/login"
          className="inline-block mt-4 px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        Reset Your Password
      </h2>

      {error && (
        <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        <Lock size={18} />
        {isLoading ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
