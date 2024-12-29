import { Avatar } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import "./ProfileCardMini.css";
import { useTheme } from "../../Theme/Theme";
import { useState } from "react";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";

interface UserProps {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    bio: string;
    profile_picture_avatar: string;
    profile_picture_type: string;
    is_following?: boolean;
  };
}

function ProfileCardMini(data: UserProps) {
  const { theme } = useTheme();
  const [isFollowing, setIsFollowing] = useState(
    data.user.is_following || false
  );
  const userdata = localStorage.getItem("user");
  const currentUser = userdata ? JSON.parse(userdata) : null;

  const handleFollow = async () => {
    try {
      const response = await authenticatedFetch(
        `${config.url}api/${isFollowing ? "unfollow" : "follow"}/${
          data.user.id
        }/`,
        { method: "POST" }
      );

      if (response?.ok) {
        const result = await response.json();
        setIsFollowing(!isFollowing);

        if (currentUser) {
          currentUser.following_count = result.following_count;
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      <div
        className="profile-card"
        style={{ backgroundColor: theme.background, color: theme.text_plain }}
      >
        <div className="pfp">
          {data.user.profile_picture_avatar ? (
            <img
              src={`data:${data.user.profile_picture_type};base64,${data.user.profile_picture_avatar}`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              alt="Profile"
            />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }} />
          )}
        </div>
        <div className="username-bio">
          <h4>
            {data.user.firstName + " " + data.user.lastName}{" "}
            <small style={{ fontWeight: 50 }}>@{data.user.username}</small>
          </h4>
          <small>
            {data.user.bio
              ? data.user.bio.length > 100
                ? "asdfg"
                : data.user.bio
              : "someone you might know"}
          </small>
        </div>
        <div className="follow" onClick={handleFollow}>
          {isFollowing ? <PersonAddAlt1Icon /> : <PersonAddAltIcon />}
        </div>
      </div>
    </>
  );
}

export default ProfileCardMini;
