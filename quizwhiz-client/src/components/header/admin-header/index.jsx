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
import { bindActionCreators } from "redux";
import { userActions } from "../../../redux/action-creators";
import { useDispatch } from "react-redux";

const AdminSlider = ({ firstName, lastName, uploadCount, userName }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullImagePath, setFullImagePath] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  var username = "";
  const data = jwtDecoder();
  username = data["Username"];
  const dispatch = useDispatch();
  const storedImageUrl = localStorage.getItem("profilePhotoUrl");

  useEffect(() => {
    const imgPath = `${
      import.meta.env.VITE_PUBLIC_URL
    }/ProfilePhoto/${username}/${username}.jpg`;
    setFullImagePath(imgPath);
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
  const logoutHandler = () => {
    const actions = bindActionCreators(userActions, dispatch);
    {
      actions.changeUserRole("");
      actions.changeUserName("");
      actions.changeUserEmail("");
    }

    localStorage.removeItem("token");
    navigate(RoutePaths.Login);
  };
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          background: "#6F41DB",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
        className={`${classes["nav-color"]}`}
      >
        <Toolbar>
          <Link to="/">
            <img className={classes["logo-image"]} src={Logo} height={70} />
          </Link>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginRight: "1rem",
          }}
        >
          
            <p className="fs-5 mt-3 fw-semibold d-sm-inline d-none text-white">
              {username} 
            </p>
            <IconButton
              className="gap-2 rounded d-flex align-items-center"
              onClick={handleAvatarClick}
            >
            <Avatar
              sx={{ background: "#5f071c", cursor: "pointer" }}
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
            <MenuItem onClick={logoutHandler}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </AppBar>
      {/* <Drawer variant="permanent" open={open} sx={{ background: "#3D3189" }}>
        <Paper sx={{ background: "#3D3189", height: "100vh" }}>
          <DrawerHeader
            sx={{
              background: "#3D3189",
              paddingY: "2rem",
              display: "flex",
              justifyContent: "space-between",
              marginX: "0.3rem",
            }}
          >
            <Box sx={{ margin: "auto" }}>
              <Link to="/">
                <img
                  className={`mx-auto ${classes["logo-image"]} `}
                  src={Logo}
                  height={70}
                />
              </Link>
            </Box>
            <IconButton
              sx={{ background: "#3D3189" }}
              onClick={handleDrawerClose}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon sx={{ color: "#fffff" }} />
              ) : (
                <ChevronLeftIcon sx={{ color: "#fffff" }} />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ background: "#3D3189" }} />
          <List sx={{ background: "#3D3189" }}>
            {adminDashboardSections.map((text, index) => (
              <ListItem
                key={text.title}
                disablePadding
                sx={{ display: "block", color: "#a89ee9" }}
              >
                <ListItemButton
                  onClick={() => handleClick(index)}
                  sx={{
                    borderRadius: "10px",
                    background:
                      openIndex === index || text == "Quiz Management"
                        ? "#3D3189"
                        : "inherit",
                    "&:hover": {
                      background: openIndex === index ? "#000000" : "#f5f5f5",
                      color: openIndex === index ? "#000000" : "inherit",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ display: open ? "none" : "block", color: "#fada65" }}
                  >
                    {text.icon}
                  </ListItemIcon>
                  <ListItemText
                    variant="h4"
                    primary={text.title}
                    sx={{ color: "#fada65" }}
                  />
                </ListItemButton>
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: "#fada65" }}>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText
                        primary="Starred"
                        sx={{ color: "#fada65" }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Drawer> */}
    </>
  );
};

export default AdminSlider;
