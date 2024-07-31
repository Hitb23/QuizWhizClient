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
import CoinIcon from "../../../assets/coins-logo.svg";
import LifeLineIcons from "../../../assets/lifeline.svg";
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
import { useDispatch } from "react-redux";
import { userActions } from "../../../redux/action-creators";
import Quiz from "../../../pages/QuizHub";
import { Button } from "@mui/joy";
import { fetchUserCoinsAndLifeline } from "../../../services/quizSocket.service";

const QuizHeader = ({ firstName, lastName, uploadCount, userName }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullImagePath, setFullImagePath] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [userCoinsAndLifeline, setuserCoinsAndLifeline] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  var username = "";
  const data = jwtDecoder();
  username = data["Username"];
  const dispatch = useDispatch();

  useEffect(() => {
    const imgPath = `${
      import.meta.env.VITE_PUBLIC_URL
    }ProfilePhoto/${username}/${username}.jpg?t=${new Date().getTime()}`;
    setFullImagePath(imgPath);
  }, [uploadCount]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const userData = jwtDecoder();
    const userName = userData.Username;
    var coinsData = await fetchUserCoinsAndLifeline(userName);
    setuserCoinsAndLifeline(coinsData);
  };
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };
  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
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
  const ModalHandler = () => {
    setIsOpen(true);
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
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#3d3189",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0rem 1rem 0rem 1rem",
        }}
        className={`${classes["header"]}`}
      >
        <Link to="/" className={`${classes["logo-div"]}`}>
          <img className={classes["web-logo"]} src={Logo} />
        </Link>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            padding: "1rem",
            columnGap: "1rem"
          }}
        >
          {/* <Badge  badgeContent={'+'}
          sx={{
            '.MuiBadge-badge':{
              background:'#FADA65',
              color:'black',
              fontWeight:'900'
            },
          }}
          >
          <div className=" rounded-4 d-flex align-items-center justify-content-between" style={{background:'#3d3189'}}>
            <img
              src={CoinIcon}
              height={28}
              sx={{ color: "yellow" }}
              className="ms-2 me-3 my-2"
            />
            <small className="mx-2 fw-bold fs-5">3</small>
          </div>
          </Badge> */}
          {/* <Button className="bg-white" variant="outlined" onClick={ModalHandler}>
                Open dialog
          </Button> */}

          {/* <Badge  badgeContent={'+'}
          sx={{
            '.MuiBadge-badge':{
              background:'#FADA65',
              color:'black',
              fontWeight:'900',
              '&:hover':{
                boxShadow:'inset 1px -1px 14px 0px black'
              }
            },
          }}
          >
            <div className={`${classes['coin-box']} rounded-4 d-flex align-items-center justify-content-between`} style={{background:'#3d3189'}} onClick={ModalHandler}>
              <img
                src={LifeLineIcons}
                height={28}
                sx={{ color: "yellow" }}
                className={`ms-2 me-3 my-2`}
              />
              <small className="mx-2 fw-bold fs-5">{userCoinsAndLifeline?.data?.UserLifelines.length}</small>
            </div>
          </Badge> */}
          <p
            className={`${classes["username"]} fs-5 mt-3 px-3 fw-semibold d-sm-inline d-none`}
          >
            {username}
          </p>
          <IconButton
            className="gap-2 rounded d-flex align-items-between p-0"
            onClick={handleAvatarClick}
          >
            <Avatar
              sx={{
                background: "#3d3189",
                color: "#fada65",
                cursor: "pointer",
                padding: "0px"
              }}
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
              <Avatar src={fullImagePath}></Avatar> Profile
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
      {isOpen && (
        <Quiz
          isOpen={isOpen}
          closeHandler={closeHandler}
          coinsAndLifelinesDetails={userCoinsAndLifeline?.data}
        />
      )}
    </>
  );
};

export default QuizHeader;
