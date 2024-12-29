import { Avatar, Menu, MenuItem } from "@mui/material";
import { user } from "../../Models/user";
import { useTheme } from "../../Theme/Theme";
import { useEffect, useRef, useState } from "react";
import config from "../../config";
import { authenticatedFetch, postFetch } from "../../utils/api";
import "./ProfileCard.css";
import { useUserContext } from "../../Context/UserContext";

interface ProfileCardProps {
  user: user;
}

function ProfileCard({ user }: ProfileCardProps) {
  const { theme, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);
  // debug
  // console.log(user);
  const { setProfileImage } = useUserContext();
  const { profileImage } = useUserContext();
  const fetchProfileImage = async () => {
    try {
      const response = await authenticatedFetch(
        `${config.url}api/profile-picture/${user.id}`,
        {
          method: "GET",
        }
      );
      if (response && response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };
  useEffect(() => {
    if (user.profile_picture) {
      fetchProfileImage();
    }
  }, [user.id, user.profile_picture]);

  const StatItem = ({
    label,
    value,
    style,
  }: {
    label: string;
    value: string | number;
    style?: React.CSSProperties;
  }) => (
    <div
      className="stat-item"
      style={{
        backgroundColor: theme.interactable,
        color: theme.text,
        ...style,
      }}
    >
      <span className="stat-label" style={{ color: theme.text }}>
        {label}
      </span>
      <span className="stat-value" style={{ color: theme.text }}>
        {value}
      </span>
    </div>
  );

  const handleChangePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);

      try {
        const response = await postFetch(`${config.url}api/profile-picture/`, {
          method: "POST",
          body: formData,
        });

        if (response?.ok) {
          fetchProfileImage();
          const imageUrl = URL.createObjectURL(file);
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  const handleRemovePicture = async () => {
    try {
      const response = await authenticatedFetch(
        `${config.url}api/profile-picture-delete/${user.id}/`,
        { method: "DELETE" }
      );
      if (response?.ok) {
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Error deleting picture: ", error);
    }
  };

  return (
    <div
      className="profile-card"
      style={{ display: "flex", padding: "20px", gap: "20px" }}
    >
      <div
        className="profile-left"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          width: "200px",
        }}
      >
        {profileImage ? (
          <img
            className="profile-image"
            src={profileImage}
            alt="Profile"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          />
        ) : (
          <Avatar
            className="profile-image"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          />
        )}
        <div
          className="profile-name"
          style={{
            color: theme.text_plain,
            fontSize: "calc(1rem + 0.5vw)",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {user.first_name + " " + user.last_name}
        </div>
        <div
          className="profile-username"
          style={{
            color: theme.text_plain,
            fontSize: "calc(0.8rem + 0.3vw)",
          }}
        >
          @{user.username}
        </div>
      </div>

      <div
        className="profile-middle"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="info-item" style={{ color: theme.text_plain }}>
          <h3>E-mail address</h3>
          <h4>{user.email}</h4>
        </div>
        <div className="info-item" style={{ color: theme.text_plain }}>
          <h3>Following: {user.following_count?.toString() || "0"}</h3>
        </div>
        <div className="info-item" style={{ color: theme.text_plain }}>
          <h3>Followers: {user.followers_count?.toString() || "0"}</h3>
        </div>
        <div className="info-item" style={{ color: theme.text_plain }}>
          <h3>Biography</h3>
          <div>
            <h4>{user.biography || "No biography yet"}</h4>
          </div>
        </div>
      </div>
      <div
        className="profile-right"
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            color: theme.text_plain,
            fontWeight: "bold",
          }}
        >
          <h3>Summary</h3>
        </div>
        <div
          className="stats-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Weight"
            value={`${user.weight} kg`}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Height"
            value={`${user.height} m`}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Age"
            value={user.age.toString()}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="BMI"
            value={user.bmi.toFixed(1)}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Body Fat"
            value={`${user.fat_percentage}%`}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Experience"
            value={`${user.experience_level}/10`}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Weekly"
            value={user.workout_frequency.toString()}
          />
          <StatItem
            style={{ transition: "0.5s ease" }}
            label="Posts"
            value={user.posts_count.toString()}
          />
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              bgcolor: theme.element,
              "& .MuiMenuItem-root": {
                color: theme.text_plain,
              },
            },
          },
        }}
      >
        <MenuItem
          disabled={!!profileImage}
          onClick={() => {
            imageRef.current?.click();
            setAnchorEl(null);
          }}
        >
          Add Picture
        </MenuItem>
        <MenuItem
          disabled={!profileImage}
          onClick={() => {
            imageRef.current?.click();
            setAnchorEl(null);
          }}
        >
          Change Picture
        </MenuItem>
        <MenuItem
          disabled={!profileImage}
          onClick={() => {
            handleRemovePicture();
            setAnchorEl(null);
          }}
        >
          Remove Picture
        </MenuItem>
      </Menu>
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/jpg"
        ref={imageRef}
        onChange={handleChangePicture}
      />
    </div>
  );
}

export default ProfileCard;
