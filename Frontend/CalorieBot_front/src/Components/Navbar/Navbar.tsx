import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useTheme } from "../../Theme/Theme";
import { darkTheme, lightTheme } from "../../Theme/themeType";
import "./Navbar.css";
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <nav
        style={{
          backgroundColor: theme.element,
          color: theme.text,
        }}
      >
        <p className="nav-left">CalorieBot</p>
        <div className="nav-right">
          <div className="options-buttons">
            <button
              className="button"
              style={{
                backgroundColor: theme.interactable,
              }}
            >
              Home
            </button>
            <button
              className="button"
              style={{
                backgroundColor: theme.interactable,
              }}
            >
              News
            </button>
          </div>
          {/* for now just icons for show, will soon be individual components */}
          <div className="options-icons">
            <NotificationsNoneIcon></NotificationsNoneIcon>
            <BedtimeIcon onClick={toggleTheme}></BedtimeIcon>
            <PersonOutlineIcon></PersonOutlineIcon>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
