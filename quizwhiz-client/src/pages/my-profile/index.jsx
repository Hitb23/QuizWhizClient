import React, { useState, useEffect, useCallback, useReducer } from "react";
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
import { ArrowDropDown, PhotoCamera } from "@mui/icons-material";
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
import { RoutePaths } from "../../utils/enum";
import { bindActionCreators } from "redux";
import { userActions } from "../../redux/action-creators";
import AdminSlider from "../../components/header/admin-header";
import countries from "../../components/list-of-countries/listOfCountries";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Flag from "react-world-flags";

const drawerWidth = 240;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
      marginTop: ITEM_PADDING_TOP - 2,
    },
  },
};

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
  country: yup.string().required("Select a country"),
});

const AdminSideBar = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [clickOnSave, setClickOnSave] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [fullImagePath, setFullImagePath] = useState(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [countryName, setCountryName] = useState([]);
  const [uploadKey, setUploadKey] = useState(Date.now());

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const data = jwtDecoder();
      const Username = data["Username"];
      const FirstName = formik.values.firstName;
      const LastName = formik.values.lastName;
      const PhoneNumber = formik.values.phoneNumber;
      const Country = formik.values.country;
      if (!isEditable || clickOnSave) {
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
    console.log("Username in dashboard" + username);
    setUserName(data["Username"]);
    setEmail(data["Email"]);
    const imagePath = `${
      import.meta.env.VITE_PUBLIC_URL
    }ProfilePhoto/${username}/${username}.jpg`;
    console.log("Profile: " + imagePath);
    setFullImagePath(imagePath);
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
        formik.values.country = response.data.data.Country;
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
    setClickOnSave(false);
  };

  const handleSaveClick = () => {
    setClickOnSave(true);
  };

  const handleCancelClick = () => {
    formik.setTouched([]);
    setIsEditable(false);
  };

  const submitUserDetails = async () => {
    // console.log(firstName);
    // console.log(lastName);
    // console.log(phoneNumber);
    // console.log(country);
  };

  const handleImageUpload = async (event) => {
    const ProfilePhoto = event.target.files[0];
    if (ProfilePhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("FileReader onload called");
        setImage(e.target.result); // Update state
        setUploadCount(uploadCount + 1);
        setUploadKey(Date.now());
      };
      reader.readAsDataURL(ProfilePhoto);
      const data = jwtDecoder();
      const Username = data.Username;
      const imagePath = `${
        import.meta.env.VITE_PUBLIC_URL
      }ProfilePhoto/${Username}/${Username}.jpg`;
      setFullImagePath(imagePath);
    }

    try {
      const data = jwtDecoder();
      const Username = data.Username;
      const response = await uploadProfilePhoto(ProfilePhoto, Username);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    debugger;
    console.log("Image state updated: ", image);
    const data = jwtDecoder();
    const Username = data.Username;
    const imagePath = `${
      import.meta.env.VITE_PUBLIC_URL
    }ProfilePhoto/${Username}/${Username}.jpg`;
    setFullImagePath(imagePath);
  }, [image]);

  const FileUploadButton = styled(Button)(({ theme }) => ({
    color: "#fbd0da",
    backgroundColor: "#5f071c",
    "&:hover": {
      backgroundColor: "#485256",
    },
  }));

  const handleCountryChange = (event) => {
    const {
      target: { value },
    } = event;
    setCountryName(value);
    formik.setFieldValue("country", value);
  };

  // function getStyles(name, personName, theme) {
  //   return {
  //     fontWeight:
  //       personName.indexOf(name) === -1
  //         ? theme.typography.fontWeightRegular
  //         : theme.typography.fontWeightMedium,
  //   };
  // }

  // const getCountryFlagUrl = (countryName) => {
  //   return `https://flagpedia.net/data/flags-mini/${countryName.toLowerCase()}.png`;
  // };

  // const fullImagePath = `${
  //   import.meta.env.VITE_PUBLIC_URL
  // }ProfilePhoto/${userName}/${userName}.jpg`;
  // console.log("Profile image path: " + fullImagePath);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AdminSlider
        key={uploadKey}
        firstName={firstName}
        lastName={lastName}
        uploadCount={uploadCount}
        userName={jwtDecoder().Username}
      />
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
            marginLeft: "1rem",
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
            src={image || fullImagePath}
          ></Avatar>

          <FileUploadButton
            className={`mt-4 mb-4 ${classes["upload-btn"]}`}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon style={{ marginLeft: "0.6rem" }} />}
          >
            <span>Upload file</span>
            <VisuallyHiddenInput
              type="file"
              accept="image/jpg, image/jpeg"
              onChange={handleImageUpload}
            />
          </FileUploadButton>
        </div>
        <div className={classes["vertical-line-centre"]}></div>
        <form onSubmit={formik.handleSubmit}>
          <div className={`d-flex flex-column me-5 ${classes["form-group"]}`}>
            {/* <Field
              as="input"
              type="text"
              name="userName"
              className={`${classes["input-field"]}`}
              id="username"
              inputProps={{readOnly: !isEditable}}
            /> */}
            <label
              htmlFor="userName"
              className={`form-label fw-bold ${classes["black-font"]}`}
            >
              Username
            </label>
            <TextField
              className={`${classes["input-field"]} form-control`}
              name="userName"
              value={userName}
              variant="outlined"
              inputProps={{ readOnly: !isEditable }}
              sx={{ "& fieldset": { border: "none" } }}
            />

            <label
              htmlFor="email"
              className={`mt-3 form-label fw-bold ${classes["black-font"]}`}
            >
              Email
            </label>
            <TextField
              className={`${classes["input-field"]} form-control`}
              name="email"
              value={email}
              variant="outlined"
              inputProps={{ readOnly: !isEditable }}
              sx={{ "& fieldset": { border: "none" } }}
            />

            <label
              htmlFor="firstName"
              className={`mt-3 form-label fw-bold ${classes["black-font"]}`}
            >
              First Name
            </label>
            <TextField
              className={`${classes["input-field"]} form-control`}
              name="firstName"
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              inputProps={{ readOnly: !isEditable }}
              sx={{ "& fieldset": { border: "none" } }}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <span className={`mt-2 ${classes["error-message"]}`}>
                {formik.errors.firstName}
              </span>
            ) : null}

            <label
              htmlFor="lastName"
              className={`mt-3 form-label fw-bold ${classes["black-font"]}`}
            >
              Last Name
            </label>
            <TextField
              className={`${classes["input-field"]} form-control`}
              name="lastName"
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              inputProps={{ readOnly: !isEditable }}
              sx={{ "& fieldset": { border: "none" } }}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <span className={`mt-2 ${classes["error-message"]}`}>
                {formik.errors.lastName}
              </span>
            ) : null}

            <label
              htmlFor="phoneNumber"
              className={`mt-3 form-label fw-bold ${classes["black-font"]}`}
            >
              Phone Number
            </label>
            <TextField
              className={`${classes["input-field"]} form-control`}
              name="phoneNumber"
              variant="outlined"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              inputProps={{ readOnly: !isEditable }}
              sx={{ "& fieldset": { border: "none" } }}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <span className={`mt-2 ${classes["error-message"]}`}>
                {formik.errors.phoneNumber}
              </span>
            ) : null}

            <label
              htmlFor="country"
              className={`mt-3 form-label fw-bold ${classes["black-font"]}`}
            >
              Choose Country
            </label>
            <Select
              className={`${classes["input-field"]}`}
              name="country"
              onChange={handleCountryChange}
              value={formik.values.country}
              input={<OutlinedInput />}
              readOnly={!isEditable}
              MenuProps={MenuProps}
              sx={{ "& fieldset": { border: "none" }, borderRadius: "0.4rem" }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  <Flag
                    code={country.code}
                    style={{ width: "1.5em", marginRight: "8px" }}
                  />
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.country && formik.errors.country ? (
              <span className={`mt-2 ${classes["error-message"]}`}>
                {formik.errors.country}
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
                    onClick={handleSaveClick}
                    sx={{
                      minWidth: 10,
                      maxWidth: 50,
                      backgroundColor: "#5f071c",
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    className={`mt-4 ms-1 ${classes["edit-button"]}`}
                    sx={{
                      minWidth: 75,
                      maxWidth: 50,
                      backgroundColor: "#5f071c",
                    }}
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
        </form>
      </Box>
    </Box>
  );
};

export default AdminSideBar;
