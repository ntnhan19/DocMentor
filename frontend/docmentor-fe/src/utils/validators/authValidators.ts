// Auth validators
// src/features/auth/utils/authValidators.ts

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true };
};

// Full name validation
export const validateFullName = (fullName: string): ValidationResult => {
  if (!fullName) {
    return { isValid: false, message: "Full name is required" };
  }

  if (fullName.trim().length < 2) {
    return {
      isValid: false,
      message: "Full name must be at least 2 characters",
    };
  }

  return { isValid: true };
};

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: "Username must be at least 3 characters",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { isValid: true };
};

// Login form validation
export const validateLoginForm = (email: string, password: string) => {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message || "";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Register form validation
export const validateRegisterForm = (data: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}) => {
  const errors: Record<string, string> = {};

  const fullNameValidation = validateFullName(data.fullName);
  if (!fullNameValidation.isValid) {
    errors.fullName = fullNameValidation.message || "";
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message || "";
  }

  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message || "";
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message || "";
  }

  const confirmPasswordValidation = validateConfirmPassword(
    data.password,
    data.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message || "";
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and conditions";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
