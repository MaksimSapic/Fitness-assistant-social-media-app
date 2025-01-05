import { useTheme } from "../../Theme/Theme";
import "./settings.css";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { authenticatedFetch } from "../../utils/api";
import config from "../../config";

function Settings() {
  const { theme } = useTheme();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [userInfo, setUserInfo] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    biography: user?.biography || "",
    weight: user?.weight || "",
    height: user?.height || "",
    fat_percentage: user?.fat_percentage || "",
    workout_frequency: user?.workout_frequency || "",
    experience_level: user?.experience_level || "",
    gender: user?.gender || "",
    age: user?.age || "",
  });

  const handleUserInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const abortController = new AbortController();
    try {
      const response = await authenticatedFetch(
        `${config.url}api/update-user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
          signal: abortController.signal,
        }
      );

      if (response?.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error updating user info:", error);
      }
    }
    return () => abortController.abort();
  };

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        <div
          className="screen-element settings-panel"
          style={{ backgroundColor: theme.element, color: theme.text }}
        >
          <h2 style={{ color: theme.text_plain }}>User Information</h2>
          <div className="settings-form">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={userInfo.first_name}
              onChange={handleUserInfoChange}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={userInfo.last_name}
              onChange={handleUserInfoChange}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <Select
              name="gender"
              value={userInfo.gender}
              onChange={handleUserInfoChange}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </Select>
            <input
              type="number"
              name="age"
              placeholder={`Age (${userInfo.age || "13-120"})`}
              value={userInfo.age}
              onChange={handleUserInfoChange}
              min="13"
              max="120"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="number"
              name="weight"
              placeholder={`Weight (${userInfo.weight || "20-300"}) kg`}
              value={userInfo.weight}
              onChange={handleUserInfoChange}
              min="20"
              max="300"
              step="0.1"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="number"
              name="height"
              placeholder={`Height (${userInfo.height || "0.5-3.0"}) m`}
              value={userInfo.height}
              onChange={handleUserInfoChange}
              min="0.5"
              max="3"
              step="0.01"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="number"
              name="fat_percentage"
              placeholder={`Body Fat (${userInfo.fat_percentage || "2-70"})%`}
              value={userInfo.fat_percentage}
              onChange={handleUserInfoChange}
              min="2"
              max="70"
              step="0.1"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="number"
              name="workout_frequency"
              placeholder={`Weekly Workouts (${
                userInfo.workout_frequency || "1-5"
              })`}
              value={userInfo.workout_frequency}
              onChange={handleUserInfoChange}
              min="1"
              max="5"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <input
              type="number"
              name="experience_level"
              placeholder={`Experience Level (${
                userInfo.experience_level || "1-10"
              })`}
              value={userInfo.experience_level}
              onChange={handleUserInfoChange}
              min="1"
              max="10"
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <textarea
              name="biography"
              placeholder="Biography"
              value={userInfo.biography}
              onChange={handleUserInfoChange}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            />
            <button
              className="save-button"
              onClick={handleSaveChanges}
              style={{ backgroundColor: theme.interactable, color: theme.text }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div
          className="screen-element settings-panel"
          style={{ backgroundColor: theme.element, color: theme.text_plain }}
        >
          <h2>Notifications</h2>
          <div className="settings-form">
            <p>Notification settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
