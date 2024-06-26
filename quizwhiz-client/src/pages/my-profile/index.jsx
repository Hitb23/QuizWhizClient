import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  TextField,
  Badge,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuIcon from "@mui/icons-material/Menu";
import { Formik, Form, Field, useFormik } from "formik";
import * as yup from "yup";
import { IoNotificationsOutline } from "react-icons/io5";
import { adminDashboardSections } from "../../utils/dummyData";
import jwtDecoder from "../../services/jwtDecoder";
import {
  uploadProfilePhoto,
  getUserDetails,
  editProfile,
} from "../../services/auth.service";
import Logo from "../../assets/NewQuizLogo.svg";
import classes from "./style.module.css";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";
import countries from "../../components/list-of-countries/listOfCountries";
import { Autocomplete } from "formik-material-ui";
import { RoutePaths } from "../../utils/enum";
import { bindActionCreators } from "redux";
import { userActions } from "../../redux/action-creators";

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

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "First name can only contain letters")
    .min(3, "Atleast 3 letters are required.")
    .required("First name is required"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Last name can only contain letters")
    .min(3, "Atleast 3 letters are required.")
    .required("Last name is required"),
  phoneNumber: yup
    .string()
    .matches(
      /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$|^\d{10}$/,
      "Phone number is invalid"
    )
    .required("Phone number is required"),
});

const AdminSideBar = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);
  const [myData, setMyData] = useState([]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      debugger;
      const data = jwtDecoder();
      const Username = data["Username"];
      const FirstName = formik.values.firstName;
      const LastName = formik.values.lastName;
      const PhoneNumber = formik.values.phoneNumber;
      const Country = country;
      if (isEditable) {
        try {
          const response = await editProfile({
            Username,
            FirstName,
            LastName,
            PhoneNumber,
            Country,
          });
          setIsEditable(false);
        } catch (error) {
          console.log(error);
        }
      }
    },
  });

  var username = "";

  useEffect(() => {
    const data = jwtDecoder();
    username = data["Username"];
    setUserName(data["Username"]);
    setEmail(data["Email"]);

    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(data["Username"]);
        setFirstName(response.data.data.FirstName);
        setLastName(response.data.data.LastName);
        setPhoneNumber(response.data.data.PhoneNumber);
        setCountry(response.data.data.Country);
        formik.values.firstName = response.data.data.FirstName;
        formik.values.lastName = response.data.data.LastName;
        formik.values.phoneNumber = response.data.data.PhoneNumber;
        const photoUrl = response.data.data.ProfilePhotoUrl;
        setProfilePhotoUrl(photoUrl);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

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

  const submitUserDetails = async () => {
    console.log(firstName);
    console.log(lastName);
    console.log(phoneNumber);
    console.log(country);
  };

  const handleImageUpload = async (event) => {
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

      const response = await uploadProfilePhoto(ProfilePhoto, Username);
    } catch (error) {
      console.log(error);
    }
  };

  const fullImagePath = `${
    import.meta.env.VITE_PUBLIC_URL
  }ProfilePhoto/${userName}/${userName}.jpg`;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
            src={fullImagePath}
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
            <MenuItem>Logout</MenuItem>
          </Menu>

          <Button variant="contained">Logout</Button>
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
            <Avatar sx={{ background: "#F47D0A" }} src={fullImagePath}>PR</Avatar>
            <Typography sx={{fontWeight: "bold"}}>Hey, {firstName} {lastName}</Typography>
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
                {openIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItemButton>
                </List>
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* <div className={`text-center`}>
        <div
          className={`${classes["log-in-title"]} fw-bold`}
        >
          User Details
        </div>
      </div> */}
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
            marginRight: "3rem",
          }}
        >
          {/* <Avatar src={profilePhotoUrl} className={`${classes["profile-photo"]}`}>
            {image ? (
              <img
                src={profilePhotoUrl}
                alt="Uploaded"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="h2 mt-1">BR</span>
            )}
          </Avatar> */}

          <Avatar
            className={classes["profile-photo"]}
            src={fullImagePath}
          ></Avatar>

          <Button
            className={`mt-4 mb-4 ${classes["upload-button"]}`}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon style={{ marginLeft: "0.6rem" }} />}
          >
            <span className={`${classes["uplaod-icon-text"]}`}>
              Upload file
            </span>
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </div>
        <div className={classes["vertical-line-centre"]}></div>
        <form onSubmit={formik.handleSubmit}>
          <div className="d-flex flex-column me-5">
            <TextField
              className={`${classes["input-field"]}`}
              name="userName"
              label="Username"
              value={userName}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className={`mt-4 ${classes["input-field"]}`}
              name="email"
              label="Email"
              value={email}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              className={`mt-4 ${classes["input-field"]}`}
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <span className="text-danger mt-2">
                {formik.errors.firstName}
              </span>
            ) : null}
            <TextField
              className={`mt-4 ${classes["input-field"]}`}
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <span className="text-danger mt-2">{formik.errors.lastName}</span>
            ) : null}
            <TextField
              className={`mt-4 ${classes["input-field"]}`}
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <span className="text-danger mt-2">
                {formik.errors.phoneNumber}
              </span>
            ) : null}

            <div className="d-flex flex-row">
              {isEditable ? (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    className={`mt-4 me-2 ${classes["edit-button"]}`}
                    id="save-button"
                    sx={{ minWidth: 10, maxWidth: 50 }}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    className={`mt-4 ms-1 ${classes["edit-button"]}`}
                    sx={{ minWidth: 75, maxWidth: 50 }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
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
        </form>
      </Box>
    </Box>
  );
};

export default AdminSideBar;
