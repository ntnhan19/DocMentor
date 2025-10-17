// src/features/auth/components/RegisterForm.tsx
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AtSign } from "lucide-react";

interface RegisterFormProps {
  onSubmit: (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateFullName = (name: string): string => {
    if (!name) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateUsername = (username: string): string => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return "";
  };

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
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    const newErrors = { ...errors };
    let errorMsg = "";

    switch (field) {
      case "fullName":
        errorMsg = validateFullName(formData.fullName);
        break;
      case "email":
        errorMsg = validateEmail(formData.email);
        break;
      case "username":
        errorMsg = validateUsername(formData.username);
        break;
      case "password":
        errorMsg = validatePassword(formData.password);
        break;
      case "confirmPassword":
        errorMsg = validateConfirmPassword(formData.confirmPassword);
        break;
    }

    if (errorMsg) newErrors[field] = errorMsg;
    else delete newErrors[field];

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        username: true,
        password: true,
        confirmPassword: true,
        agreeToTerms: true,
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Server Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.fullName && errors.fullName
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
        {touched.fullName && errors.fullName && (
          <p className="text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.email && errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="john@example.com"
            disabled={isLoading}
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            onBlur={() => handleBlur("username")}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.username && errors.username
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="johndoe123"
            disabled={isLoading}
          />
        </div>
        {touched.username && errors.username && (
          <p className="text-xs text-red-600">{errors.username}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.password && errors.password
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              touched.confirmPassword && errors.confirmPassword
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="space-y-1.5">
        <label className="flex items-start space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
            className="w-4 h-4 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {touched.agreeToTerms && errors.agreeToTerms && (
          <p className="text-xs text-red-600">{errors.agreeToTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating account...</span>
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
