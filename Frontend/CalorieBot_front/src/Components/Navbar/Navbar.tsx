import BedtimeIcon from "@mui/icons-material/Bedtime";
import { useTheme } from "../../Theme/Theme";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Fragment, useState } from "react";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
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
import { ThemeContext } from "@emotion/react";

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
        onClick={(event) => handleClick("account-menu")(event)}
      >
        <Tooltip title="notifications">
          <NotificationsNoneIcon
            style={{
              backgroundColor: theme.background,
              borderRadius: 90,
              transition: "0.5s ease-in",
              color: theme.icon,
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          />
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isOpen("account-menu")}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              bgcolor: theme.background,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.background,
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
          <MenuItem key={index.toString()} onClick={handleClose}>
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
        onClick={(event) => handleClick("notifications-menu")(event)}
      >
        <Tooltip title={username}>
          <PersonOutlineIcon
            style={{
              backgroundColor: theme.background,
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
              mt: 1.5,
              bgcolor: theme.background,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.background,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        disablePortal
        keepMounted
      >
        <MenuItem onClick={handleClose}>
          <Avatar />
          <Link
            style={{ color: theme.text }}
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
          <Link
            className="menu-link"
            style={{ color: theme.text }}
            to="/settings"
            onClick={() => {
              setSelected("settings");
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            className="menu-link"
            style={{ color: theme.text }}
            to="/login"
            onClick={() => {
              // setSelected("logout");
              localStorage.removeItem("user");
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
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
            <Tooltip title="toggle theme">
              <BedtimeIcon
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 90,
                  transition: "0.5s ease-in",
                  color: theme.icon,
                }}
                onClick={toggleTheme}
              ></BedtimeIcon>
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
