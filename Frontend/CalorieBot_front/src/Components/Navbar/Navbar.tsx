import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useTheme } from "../../Theme/Theme";
import { darkTheme, lightTheme } from "../../Theme/themeType";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState("Home");

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
            <Link
              className="nav-link"
              style={{
                color: theme.text,
                backgroundColor:
                  selected == "Home" ? theme.background : theme.element,
              }}
              onClick={() => {
                setSelected("Home");
              }}
              to="/"
              key="Home"
            >
              Home
            </Link>
            <Link
              className="nav-link"
              style={{
                color: theme.text,
                backgroundColor:
                  selected == "News" ? theme.background : theme.element,
              }}
              onClick={() => {
                setSelected("News");
              }}
              to="/news"
            >
              News
            </Link>
          </div>
          {/* for now just icons for show, will soon be individual components */}

          <div className="options-icons">
            <BedtimeIcon
              style={{
                backgroundColor: theme.background,
                borderRadius: 90,
              }}
              onClick={toggleTheme}
            ></BedtimeIcon>
            <NotificationsNoneIcon
              style={{
                backgroundColor: theme.background,
                borderRadius: 90,
              }}
            ></NotificationsNoneIcon>
            <PersonOutlineIcon
              style={{
                backgroundColor: theme.background,
                borderRadius: 90,
              }}
            ></PersonOutlineIcon>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
