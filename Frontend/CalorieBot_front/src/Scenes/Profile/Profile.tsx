import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import { user } from "../../Models/user";
import { useTheme } from "../../Theme/Theme";
import "./Profile.css";
function Profile() {
  const { theme, toggleTheme } = useTheme();
  const data = localStorage.getItem("user");
  var userdata: user = data ? JSON.parse(data) : null;
  console.log(userdata);
  return (
    <>
      <div className="wrap">
        <div
          className="screen-element profile"
          style={{
            backgroundColor: theme.element,
            color: theme.text_plain,
          }}
        >
          <ProfileCard user={userdata} />
        </div>
        <div
          className="screen-element my-posts"
          style={{
            backgroundColor: theme.element,
          }}
        ></div>
      </div>
    </>
  );
}
export default Profile;
