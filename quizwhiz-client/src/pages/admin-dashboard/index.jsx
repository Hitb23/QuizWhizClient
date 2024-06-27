import { React, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import classes from "./style.module.css";
import { Category } from "../../utils/dummyData";
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

const names = ["Easy", "Medium", "Hard"];
const QuizCategory = ["Science", "General Knowledge", "Sports"];

const AdminDashboard = () => {
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [difficultyList, setDifficultyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [Records, setRecords] = useState(4);
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDifficulties();
        const result1 = await getCategories();
        setDifficultyList(result.data.data);
        setCategoryList(result1.data.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  },[]);

  const navigateToCategory = (id) => {
    if (id === "pending") navigate(`/admin-dashboard`);
    else navigate(`/admin-dashboard/${id}`);
  };

  const handlePageSize = (event) => {
    setRecords(event.target.value);
  };
  
  const handleDifficulty = async (event) => {
    console.log("hello")
     setDifficulty(event.target.value);
    // public required int StatusId { get; set; }

    // public required int DifficultyId { get; set; }

    // public required int CategoryId { get; set; }

    // public required int CurrentPage { get; set; }
     const result = await filterByCategory({StatusId:4,DifficultyId:event.target.value,CategoryId:2,CurrentPage:1});
    // console.log(result)
  };

  const handlePageChange = async (event, value) => {
    console.log(value)
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };
  return (
    <Box sx={{ display: "flex" }} className={`${classes["bgimage"]}`}>
      <CssBaseline />
      {/* Admin offcanvas with navbar */}
      <AdminSlider />
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
              <SearchIcon sx={{ color: "#F47D0A" }} />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ height: 55 }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
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
              {categoryList &&
                categoryList.map((ele) => (
                  <MenuItem key={ele.CategoryId} value={ele.CategoryName}>
                    {ele.CategoryName}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <button className={`${classes["add-quiz-btn"]}`}>Add Quiz</button>
        </div>
        <h4>Pending Contest</h4>
        <div className="row">
          {Category.map((ele, idx) => (
            <QuizCard
              title={ele.title}
              description={ele.description}
              date={ele.date}
              time={ele.time}
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
            count={10}
            color="primary"
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "white",
                color: "black",
                "&:hover": {
                  backgroundColor: "#F47D0A",
                  color: "#ffffff",
                },
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#F47D0A",
                color: "#ffffff",
              },
              "& .MuiPaginationItem-ellipsis": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#ffffff",
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
