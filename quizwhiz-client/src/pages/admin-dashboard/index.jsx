import { React, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import classes from "./style.module.css";
import AuthHeader from "../../components/header/auth-header";
import LandingHeader from "../../components/header/landing-header";
import AdminSideBar from "../../components/admin-sidebar";
import CreateQuizModal from "../../components/dialog-boxes/create-quiz";
import CardComponent from "../../components/admin-cards/quiz-category";


import {
  faQuestionCircle,
  faCalendarAlt,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {  useNavigate, useParams } from "react-router-dom";
import { DrawerHeader } from "../../components/admin-components";
import AdminSlider from "../../components/header/admin-header";
import QuizCard from "../../components/admin-cards/quiz-card";
import Pagination from "@mui/material/Pagination";
import { statusEnum } from "../../utils/enum";
import { getUserDetails } from "../../services/auth.service";
import {
  changeRecordsSize,
  filterByCategory,
  getAllStatusCount,
  getCategories,
  getDifficulties,
} from "../../services/admindashboard.service";
import jwtDecoder from "../../services/jwtDecoder";

import ViewQuizModal from "../../components/dialog-boxes/view-quiz";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 99,
    },
  },
};
const AdminDashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [difficulty, setDifficulty] = useState(0);
  const [category, setCategory] = useState(0);
  const [difficultyList, setDifficultyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [Records, setRecords] = useState(4);
  const [PageSize, SetPageSize] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [filteredData, SetFilteredData] = useState([]);
  const [uploadCount, setUploadCount] = useState(0);
  const [searchedWord, SetSearchedWord] = useState("");
  const [countOfPending, SetCountOfPending] = useState(null);
  const [countOfUpcoming, SetCountOfUpcoming] = useState(null);
  const [countOfActive, SetCountOfActive] = useState(null);
  const [countOfCompleted, SetCountOfCompleted] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  var username = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("In UseEffect: Called");
        setDifficulty(0);
        setCategory(0);
        SetCurrentPage(1);
        SetSearchedWord("");

        setUploadCount(uploadCount + 1);

        const difficulties = await getDifficulties();
        const categories = await getCategories();
        const allData = await filterByCategory({
          StatusId: statusEnum[params.id],
          DifficultyId: 0,
          CategoryId: 0,
          CurrentPage: 1,
          SearchValue: "",
        });
        console.log("All data: ");
        const data = allData.data.data.GetQuizzes;
        setDifficultyList(difficulties.data.data);
        setCategoryList(categories.data.data);
        SetFilteredData(data);
     
        const status = await getAllStatusCount();
        SetCountOfPending(status?.data?.data?.PendingCount);
        SetCountOfUpcoming(status?.data?.data?.UpcomingCount);
        SetCountOfActive(status?.data?.data?.ActiveCount);
        SetCountOfCompleted(status?.data?.data?.CompletedCount);
        SetPageSize(allData?.data?.data?.Pagination?.TotalPages);
        setRecords(allData?.data?.data?.Pagination?.RecordSize);
      } catch (error) {
        SetFilteredData([]);
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [Records, params]);
  useEffect(() => {
    const data = jwtDecoder();
    username = data["Username"];
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(data["Username"]);
        setFirstName(response.data.data.FirstName);
        setLastName(response.data.data.LastName);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, []);
  
  const navigateToCategory = (id) => {
    navigate(`/admin-dashboard/${id}`);
  };

  const handlePageSize = async (event) => {
    setRecords(event.target.value);
    try {
      const result = await changeRecordsSize({
        recordSize: event.target.value,
      });
    } catch (error) {
      SetFilteredData([]);
    }
  };

  const handleDifficulty = async (event) => {
    setDifficulty(event.target.value);
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: event.target.value,
        CategoryId: category,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
      });
      const filteredData = result.data.data.GetQuizzes;
      SetFilteredData(filteredData);
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
    } catch (error) {
      SetFilteredData([]);
    }
  };

  const handlePageChange = async (event, value) => {
    SetCurrentPage(currentPage);
    console.log(searchedWord);
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: value,
        SearchValue: searchedWord,
      });
      SetFilteredData(result.data.data.GetQuizzes);
    } catch (error) {
      SetFilteredData([]);
    }
  };
  const searchHandler = async (e) => {
    const searchedWord = e.target.value;
    SetSearchedWord(searchedWord);
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
      });
      SetFilteredData(result.data.data.GetQuizzes);
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
    } catch (error) {
      console.log("error:", error);
      SetFilteredData([]);
    }
  };
  const ViewDetailsHandler=(e)=>{
       navigate(`/admin-dashboard/${params.id}/${e}`);
  }

  const handleCategory = async (e) => {
    setCategory(e.target.value);
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: difficulty,
        CategoryId: e.target.value,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
      });
      const filteredData = result.data.data.GetQuizzes;
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
      SetFilteredData(filteredData);
    } catch (error) {
      SetFilteredData([]);
    }
  };
  var username = "";

  useEffect(() => {
    const data = jwtDecoder();
    username = data["Username"];
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(data["Username"]);
        setFirstName(response.data.data.FirstName);
        setLastName(response.data.data.LastName);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Box sx={{ display: "flex" }} className={`${classes["bgimage"]}`}>
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider
        firstName={firstName}
        lastName={lastName}
        uploadCount={uploadCount}
        userName={jwtDecoder().userName}
      />
      {/* Main Content */}
      <Box className={`container`} component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="mt-5 row">
          <CardComponent
            count={countOfUpcoming}
            text="Upcoming"
            icon={faCalendarAlt}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={countOfActive}
            text="Active"
            icon={faPlay}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={countOfCompleted}
            text="Completed"
            icon={faCheckCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
          <CardComponent
            count={countOfPending}
            text="Pending"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={params.id}
          />
        </div>
        <div className="row">
          <div className="col-lg-2 mb-4 col-sm-6 col-12">
            <TextField
              id="demo-search-name"
              label="Search"
              onChange={searchHandler}
              value={searchedWord}
              variant="outlined"
              autoComplete="off"
              sx={{
                width: "100%",
                backgroundColor: "#3d3189",
                color: "#fada65 !important",
                boxShadow: "none",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "1px solid #fada65",
                    color: "#fada65",
                    borderColor: "#fada65",
                  },
                  "&:hover fieldset": {
                    border: "1px solid #fada65",
                    color: "#fada65",
                    borderColor: "#fada65",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65",
                  },
                  "& .MuiInputBase-input": {
                    color: "#fada65",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#fada65",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#fada65",
                  },
                  "&.Mui-focused": {
                    color: "#fada65",
                  },
                },
              }}
            />
           
          </div>
          <div className="col-lg-2 mb-4 col-sm-6 col-12">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel
                id="demo-multiple-name-label"
                sx={{
                  color: "#fada65",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#fada65",
                  },
                  "&.Mui-focused": {
                    color: "#fada65",
                  },
                }}
              >
                Difficulty
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={difficulty}
                onChange={handleDifficulty}
                label="Difficulty"
                MenuProps={MenuProps}
                sx={{
                  backgroundColor: "#3d3189",
                  color: "#fada65",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Always set the border color to #fada65
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#fada65",
                  },
                }}
              >
                <MenuItem key={0} value={0}>
                  All
                </MenuItem>
                {difficultyList &&
                  difficultyList.map((ele) => (
                    <MenuItem key={ele.DifficultyId} value={ele.DifficultyId}>
                      {ele.DifficultyName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-2 mb-4 col-sm-6 col-12">
            <FormControl sx={{ width: "100%" }}>
              <InputLabel
                id="demo-multiple-name-label"
                sx={{
                  color: "#fada65",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#fada65",
                  },
                  "&.Mui-focused": {
                    color: "#fada65",
                  },
                }}
              >
                Category
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={category}
                onChange={handleCategory}
                label="Category"
                MenuProps={MenuProps}
                sx={{
                  backgroundColor: "#3d3189",
                  color: "#fada65",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Always set the border color to #fada65
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#fada65",
                  },
                }}
              >
                <MenuItem key={0} value={0}>
                  All
                </MenuItem>
                {categoryList &&
                  categoryList.map((ele) => (
                    <MenuItem key={ele.CategoryId} value={ele.CategoryId}>
                      {ele.CategoryName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 mb-4 col-sm-6 col-12 d-flex justify-content-end">
            <ViewQuizModal/>
            <CreateQuizModal/>
          </div>
          
        </div>

        <h4 className="text-white ms-2">
          {params.id.substring(0, 1).toUpperCase() + params.id.substring(1)}  Contest
        </h4>
        <div className="row">
          <QuizCard
          title='Tech Questions'
          description='This is A Quiz Competition'
          date='21 June 2025'
          categoryName='Technology'
          onClickHandler={ViewDetailsHandler}
          Link='gshgahGD@'
        />
          {/* {filteredData.length > 0 ? (
            filteredData.map((ele, idx) => (
              // <QuizCard
              //   title={ele.Title}
              //   description={ele.Description}
              //   date={ele.ScheduledDate}
              //   categoryName={ele.CategoryName}
              //   key={idx}
              //   onClickHandler={ViewDetailsHandler}
              //   Link={ele.QuizLink}
              // />
            ))
          ) : (
            // <img
            //   src={NO_DATA_FOUND}
            //   alt="No Data Available"
            //   style={{height:'500px',width:'500px'}}
            // />
            <h2 className="text-center text-white">No Data Available</h2>
          )} */}
        </div>
        {filteredData.length > 0 && (
          <div className={`${classes["pagination"]} mt-3`}>
            <FormControl
              sx={{
                m: 1,
                minWidth: 80,
              }}
              size="small"
            >
              <InputLabel
                id="demo-simple-select-autowidth-label"
                sx={{
                  color: "#fada65",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#fada65",
                  },
                  "&.Mui-focused": {
                    color: "#fada65",
                  },
                }}
              >
                Records
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={Records}
                onChange={handlePageSize}
                autoWidth
                label="Records"
                sx={{
                  backgroundColor: "#3d3189",
                  color: "#fada65",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Always set the border color to #fada65
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #fada65",
                    borderColor: "#fada65", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#fada65",
                  },
                }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              defaultPage={1}
              siblingCount={1}
              count={PageSize}
              variant="outlined"
              onChange={handlePageChange}
              sx={{
                "& .MuiButtonBase-root": {
                  backgroundColor: "#3d3189",
                  color: "#fada65",
                  border: "1px solid #fada65",
                  marginTop: "10px",
                  marginBottom: "10px",
                  "&:hover": {
                    backgroundColor: "#fada65",
                    color: "#000000",
                  },
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#fada65",
                  color: "#000000",
                  border: "1px solid #fada65",
                  "&:hover": {
                    backgroundColor: "#fada65",
                    color: "#000000",
                  },
                },
                "& .MuiPaginationItem-ellipsis": {
                  fontWeight: "bolder",
                  color: "#fada65",
                  "&:hover": {
                    color: "#fada65",
                  },
                },
                "@media (max-width: 600px)": {
                  flexDirection: "column",
                  rowGap: "10px",
                },
              }}
            />
          </div>
        )}
      </Box>
    </Box>
    
  );
};
export default AdminDashboard;
