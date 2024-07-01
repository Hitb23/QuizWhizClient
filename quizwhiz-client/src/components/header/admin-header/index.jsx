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
import { Avatar, Badge, Collapse, useMediaQuery, useTheme } from "@mui/material";
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

const AdminSlider = ({firstName, lastName, uploadCount}) => {

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullImagePath, setFullImagePath] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  var username = "";
  const data = jwtDecoder();
  username = data["Username"];

  useEffect(() => {
    setFullImagePath(`${import.meta.env.VITE_PUBLIC_URL}ProfilePhoto/${username}/${username}.jpg?${uploadCount}`);
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
  }
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginLeft:-3.1,
              marginRight: 4,
              ...(open && { display: "none" }),
              ...(useMediaQuery('(max-width:450px)') && { display: "none" })
            }}
          >
            <MenuIcon />
          </IconButton>
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
          <Badge badgeContent={4} sx={{ cursor: "pointer",
          '& .MuiBadge-badge': {
          backgroundColor: "#5f071c",
          color: "white" // This sets the text color of the badge
        } }}>
            <IoNotificationsOutline color="black" size={30} />
          </Badge>
          <IconButton
            className="gap-2 rounded d-flex align-items-center"
            onClick={handleAvatarClick}
          >
            <Avatar sx={{ background: "#5f071c", cursor: "pointer" }} src={fullImagePath}>
            </Avatar>
            <p className="fs-5 mt-3 fw-semibold d-sm-inline d-none">{firstName} {lastName}</p>
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            paddingY: "2rem",
            display: "flex",
            justifyContent: "space-between",
            marginX: "0.3rem",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <Avatar sx={{ background: "#5f071c" }}>PR</Avatar>
            <Typography variant="p">Pravin Raina</Typography>
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {adminDashboardSections.map((text, index) => (
            <ListItem key={text.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleClick(index)}
                sx={{
                  borderRadius:"10px",
                  backgroundColor: openIndex === index || text=="Quiz Management" ? "#ffb165" : "inherit",
                  color: openIndex === index ? "#fffff" : "inherit",
                  "&:hover": {
                    backgroundColor:
                      openIndex === index ? "#ffb165" : "#f5f5f5",
                    color: openIndex === index ? "#fffff" : "inherit",
                  },
                }}
              >
                <ListItemIcon sx={{ display: open ? "none" : "block" }}>
                  {text.icon}
                </ListItemIcon>
                <ListItemText variant="h4" primary={text.title} />
                {openIndex === index ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItemButton>
                </List>
              </Collapse>
              {/* </ListItemButton> */}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default AdminSlider;
