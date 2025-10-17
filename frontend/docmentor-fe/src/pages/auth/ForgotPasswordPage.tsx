// Forgot Password Page
// src/features/auth/components/ForgotPassword.tsx
import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  error?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    onSubmit(email);
    setIsSubmitted(true);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError("");
  };

  if (isSubmitted && !error) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Check your email
          </h3>
          <p className="text-gray-600">We've sent a password reset link to</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-2.5 text-blue-600 hover:text-blue-700 font-medium"
          >
            Try another email
          </button>

          <a
            href="/login"
            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
              emailError
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="your@email.com"
            disabled={isLoading}
          />
        </div>
        {emailError && <p className="text-sm text-red-600">{emailError}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Reset Link</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <a
        href="/login"
        className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to login</span>
      </a>
    </form>
  );
};

export default ForgotPassword;
