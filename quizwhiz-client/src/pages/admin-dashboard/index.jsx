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
import CardComponent from "../../components/admin-cards/quiz-category";

import {
  faQuestionCircle,
  faCalendarAlt,
  faPlay,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DrawerHeader } from "../../components/admin-components";
import AdminSlider from "../../components/header/admin-header";
import QuizCard from "../../components/admin-cards/quiz-card";
import Pagination from "@mui/material/Pagination";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/admin-components";
import SearchIcon from "@mui/icons-material/Search";
import { getUserDetails } from "../../services/auth.service";
import {
  changeRecordsSize,
  filterByCategory,
  getAllStatusCount,
  getCategories,
  getDifficulties,
} from "../../services/admindashboard.service";
import jwtDecoder from "../../services/jwtDecoder";
import NO_DATA_FOUND from "../../assets/Server.gif";
import { statusEnum } from "../../utils/enum";
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
        SetSearchedWord('');
        const difficulties = await getDifficulties();
        const categories = await getCategories();
        const allData = await filterByCategory({
          StatusId: statusEnum[params.id],
          DifficultyId: 0,
          CategoryId: 0,
          CurrentPage: 1,
          SearchValue: '',
        });
        const data = allData.data.data.GetQuizzes;
        setDifficultyList(difficulties.data.data);
        setCategoryList(categories.data.data);
        SetFilteredData(data);
        const status = await getAllStatusCount();
        SetCountOfPending(status?.data?.data?.PendingCount);
        SetCountOfUpcoming(status?.data?.data?.UpcomingCount);
        SetCountOfActive(status?.data?.data?.ActiveCount);
        SetCountOfCompleted(status?.data?.data?.CompletedCount);
        console.log(allData);
        SetPageSize(allData?.data?.data?.Pagination?.TotalPages);
        setRecords(allData?.data?.data?.Pagination?.RecordSize);
        console.log(allData?.data?.data?.Pagination?.TotalPages);
      } catch (error) {
        SetFilteredData([]);
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [Records,params]);
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
    try{
    const result = await changeRecordsSize({
      recordSize: event.target.value,
    });
    }
    catch(error){
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
    console.log(searchedWord)
    try{
    const result = await filterByCategory({
      StatusId: statusEnum[params.id],
      DifficultyId: difficulty,
      CategoryId: category,
      CurrentPage: value,
      SearchValue: searchedWord,
    });
    SetFilteredData(result.data.data.GetQuizzes);
   }
   catch(error){
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

  return (
    <Box sx={{ display: "flex" }} className={`${classes["bgimage"]}`}>
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider
        firstName={firstName.toString()}
        lastName={lastName.toString()}
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
            <button className={` ${classes["add-quiz-btn"]} `}>Add Quiz</button>
          </div>
        </div>

        <h4 className="text-white ms-2">
          {params.id.substring(0, 1).toUpperCase() + params.id.substring(1)}{" "}
          Contest
        </h4>
        <div className="row">
          {filteredData.length > 0 ? (
            filteredData.map((ele, idx) => (
              <QuizCard
                title={ele.Title}
                description={ele.Description}
                date={ele.ScheduledDate}
                key={idx}
              />
            ))
          ) : Loading ? (
            // <img
            //   src={NO_DATA_FOUND}
            //   alt="No Data Available"
            //   style={{height:'500px',width:'500px'}}
            // />
            <h2 className="text-center bg-white">No Data Available</h2>
          ) : (<h1>Loading...</h1>)}
        </div>
        {filteredData.length > 0 && (
          <div className="d-flex justify-content-between mt-3 align-items-center">
            <FormControl
              sx={{
                m: 1,
                minWidth: 80,
                "& .MuiInputLabel-root": {
                  color: "white",
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiOutlinedInput-root": {
                  background: "#3d3189",
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiSelect-icon": { color: "white" },
              }}
              size="small"
            >
              <InputLabel id="demo-simple-select-autowidth-label">
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
                  color: "white",
                  "& .MuiSvgIcon-root": { color: "white" },
                }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={PageSize}
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
                  // backgroundColor: "#5f071c",
                  color: "#fbd0da",
                  "&:hover": {
                    backgroundColor: "#fbd0da",
                    color: "#5f071c",
                  },
                },
                "& .MuiPaginationItem-ellipsis": {
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#fbd0da",
                  },
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
