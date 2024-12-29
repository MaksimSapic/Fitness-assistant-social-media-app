import React, { createContext, useContext, useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/api";
import config from "../config";

interface UserContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  profileAvatar: string | null;
  setProfileAvatar: (image: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const fetchProfileImage = async () => {
    try {
      const response = await authenticatedFetch(
        `${config.url}api/profile-picture-avatar/${user.id}`,
        {
          method: "GET",
        }
      );
      if (response && response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfileAvatar(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };
  useEffect(() => {
    fetchProfileImage();
  }, []);
  return (
    <UserContext.Provider
      value={{ profileImage, setProfileImage, profileAvatar, setProfileAvatar }}
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
