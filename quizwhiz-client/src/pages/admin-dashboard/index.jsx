import { React, useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { SlNote } from "react-icons/sl";
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
import { useNavigate, useParams } from "react-router-dom";
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
import EditQuizModal from "../../components/dialog-boxes/edit-quiz-details";
import QuizEditTable from "../../components/admin-quiz-edit";
import { HashLoader } from "react-spinners";

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
  const [Records, setRecords] = useState(5);
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
  const childRef = useRef(null);
  var username = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        const data = allData.data.data.GetQuizzes;
        setDifficultyList(difficulties.data.data);
        setCategoryList(categories.data.data);
        SetFilteredData(data);
        console.log(data);
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

  const changeOrderOnClick = async (name, isDataAscending) => {
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
        IsAscending: isDataAscending,
        FilterBy: name,
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

  const ViewDetailsHandler = (e) => {
    navigate(`/admin-dashboard/${params.id}/${e}`);
  };
  const onDeleteHandler = async () => {
    try {
      const result = await filterByCategory({
        StatusId: statusEnum[params.id],
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
        IsAscending: true,
        FilterBy: "",
      });
      SetFilteredData(result.data.data.GetQuizzes);
    } catch (error) {
      console.log("error:", error);
      SetFilteredData([]);
    }
    try {
      const status = await getAllStatusCount();
      SetCountOfPending(status?.data?.data?.PendingCount);
      SetCountOfUpcoming(status?.data?.data?.UpcomingCount);
      SetCountOfActive(status?.data?.data?.ActiveCount);
      SetCountOfCompleted(status?.data?.data?.CompletedCount);
      SetPageSize(allData?.data?.data?.Pagination?.TotalPages);
      setRecords(allData?.data?.data?.Pagination?.RecordSize);
    } catch (error) {
      console.log(error);
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
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        overflow: "auto",
      },
    },
    disablePortal: true,
  };

  return (
    <div
      className={`${classes["bgimage"]} ${classes["specific-page"]} d-flex m-0 bg-white`}
    >
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider
        firstName={firstName}
        lastName={lastName}
        uploadCount={uploadCount}
        userName={jwtDecoder().userName}
      />
      {/* Main Content */}
      <Box
        className={`container ${classes["h-100vh"]}`}
        component="main"
        sx={{ boxSizing: "border-box", p: 3 }}
        style={{ background: "white" }}
      >
        <DrawerHeader />
        <div className={`mt-5 row`}>
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
                backgroundColor: "#fffff",
                color: "#3d3189 !important",
                boxShadow: "none",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "1px solid #3d3189",
                    color: "#3d3189",
                    borderColor: "#3d3189",
                  },
                  "&:hover fieldset": {
                    border: "1px solid #3d3189",
                    color: "#3d3189",
                    borderColor: "#3d3189",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189",
                  },
                  "& .MuiInputBase-input": {
                    color: "#3d3189",
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#3d3189", // Set initial label color
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#3d3189", // Set hover label color
                  },
                  "&.Mui-focused": {
                    color: "#3d3189", // Set focused label color
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
                  color: "#21201e",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#21201e",
                  },
                  "&.Mui-focused": {
                    color: "#21201e",
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
                  backgroundColor: "#fffff",
                  color: "#21201e",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Always set the border color to #21201e
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#3d3189",
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
                  color: "#21201e",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#21201e",
                  },
                  "&.Mui-focused": {
                    color: "#21201e",
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
                  backgroundColor: "#fffff",
                  color: "#21201e",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Always set the border color to #21201e
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #3d3189",
                    borderColor: "#3d3189", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#3d3189",
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
            <CreateQuizModal />
          </div>
        </div>

        <h4 className="ms-2 text-black my-3">
          {params.id.substring(0, 1).toUpperCase() + params.id.substring(1)}{" "}
          Contest
        </h4>
        <div className="row">
          {filteredData.length > 0 ? (
            // <QuizCard
            //   title={ele.Title}
            //   description={ele.Description}
            //   date={ele.ScheduledDate}
            //   categoryName={ele.CategoryName}
            //   key={idx}
            //   onClickHandler={ViewDetailsHandler}
            //   Link={ele.QuizLink}
            // />
            <QuizEditTable
              parentFunction={changeOrderOnClick}
              data={filteredData}
              Status={params.id}
              reload={onDeleteHandler}
            />
          ) : (
            // <img
            //   src={NO_DATA_FOUND}
            //   alt="No Data Available"
            //   style={{height:'500px',width:'500px'}}
            // />
            <div className="d-flex justify-content-center align-items-center">
              {difficultyList.length <= 0 ? (
                <HashLoader
                  className="text-center me-2 mt-5"
                  style={{ color: "#a89ee9" }}
                />
              ) : (
                <h2 style={{ color: "#3d3189" }}>No Data Found</h2>
              )}
            </div>
          )}
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
                  color: "#21201e",
                  paddingLeft: "0.2rem",
                  paddingRight: "0.2rem",
                  "&:hover": {
                    color: "#21201e",
                  },
                  "&.Mui-focused": {
                    color: "#21201e",
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
                MenuProps={menuProps}
                sx={{
                  backgroundColor: "#fffff",
                  color: "#21201e",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #21201e",
                    borderColor: "#21201e", // Always set the border color to #21201e
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #21201e",
                    borderColor: "#21201e", // Maintain the border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #21201e",
                    borderColor: "#21201e", // Maintain the border color on hover
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#21201e",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15 </MenuItem>
              </Select>
            </FormControl>
            {/* <select class="form-select form-select-lg mb-3"  aria-label=".form-select-lg example"  value={Records}
                onChange={handlePageSize}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select> */}
            {/* <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Records</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={Records}
                onChange={handlePageSize}
          autoWidth
          label="Records"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
      </FormControl> */}
            <Pagination
              defaultPage={1}
              siblingCount={1}
              count={PageSize}
              variant="outlined"
              onChange={handlePageChange}
              sx={{
                "& .MuiButtonBase-root": {
                  backgroundColor: "#fffff",
                  color: "#21201e",
                  border: "1px solid #21201e",
                  marginTop: "10px",
                  marginBottom: "10px",
                  "&:hover": {
                    backgroundColor: "#3d3189",
                    color: "white",
                  },
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#3d3189",
                  color: "white",
                  border: "1px solid #21201e",
                  "&:hover": {
                    backgroundColor: "#a89ee9",
                    color: "#000000",
                  },
                },
                "& .MuiPaginationItem-ellipsis": {
                  fontWeight: "bolder",
                  color: "#21201e",
                  "&:hover": {
                    color: "#21201e",
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
    </div>
  );
};
export default AdminDashboard;
