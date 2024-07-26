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
import CoinIcon from "../../../assets/coins-logo.svg";
import LifeLineIcons from "../../../assets/lifeline.svg";
import { Link } from "react-router-dom";
import { DrawerHeader, AppBar, Drawer } from "../../admin-components/index";
import { RoutePaths } from "../../../utils/enum";
import jwtDecoder from "../../../services/jwtDecoder";
import { bindActionCreators } from "redux";
import { userActions } from "../../../redux/action-creators";
import { useDispatch } from "react-redux";
import { ROUTES } from "../../../constants/Routes";

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
    }ProfilePhoto/${username}/${username}.jpg?t=${new Date().getTime()}`;
    console.log(imgPath);
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

          <Link to="/admin-dashboard">
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
         <p className={`${classes["username"]} fs-5 mt-3 fw-semibold d-sm-inline d-none`}> 
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
              <Avatar src={fullImagePath} /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={logoutHandler}>
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

export default AdminSlider;
