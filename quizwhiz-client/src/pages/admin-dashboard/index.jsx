import * as React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { adminDashboardSections } from "../../utils/dummyData";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
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
import { RoutePaths } from "../../utils/enum";
import jwtDecoder from "../../services/jwtDecoder";
import { getUserDetails } from "../../services/auth.service";
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
  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [openIndex, setOpenIndex] = useState(null);
  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = async () => {
    
    setAnchorEl(null);
  };

  const clickOnProfile = async() => {
    try{
      const data = jwtDecoder();
    const userName = data.Username;
    console.log(data);
    const response = await getUserDetails(userName);
    console.log(response);
    }
    catch(error){
      console.log(error);
    }
    setAnchorEl(null);
  }

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
            <Link to={RoutePaths.MyProfile} style={{textDecoration: 'none', color: '#000000'}}>
              <MenuItem onClick={clickOnProfile}>Profile</MenuItem>
            </Link>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="container mt-5">
          <div className="row">
            <CardComponent count={10} text="Total" icon={faQuestionCircle} />
            <CardComponent count={3} text="Upcoming" icon={faCalendarAlt} />
            <CardComponent count={5} text="Active" icon={faPlay} />
            <CardComponent count={2} text="Completed" icon={faCheckCircle} />
          </div>
        </div>
        <h4>Active Contest</h4>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          {adminDashboardSections.map(() => (
            <Card sx={{ maxWidth: 220 }} key={Math.random()}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://picsum.photos/200/300?nature=0"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <h4>Ongoing Contest</h4>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          {adminDashboardSections.map(() => (
            <Card sx={{ maxWidth: 220 }} key={Math.random()}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://picsum.photos/200/300?birds=0"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <h4>Active Contest</h4>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          {adminDashboardSections.map(() => (
            <Card sx={{ maxWidth: 220 }} key={Math.random()}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://picsum.photos/200/300?joy=0"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default AdminSideBar;
