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
import QuizHeader from "../../components/header/quizzes-header";
import countries from "../../components/list-of-countries/listOfCountries";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import OutlinedInput from "@mui/material/OutlinedInput";
import Flag from "react-world-flags";
import axios from "axios";

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
      /^(?:\+\d{1,3}|0\d{1,3}|00\d{1,2})?(?:\s?\(\d+\))?(?:[-\/\s.]|\d){7,15}$/,
      "Phone number is invalid"
    )
    .required("Phone number is required"),
  country: yup.string().required("Select a country"),
});

const MyProfile = () => {
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
  const [url, setUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const data = jwtDecoder();
  var username = data.Username;

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
          if (clickOnSave && !isEditable) {
            toast.success("Details changed successfully", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          setIsEditable(false);
        } catch (error) {
          if (!clickOnSave) {
            toast.error("Unable to edit the details");
          }
          console.log(error);
        }
      }
    },
  });

  useEffect(() => {
    const data = jwtDecoder();
    const username = data.Username;
    const roleName = data.Role;
    if (roleName == "Admin") {
      setIsAdmin(true);
    }
    setUserName(username);
    setEmail(data.Email);

    const fetchUserDetails = async () => {
      `${import.meta.env.VITE_PUBLIC_URL}src/assets/gk.jpg`;
      const imgPath = `${
        import.meta.env.VITE_PUBLIC_URL
      }/ProfilePhoto/${username}/${username}.jpg`;
      setFullImagePath(imgPath);
      try {
        const response = await getUserDetails(username);
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

  useEffect(() => {
    const data = jwtDecoder();
    const Username = data.Username;
    const imgPath = `${
      import.meta.env.VITE_PUBLIC_URL
    }/ProfilePhoto/${Username}/${Username}.jpg`;
    setFullImagePath(imgPath);
  }, [image]);

  const handleImageUpload = async (event) => {
    const ProfilePhoto = event.target.files[0];

    try {
      const data = jwtDecoder();
      const Username = data.Username;
      const response = await uploadProfilePhoto(ProfilePhoto, Username);
      setUploadCount(uploadCount + 1);
      if (ProfilePhoto && response.status == 200) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result); // Update state
          setUploadKey(Date.now());
        };
        reader.readAsDataURL(ProfilePhoto);
        const data = jwtDecoder();
        const Username = data.Username;
        const imgPath = `${
          import.meta.env.VITE_PUBLIC_URL
        }ProfilePhoto/${Username}/${Username}.jpg`;
        setFullImagePath(imgPath);
        toast.success("Profile Photo Changed Successfully.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Only JPGs are allowed.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
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
    formik.setTouched([]);
    setIsEditable(true);
    setClickOnSave(false);
  };

  const handleSaveClick = () => {
    setClickOnSave(true);
    if (clickOnSave && !isEditable) {
      toast.success("Details changed successfully", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleCancelClick = async () => {
    setIsEditable(false);
    setClickOnSave(false);
    try {
      const response = await getUserDetails(username);
      setFirstName(response.data.data.FirstName);
      setLastName(response.data.data.LastName);
      setPhoneNumber(response.data.data.PhoneNumber);
      setCountry(response.data.data.Country);
      formik.values.firstName = response.data.data.FirstName;
      formik.values.lastName = response.data.data.LastName;
      formik.values.phoneNumber = response.data.data.PhoneNumber;
      formik.values.country = response.data.data.Country;
      console.log(username);
    } catch (error) {
    }
    formik.setTouched([]);
  };

  // const theme = useTheme();

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  // const handleClick = (index) => {
  //   setOpenIndex(openIndex === index ? null : index);
  // };

  // const handleAvatarClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleAvatarClose = () => {
  //   setAnchorEl(null);
  // };

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

  return (
    <main
      className={`${
        isAdmin ? classes["admin-profile"] : classes["user-profile"]
      } container p-0 m-0`}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ToastContainer />
        <CssBaseline />
        {isAdmin ? (
          <AdminSlider
            key={uploadKey}
            firstName={firstName}
            lastName={lastName}
            uploadCount={uploadCount}
            userName={jwtDecoder().Username}
          />
        ) : (
          <QuizHeader
            firstName={firstName}
            lastName={lastName}
            uploadCount={uploadCount}
            userName={jwtDecoder().userName}
          />
        )}
        <div
          className={`row container-fluid px-0 ${classes["main-box"]} min-vh-100 m-0 p-0`}
        >
          <div
            className={`col-lg-6 col-12 d-flex flex-column align-items-center justify-content-center ${classes["profile-photo-div"]}`}
          >
            <Avatar
              className={`${classes["profile-photo"]}`}
              src={image || fullImagePath}
            ></Avatar>

            <FileUploadButton
              className={`my-4 mx-5 ${
                isAdmin ? classes["admin-upload-btn"] : classes["upload-btn"]
              }`}
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
          <div
            className={`col-lg-6 col-md-12 col-sm-12 col-12 ${classes["form-group"]} d-flex justify-content-center align-items-center`}
          >
            <form
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}
              className={`col-lg-8 col-md-6 col-sm-8 col-10`}
            >
              {/* <Field
              as="input"
              type="text"
              name="userName"
              className={`${classes["input-field"]}`}
              id="username"
              inputProps={{readOnly: !isEditable}}
            /> */}
              <div className={`col-12`}>
                <label
                  htmlFor="userName"
                  className={`form-label fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  Username
                </label>
                <TextField
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="userName"
                  value={userName}
                  variant="outlined"
                  inputProps={{ readOnly: true }}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: "#ded9fc",
                  }}
                  disabled={true}
                />
              </div>

              <div className={`col-md-12`}>
                <label
                  htmlFor="email"
                  className={`mt-3 form-label w-100 fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  Email
                </label>
                <TextField
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="email"
                  variant="outlined"
                  value={email}
                  onChange={formik.handleChange}
                  inputProps={{ readOnly: true }}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: "#ded9fc",
                  }}
                  disabled={true}
                />
              </div>

              <div className={`col-md-12`}>
                <label
                  htmlFor="firstName"
                  className={`mt-3 form-label fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  First Name
                </label>
                <TextField
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="firstName"
                  variant="outlined"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  inputProps={{ readOnly: !isEditable }}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: `${
                      isEditable && isAdmin ? "#FFFFFF" : "#ded9fc"
                    }`,
                  }}
                  disabled={!isEditable}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <span
                    className={`mt-1 ${
                      isAdmin
                        ? classes["admin-error-message"]
                        : classes["error-message"]
                    }`}
                  >
                    {formik.errors.firstName}
                  </span>
                ) : null}
              </div>

              <div className={`col-md-12`}>
                <label
                  htmlFor="lastName"
                  className={`mt-3 form-label fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  Last Name
                </label>
                <TextField
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="lastName"
                  variant="outlined"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  inputProps={{ readOnly: !isEditable }}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: `${
                      isEditable && isAdmin ? "#FFFFFF" : "#ded9fc"
                    }`,
                  }}
                  disabled={!isEditable}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <span
                    className={`mt-2 ${
                      isAdmin
                        ? classes["admin-error-message"]
                        : classes["error-message"]
                    }`}
                  >
                    {formik.errors.lastName}
                  </span>
                ) : null}
              </div>

              <div className={`col-md-12`}>
                <label
                  htmlFor="phoneNumber"
                  className={`mt-3 form-label fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  Phone Number
                </label>
                <TextField
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="phoneNumber"
                  variant="outlined"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  inputProps={{ readOnly: !isEditable }}
                  sx={{
                    "& fieldset": { border: "none" },
                    backgroundColor: `${
                      isEditable && isAdmin ? "#FFFFFF" : "#ded9fc"
                    }`,
                  }}
                  disabled={!isEditable}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <span
                    className={`mt-2 ${
                      isAdmin
                        ? classes["admin-error-message"]
                        : classes["error-message"]
                    }`}
                  >
                    {formik.errors.phoneNumber}
                  </span>
                ) : null}
              </div>

              <div className={`col-md-12`}>
                <label
                  htmlFor="country"
                  className={`mt-3 form-label fw-bold ${
                    isAdmin
                      ? classes["admin-label-font"]
                      : classes["black-font"]
                  }`}
                >
                  Choose Country
                </label>
                <Select
                  className={`${
                    isAdmin
                      ? classes["admin-input-field"]
                      : classes["input-field"]
                  } form-control`}
                  name="country"
                  onChange={handleCountryChange}
                  value={formik.values.country}
                  input={<OutlinedInput />}
                  readOnly={!isEditable}
                  MenuProps={MenuProps}
                  sx={{
                    "& fieldset": { border: "none" },
                    borderRadius: "0.4rem",
                    height: "59px",
                    backgroundColor: `${
                      isEditable && isAdmin ? "#FFFFFF" : "#ded9fc"
                    }`,
                  }}
                  disabled={!isEditable}
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
                  <span
                    className={`mt-2 ${
                      isAdmin
                        ? classes["admin-error-message"]
                        : classes["error-message"]
                    }`}
                  >
                    {formik.errors.country}
                  </span>
                ) : null}
              </div>

              <div className="d-flex flex-row mb-3">
                {isEditable ? (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      className={`mt-4 me-2 ${
                        isAdmin
                          ? classes["admin-edit-button"]
                          : classes["edit-button"]
                      }`}
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
                      type="reset"
                      variant="outlined"
                      className={`mt-4 ms-1 ${
                        isAdmin
                          ? classes["admin-edit-button"]
                          : classes["edit-button"]
                      }`}
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
                    className={`mt-4 ${
                      isAdmin
                        ? classes["admin-edit-button"]
                        : classes["edit-button"]
                    }`}
                    sx={{ minWidth: 10, maxWidth: 50 }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Box>
    </main>
  );
};

export default MyProfile;
