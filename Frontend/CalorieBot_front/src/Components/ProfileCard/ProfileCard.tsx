import { Avatar } from "@mui/material";
import { user } from "../../Models/user";
import { useTheme } from "../../Theme/Theme";

interface ProfileCardProps {
  user: user;
}

function ProfileCard({ user }: ProfileCardProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="card">
        {user.profile_picture != "" ? (
          <img className="img" src={user.profile_picture}></img>
        ) : (
          <Avatar />
        )}
        <label htmlFor="img">{user.first_name + " " + user.last_name}</label>
      </div>
    </>
  );
}

export default ProfileCard;
