import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/user.types";
import { userService } from "@/services/user/userService";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setUser(profileData);
        setEditedName(profileData.fullName);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({
        fullName: editedName,
      });
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  if (isLoading && !user) {
    return <div className="p-6">Đang tải hồ sơ...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        )}
      </div>

      {user && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <hr className="my-4 dark:border-gray-600" />

          {isEditing ? (
            // Chế độ Chỉnh sửa
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block mb-2 font-medium">
                  Họ và tên
                </label>
                <Input
                  id="fullName"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          ) : (
            // Chế độ Xem
            <div>
              <p>
                <strong>Ngày tham gia:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
