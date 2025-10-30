// src/components/common/Avatar/Avatar.tsx
import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 50,
}) => {
  return (
    <img
      src={src || "/assets/images/default-avatar.png"}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover border border-gray-300 dark:border-gray-600"
    />
  );
};
