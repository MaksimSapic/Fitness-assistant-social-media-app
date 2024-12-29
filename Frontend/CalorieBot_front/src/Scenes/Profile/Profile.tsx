import UserPosts from "../../Components/Posts/UserPosts";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import { user } from "../../Models/user";
import { useTheme } from "../../Theme/Theme";
import "./Profile.css";
function Profile() {
  const { theme, toggleTheme } = useTheme();
  const data = localStorage.getItem("user");
  var userdata: user = data ? JSON.parse(data) : null;
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
        <div className="posts-insights">
          <div
            className="screen-element your-posts"
            style={{
              backgroundColor: theme.element,
            }}
          >
            <h2 style={{ color: theme.text_plain }}>Your posts</h2>
            <UserPosts />
          </div>
          <div
            className="screen-element insights"
            style={{
              backgroundColor: theme.element,
            }}
          >
            <h2 style={{ color: theme.text_plain }}>Insights</h2>
          </div>
        </div>
      </div>
    </>
  );
}
export default Profile;
