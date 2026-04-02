// frontend/docmentor-fe/src/features/auth/components/GoogleOAuthButton.tsx
import React, { useEffect, useRef } from "react";

interface GoogleOAuthButtonProps {
  onSuccess: (credential: string) => void;
  onError: (message: string) => void;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  // Lưu trữ callback vào ref để initializeGoogle luôn dùng bản mới nhất
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);

  useEffect(() => {
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId.trim() === "") {
      console.error("❌ Google Client ID not configured");
      errorRef.current("Google Client ID chưa được cấu hình");
      return;
    }

    const initializeGoogle = () => {
      if (!window.google) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              successRef.current(response.credential);
            } else {
              errorRef.current("Đăng nhập thất bại, không nhận được token.");
            }
          },
          auto_select: false,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text: "continue_with",
              logo_alignment: "left",
              width: "400",
            } as any
          );
        }
      } catch (error: any) {
        errorRef.current(error.message || "Lỗi khởi tạo Google Sign-In");
      }
    };

    const scriptId = "google-client-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      initializeGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => errorRef.current("Không thể tải Google script");
      document.body.appendChild(script);
    }
  }, []);

  // Container để Google inject iframe nút bấm vào
  return (
    <div
      ref={buttonRef}
      className="w-full flex justify-center min-h-[40px]"
      style={{ width: "100%" }} // Force container width
    />
  );
};

export default GoogleOAuthButton;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          // Thêm định nghĩa cho renderButton
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              shape?: "rectangular" | "pill" | "circle" | "square";
              text?: "signin_with" | "signup_with" | "continue_with";
              logo_alignment?: "left" | "center";
              width?: string;
            }
          ) => void;
        };
      };
    };
  }
}