import { React, useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import classes from "./style.module.css";
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
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/admin-components";
import SearchIcon from "@mui/icons-material/Search";
import { getUserDetails } from "../../services/auth.service";
import {
  filterByCategory,
  getCategories,
  getDifficulties,
} from "../../services/admindashboard.service";
import jwtDecoder from "../../services/jwtDecoder";
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
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [difficultyList, setDifficultyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [DifficultyId, setDifficultyId] = useState(0);
  const [CategoryId, SetcategoryId] = useState(0);
  const [Records, setRecords] = useState(4);
  const [PageSize, SetPageSize] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [filteredData, SetFilteredData] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  // const

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDifficulties();
        const result1 = await getCategories();
        const allData = await filterByCategory({
          StatusId: 1,
          DifficultyId: 0,
          CategoryId: 0,
          CurrentPage: 1,
        });
        const Data = allData.data.data.GetQuizzes;
        setDifficultyList(result.data.data);
        setCategoryList(result1.data.data);
        SetFilteredData(Data);
        // SetPageSize(result?.data?.data?.Pagination.PageSize);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const navigateToCategory = (id) => {
    if (id === "pending") navigate(`/admin-dashboard`);
    else navigate(`/admin-dashboard/${id}`);
  };

  const handlePageSize = (event) => {
    setRecords(event.target.value);
  };

  const handleDifficulty = async (event) => {
    setDifficulty(event.target.value);
    const result = await filterByCategory({
      StatusId: 1,
      DifficultyId: 0,
      CategoryId: 0,
      CurrentPage: 1,
    });
    const filteredData = result.data.data.GetQuizzes;
    SetFilteredData(filteredData);
  };

  const handlePageChange = async (event, value) => {
  };

  const handleCategory = async (e) => {
    setCategory(e.target.value);
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
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <Box
      sx={{ display: "flex" }}
      className={`${classes["bgimage"]}`}
    >
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider
        firstname={firstName.toString()}
        lastname={lastName.toString()}
        username={username}
      />
      {/* Main Content */}
      <Box className={`container`} component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div className="mt-5 row">
          <CardComponent
            count={3}
            text="Upcoming"
            icon={faCalendarAlt}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={5}
            text="Active"
            icon={faPlay}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={2}
            text="Completed"
            icon={faCheckCircle}
            onClickHandler={navigateToCategory}
            active={"total"}
          />
          <CardComponent
            count={10}
            text="Pending"
            icon={faQuestionCircle}
            onClickHandler={navigateToCategory}
            active={"pending"}
          />
        </div>
        <div className="d-flex  align-items-center flex-wrap column-gap-2 my-2">
          <Search sx={{ height: 55, width: 40 }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "#5f071c" }} />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ height: 55 }}
              placeholder="Search…"
            />
          </Search>
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="demo-multiple-name-label">Difficulty</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={difficulty}
              onChange={handleDifficulty}
              label="Difficulty"
              MenuProps={MenuProps}
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
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="demo-multiple-name-label">Category</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={category}
              onChange={handleCategory}
              label="Category"
              MenuProps={MenuProps}
            >
              <MenuItem key={0} value={0}>
                All
              </MenuItem>
              {categoryList &&
                categoryList.map((ele) => (
                  <MenuItem key={ele.CategoryId} value={ele.CategoryName}>
                    {ele.CategoryName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <button className={`${classes["add-quiz-btn"]}`}>Add Quiz</button>
        </div>
        <h4>Pending Contest</h4>
        <div className="row">
          {filteredData &&
            filteredData.map((ele, idx) => (
              <QuizCard
                title={ele.Title}
                description={ele.Description}
                date={ele.ScheduledDate}
                key={idx}
              />
            ))}
        </div>
        <div className="d-flex justify-content-between mt-3 align-items-center">
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="demo-simple-select-autowidth-label">
              Page
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={Records}
              onChange={handlePageSize}
              autoWidth
              label="Page"
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
export default AdminDashboard;
