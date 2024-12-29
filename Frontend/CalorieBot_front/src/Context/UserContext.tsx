import React, { createContext, useContext, useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import config from "../config";

interface UserContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  profileAvatar: string | null;
  setProfileAvatar: (image: string | null) => void;
  refreshImages: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!user?.id) return;
    
    try {
      if (profileImage) URL.revokeObjectURL(profileImage);
      if (profileAvatar) URL.revokeObjectURL(profileAvatar);

      const profileResponse = await authenticatedFetch(
        `${config.url}api/profile-picture/${user.id}`,
        { method: "GET" }
      );
      
      if (profileResponse?.ok) {
        const blob = await profileResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfileImage(imageUrl);
      } else {
        setProfileImage(null);
      }

      const avatarResponse = await authenticatedFetch(
        `${config.url}api/profile-picture-avatar/${user.id}`,
        { method: "GET" }
      );
      
      if (avatarResponse?.ok) {
        const blob = await avatarResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfileAvatar(imageUrl);
      } else {
        setProfileAvatar(null);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setProfileImage(null);
      setProfileAvatar(null);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchImages();
    }
  }, [user?.id]);

  useEffect(() => {
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage);
      if (profileAvatar) URL.revokeObjectURL(profileAvatar);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ 
        profileImage, 
        setProfileImage, 
        profileAvatar, 
        setProfileAvatar,
        refreshImages: fetchImages 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
