import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { adminDashboardSections } from "../../../utils/dummyData";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import classes from "./style.module.css";
import Logo from "../../../assets/NewQuizLogo.svg";
import {
  Avatar,
  Badge,
  Collapse,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Logout,
  PersonAdd,
  Settings,
  StarBorder,
} from "@mui/icons-material";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { DrawerHeader, AppBar, Drawer } from "../../admin-components/index";
import { RoutePaths } from "../../../utils/enum";
import jwtDecoder from "../../../services/jwtDecoder";

const QuizHeader = ({ firstName, lastName, uploadCount, userName }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullImagePath, setFullImagePath] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  var username = "";
  const data = jwtDecoder();
  username = data["Username"];

  useEffect(() => {
    setFullImagePath(
      `${
        import.meta.env.VITE_PUBLIC_URL
      }ProfilePhoto/${userName}/${userName}.jpg?${uploadCount}`
    );
  }, [uploadCount]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [openIndex, setOpenIndex] = React.useState(null);
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };
  const clickOnProfile = () => {
    navigate(RoutePaths.MyProfile);
    setAnchorEl(null);
  };
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          className: classes["header"],
          backgroundColor: "#6F41DB",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Link to="/">
              <img className={classes["logo-image"]} src={Logo} height={70} />
        </Link>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginRight: "1rem",
          }}
        >
          <IconButton
            className="gap-2 rounded d-flex align-items-center"
            onClick={handleAvatarClick}
          >
            <p className={`${classes["username"]} fs-5 mt-3 px-3 fw-semibold d-sm-inline d-none`}> 
              {username}
            </p>
            <Avatar
              sx={{ background: "#3d3189", color: "#fada65", cursor: "pointer" }}
              src={fullImagePath}
            ></Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleAvatarClose}
            onClick={handleAvatarClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
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
                  right: 32,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={clickOnProfile}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleAvatarClose}>
              <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleAvatarClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleAvatarClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleAvatarClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </AppBar>
    </>
  );
};

export default QuizHeader;
