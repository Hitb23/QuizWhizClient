import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  // makeStyles,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Pagination from "@mui/material/Pagination";
import classes from "./style.module.css";
import { MdArrowForward } from "react-icons/md";
import { Category } from "../../utils/dummyData";
import CardComponent from "../../components/admin-cards/quiz-category";
import {
  faQuestionCircle,
  faCalendarAlt,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DrawerHeader,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/admin-components";
import AdminSlider from "../../components/header/admin-header";
import QuizCard from "../../components/admin-cards/quiz-card";
import jwtDecoder from "../../services/jwtDecoder";
import SearchIcon from "@mui/icons-material/Search";
import { getUserDetails } from "../../services/auth.service";

const AdminCategory = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uploadCount, setUploadCount] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const [stateVal, setStateVal] = useState(params.id);
  const [updatedText, setUpdatedText] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);

  // setParamsId(params.id);
  const navigateToCategory = (id) => {
    // setParamsId(paramsId + 1);
    if (id === "pending") {
      navigate(`/admin-dashboard`);
    } else {
      navigate(`/admin-dashboard/${id}`);
    }
    setUpdatedText(
      params.id.substring(0, 1).toUpperCase() + params.id.substring(1)
    );
    setStateVal(id);
  };
  const [Records, setRecords] = React.useState(4);

  const handleChange = (event) => {
    setRecords(event.target.value);
  };
  const handlePageChange = async (event, value) => {
    const data = {
      Token: jwtDecoder(),
      Category: params.id,
      CurrentPage: value,
      PageSize: 5,
    };
    const result = await getContestRecords();
  };
  var fname = "";
  var lname = "";
  var username = "";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = jwtDecoder();
        const response = await getUserDetails(data["Username"]);
        setFirstName(response.data.data.FirstName);
        setLastName(response.data.data.LastName);
        setIsDataFetched(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    setUploadCount(uploadCount + 1);
  }, [updatedText, stateVal, isDataFetched]);

  return (
    <Box sx={{ display: "flex" }} className={`${classes["bgimage"]}`}>  
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider
        firstName={firstName}
        lastName={lastName}
        uploadCount={uploadCount}
        userName={jwtDecoder().Username}
      />
      {/* Main Content */}
      <Box
        className={`${classes["bgimage"]} container`}
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <DrawerHeader />

        <div className="mt-5 row">
          <CardComponent
            count={3}
            text="Upcoming"
            icon={faCalendarAlt}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={5}
            text="Active"
            icon={faPlay}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={2}
            text="Completed"
            icon={faCheckCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={10}
            text="Pending"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
        </div>
        <div className="d-flex  align-items-center flex-wrap column-gap-2 my-2">
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#5f071c" }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <button className={`${classes["add-quiz-btn"]}`}>Add Quiz</button>
        </div>
        <h4>{updatedText} Contest</h4>
        <Box className="row">
          {Category.map((ele, idx) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
              key={idx}
            />
          ))}
        </Box>
        <div className="d-flex justify-content-between mt-3 align-items-center">
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-simple-select-autowidth-label">
              Page
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={Records}
              onChange={handleChange}
              autoWidth
              label="Page"
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={10}
            color="primary"
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#5f071c",
                  color: "#fbd0da",
                },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#5f071c",
                color: "#fbd0da",
              },
              "& .MuiPaginationItem-ellipsis": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#fbd0da",
                },
              },
            }}
          />
        </div>
      </Box>
    </Box>
  );
};
export default AdminCategory;
