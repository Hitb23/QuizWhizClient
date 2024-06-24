import * as React from "react";
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { PhotoCamera } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { adminDashboardSections } from "../../utils/dummyData";
import ReactCountryFlag from "react-country-flag";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Logo from "../../assets/NewQuizLogo.svg";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  FormControl,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import CardComponent from "../../components/card";
import {
  faQuestionCircle,
  faCalendarAlt,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import jwtDecoder from "../../services/jwtDecoder";
import { uploadProfilePhoto } from "../../services/auth.service";
import classes from "./style.module.css";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AdminSideBar = () => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(null);

  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleImageUpload = async (event) => {
    debugger;
    const ProfilePhoto = event.target.files[0];
    if (ProfilePhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(ProfilePhoto);
    }

    try {
      const data = jwtDecoder();
      const Username = data.Username;
      
      console.log(data);
      const response = await uploadProfilePhoto(ProfilePhoto,Username);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#FFFFFF",
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
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img src={Logo} height={80} />
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
            marginRight: "3rem",
          }}
        >
          <Badge badgeContent={4} color="primary">
            <IoNotificationsOutline color="black" size={30} />
          </Badge>

          <Avatar
            sx={{ background: "#F47D0A", cursor: "pointer" }}
            onClick={handleAvatarClick}
          >
            BR
          </Avatar>

          <Menu
            id="avatar-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAvatarClose}
          >
            <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
            <MenuItem onClick={handleAvatarClose}>Settings</MenuItem>
            <MenuItem onClick={handleAvatarClose}>Logout</MenuItem>
          </Menu>

          <Button variant="contained">Logout</Button>
        </Box>
      </AppBar>

      {/* {/ Slider /} */}
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
            <Avatar sx={{ background: "#F47D0A" }}>PR</Avatar>
            <Typography>Pravin Raina</Typography>
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
              <ListItemButton onClick={() => handleClick(index)}>
                <ListItemIcon sx={{ display: open ? "none" : "block" }}>
                  {text.icon}
                </ListItemIcon>
                <ListItemText primary={text.title} />
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
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        className={`container-fluid flex-column flex-xl-row ${classes["main-box"]}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "0px",
            marginRight: "3rem"
          }}
        >
          <Avatar className={`${classes["profile-photo"]}`}
          >
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="h2 mt-1">BR</span>
            )}
          </Avatar>

          <Button
            className={`mt-4 mb-4 ${classes["upload-button"]}`}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon style={{marginLeft: '0.6rem'}} />}
          >
            <span className={`d-none d-md-block`}>Upload file</span>
            <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
          </Button>
        </div>
        <div className={classes["vertical-line-centre"]}></div>
        <div className="d-flex flex-column me-5">
          <TextField
          className={`${classes["input-field"]}`}
            id="filled-basic"
            label="Username"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            className={`mt-4 ${classes["input-field"]}`}
            id="filled-basic"
            label="Email"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            className={`mt-4 ${classes["input-field"]}`}
            id="filled-basic"
            label="First Name"
            variant="outlined"
            InputProps={{
              readOnly: !isEditable,
            }}
          />
          <TextField
            className={`mt-4 ${classes["input-field"]}`}
            id="filled-basic"
            label="Last Name"
            variant="outlined"
            InputProps={{
              readOnly: !isEditable,
            }}
          />
          <TextField
            className={`mt-4 ${classes["input-field"]}`}
            id="filled-basic"
            label="Phone Number"
            variant="outlined"
            InputProps={{
              readOnly: !isEditable,
            }}
          />
          <div className="d-flex flex-row">
            {isEditable ? (
              <>
                <Button
                  variant="contained"
                  className={`mt-4 me-2 ${classes["edit-button"]}`}
                  sx={{ minWidth: 10, maxWidth: 50 }}
                  onClick={() => alert("Save button clicked")}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  className={`mt-4 ${classes["edit-button"]}`}
                  sx={{ minWidth: 75, maxWidth: 50 }}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                className={`mt-4 ${classes["edit-button"]}`}
                sx={{ minWidth: 10, maxWidth: 50 }}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default AdminSideBar;
