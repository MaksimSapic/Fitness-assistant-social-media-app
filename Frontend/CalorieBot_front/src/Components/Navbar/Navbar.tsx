import { useTheme } from "../../Theme/Theme";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { darkTheme, lightTheme } from "../../Theme/themeType";
import {
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [selected, setSelected] = useState("Home");

  const data = localStorage.getItem("user");
  const user = data ? JSON.parse(data) : null;
  const username = user ? user["first_name"] + " " + user["last_name"] : "";
  //mock data
  const notifications = [
    "make the login page",
    "backend is waiting",
    "jel sapunjas macora?",
  ];
  // states for dropdowns
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const isOpen = (menuId: string) => openMenu === menuId;
  const handleClick =
    (menuId: string) => (event: React.MouseEvent<HTMLElement>) => {
      // event.stopPropagation();
      if (openMenu && openMenu !== menuId) {
        setOpenMenu(null);
        setAnchorEl(null);
      }
      setOpenMenu(menuId);
      setAnchorEl(event.currentTarget);
    };
  const handleClose = () => {
    setOpenMenu(null);
    setAnchorEl(null);
  };
  //

  //notifications icon
  const notifs = (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        onClick={(event) => handleClick("notifications-menu")(event)}
      >
        <Tooltip title="notifications">
          <NotificationsNoneIcon
            style={{
              // backgroundColor: theme.background,
              borderRadius: 90,
              transition: "0.5s ease-in",
              color: theme.icon,
            }}
            aria-controls={open ? "notifications-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          />
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="notifications-menu"
        open={isOpen("notifications-menu")}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 2.5,
              mr: -1,
              bgcolor: theme.element,
              minWidth: "calc(200px + 10vw)",
              maxWidth: "calc(300px + 15vw)",
              "& .MuiMenuItem-root": {
                color: theme.text,
                fontSize: "calc(0.9rem + 0.2vw)",
                padding: "calc(8px + 0.5vh) calc(15px + 0.5vw)",
              },
              "& .MuiAvatar-root": {
                width: "calc(32px + 1vw)",
                height: "calc(32px + 1vw)",
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: "calc(10px + 0.3vw)",
                height: "calc(10px + 0.3vw)",
                bgcolor: theme.element,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disablePortal
        keepMounted
      >
        {notifications.map((notif, index) => (
          <MenuItem
            key={index.toString()}
            onClick={handleClose}
            style={{
              color: theme.text_plain,
            }}
          >
            {notif}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  //profile icon
  const profile = (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        onClick={(event) => handleClick("profile-menu")(event)}
      >
        <Tooltip title={username}>
          <PersonOutlineIcon
            style={{
              // backgroundColor: theme.background,
              borderRadius: 90,
              transition: "0.5s ease-in",
              color: theme.icon,
            }}
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          />
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={isOpen("profile-menu")}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 2.5,
              mr: -1,
              bgcolor: theme.element,
              minWidth: "calc(200px + 10vw)",
              maxWidth: "calc(300px + 15vw)",
              "& .MuiMenuItem-root": {
                color: theme.text,
                fontSize: "calc(0.9rem + 0.2vw)",
                padding: "calc(8px + 0.5vh) calc(15px + 0.5vw)",
              },
              "& .MuiAvatar-root": {
                width: "calc(32px + 1vw)",
                height: "calc(32px + 1vw)",
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: "calc(10px + 0.3vw)",
                height: "calc(10px + 0.3vw)",
                bgcolor: theme.element,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disablePortal
        keepMounted
      >
        <MenuItem onClick={handleClose}>
          <Avatar />
          <Link
            style={{ color: theme.text_plain }}
            className="menu-link 1"
            to="/profile"
            onClick={() => {
              setSelected("profile");
            }}
          >
            My profile
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" style={{ color: theme.icon }} />
          </ListItemIcon>
          <Link
            className="menu-link"
            style={{
              color: theme.text_plain,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
            to="/settings"
            onClick={() => {
              setSelected("settings");
            }}
          >
            Settings
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" style={{ color: theme.icon }} />
          </ListItemIcon>
          <Link
            className="menu-link"
            style={{
              color: theme.text_plain,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
            to="/login"
            onClick={() => {
              localStorage.removeItem("user");
            }}
          >
            Logout
          </Link>
        </MenuItem>
      </Menu>
    </>
  );

  // NAVBAR CODE
  return (
    <>
      <nav
        style={{
          backgroundColor: theme.element,
          color: theme.text_plain,
        }}
      >
        <h2
          className="nav-left"
          style={{ color: theme.text_plain, transition: "0.5s ease-in" }}
        >
          CalorieBot
        </h2>
        <div className="nav-right">
          <div className="options-buttons">
            <Tooltip title="Home">
              <Link
                className="nav-link"
                style={{
                  color: theme.text_plain,
                  border:
                    selected == "Home"
                      ? "2px solid " + theme.border
                      : theme.element,
                }}
                onClick={() => {
                  setSelected("Home");
                }}
                to="/"
              >
                Home
              </Link>
            </Tooltip>
            <Tooltip title="News">
              <Link
                className="nav-link"
                style={{
                  color: theme.text_plain,
                  border:
                    selected == "News"
                      ? "2px solid " + theme.border
                      : theme.element,
                }}
                onClick={() => {
                  setSelected("News");
                }}
                to="/news"
              >
                News
              </Link>
            </Tooltip>
          </div>
          {/* for now just icons for show, will soon be individual components */}

          <div className="options-icons">
            <Tooltip title="toggle theme">
              {theme == lightTheme ? (
                <DarkModeIcon
                  style={{
                    borderRadius: 90,
                    transition: "0.5s ease-in",
                    color: theme.icon,
                  }}
                  onClick={toggleTheme}
                ></DarkModeIcon>
              ) : (
                <LightModeIcon
                  style={{
                    borderRadius: 90,
                    transition: "0.5s ease-in",
                    color: theme.icon,
                  }}
                  onClick={toggleTheme}
                ></LightModeIcon>
              )}
            </Tooltip>
            {notifs}
            {profile}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
