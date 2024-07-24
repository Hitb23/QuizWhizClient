import { React, Fragment, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import classes from "./style.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { DrawerHeader } from "../../components/admin-components";
import QuizCard from "../../components/admin-cards/quiz-card";
import Pagination from "@mui/material/Pagination";
import { getUserDetails } from "../../services/auth.service";
import {
  changeRecordsSize,
  filterByCategory,
  getAllStatusCount,
  getCategories,
  getDifficulties,
} from "../../services/admindashboard.service";
import jwtDecoder from "../../services/jwtDecoder";
import QuizHeader from "../../components/header/quizzes-header";
import { PacmanLoader } from "react-spinners";
import { border } from "@mui/system";
import { BorderAll, BorderColorSharp } from "@mui/icons-material";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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

const Quizzes = () => {
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
  const [tabStatus, setTabStatus] = useState(2);
  const [toggleTabs, setToggleTabs] = useState(1);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
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
          StatusId: tabStatus,
          DifficultyId: 0,
          CategoryId: 0,
          CurrentPage: 1,
          SearchValue: "",
        });
        const data = allData.data.data.GetQuizzes;
        setDifficultyList(difficulties.data.data);
        setCategoryList(categories.data.data);
        SetFilteredData(data);

        const status = await getAllStatusCount();
        SetPageSize(allData?.data?.data?.Pagination?.TotalPages);
        setRecords(allData?.data?.data?.Pagination?.RecordSize);
        setIsLoading(false);
      } catch (error) {
        SetFilteredData([]);
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [Records, params]);

  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl("https://localhost:44361/quizhub")
      .withAutomaticReconnect()
      .build();

    setConnection(conn);

    console.log(params.quizLink);

    conn.on(`ReceiveRemainingTime_${params.quizLink}`, (minutes, seconds) => {
      setRemainingMinutes(minutes);
      setRemainingSeconds(seconds);
      setIsLoading(false);
    });

    conn.start().catch((error) => console.error("Connection failed: ", error));
  }, []);

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

    // const steps = [
    //   {
    //     element: '#completedQuizzes',
    //     popover: {
    //       title: 'Quizzes completed',
    //       description: 'This displays the information about the completed quizzes',
    //       position: 'left',
    //       className: 'info-popover'
    //     }
    //   },
    //   {
    //     element: '#participatedQuizzes',
    //     popover: {
    //       title: 'Quizzes participated',
    //       description: 'This displays the information about the participated quizzes',
    //       position: 'right',
    //       className: 'info-popover'
    //     }
    //   },
    //   {
    //     element: '#demo-theme',
    //     popover: {
    //       title: 'Style However You Want',
    //       description: 'You can use the default class names and override the styles or you can pass a custom class name to the popoverClass option either globally or per step.',
    //       position: 'bottom',
    //       className: 'info-popover'
    //     }
    //   }
    // ];

    // const driverInstance = driver({
    //   popoverClass: 'driverjs-theme',
    //   animate: false,
    //   showProgress: false,
    //   showButtons: ["next", "previous", "close"],
    //   steps: steps
    // });

    // driverInstance.drive();
  }, []);

  const handlePageSize = async (event) => {
    SetCurrentPage(1);
    setRecords(event.target.value);

    try {
      const result1 = await changeRecordsSize({
        recordSize: event.target.value,
      });
    } catch (error) {
      SetFilteredData([]);
    }
  };

  const handleDifficulty = async (event) => {
    SetCurrentPage(1);
    setDifficulty(event.target.value);
    try {
      const result = await filterByCategory({
        StatusId: tabStatus,
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
    SetCurrentPage(value);
    // console.log(searchedWord);
    try {
      const result = await filterByCategory({
        StatusId: tabStatus,
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
        StatusId: tabStatus,
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
      });
      SetFilteredData(result.data.data.GetQuizzes);
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
      SetCurrentPage(1);
    } catch (error) {
      console.log("error:", error);
      SetFilteredData([]);
    }
  };

  const ViewDetailsHandler = (e) => {
    navigate(`/admin-dashboard/${params.id}/${e}`);
  };

  const handleCategory = async (e) => {
    setCategory(e.target.value);
    try {
      const result = await filterByCategory({
        StatusId: tabStatus,
        DifficultyId: difficulty,
        CategoryId: e.target.value,
        CurrentPage: currentPage,
        SearchValue: searchedWord,
      });
      const filteredData = result.data.data.GetQuizzes;
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
      SetFilteredData(filteredData);
      SetCurrentPage(1);
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

  const toggleTabsChange = async (index) => {
    setToggleTabs(index);
    SetCurrentPage(1);
    var quizStatus = 1;
    index === 0 ? (setTabStatus(3), (quizStatus = 3)) : null;
    index === 1 ? (setTabStatus(2), (quizStatus = 2)) : null;
    index === 2 ? (setTabStatus(4), (quizStatus = 4)) : null;
    index === 3 ? (setTabStatus(4), (quizStatus = 4)) : null;

    console.log(quizStatus);
    try {
      const result = await filterByCategory({
        StatusId: quizStatus,
        DifficultyId: difficulty,
        CategoryId: category,
        CurrentPage: 1,
        SearchValue: searchedWord,
      });
      const filteredData = result.data.data.GetQuizzes;
      SetFilteredData(filteredData);
      SetPageSize(result?.data?.data?.Pagination?.TotalPages);
      SetCurrentPage(1);
    } catch (error) {
      SetFilteredData([]);
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex" }} className={`${classes["bgimage"]}`}>
        <CssBaseline />
        {/* Admin offcanvas with navbar */}
        <QuizHeader
          firstName={firstName}
          lastName={lastName}
          uploadCount={uploadCount}
          userName={jwtDecoder().userName}
        />
        {/* Main Content */}
        <Box
          className={`container`}
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <DrawerHeader />
          <div className="row mt-5 p-0">
            <ul className={`nav nav-tabs mb-3 ${classes["tabs"]}`}>
              <li className={`nav-item`}>
                <button
                  className={`nav-link ${
                    toggleTabs === 0 ? classes["tab-active"] : classes["tab"]
                  }`}
                  onClick={() => toggleTabsChange(0)}
                >
                  Active
                </button>
              </li>
              <li className={`nav-item`}>
                <button
                  className={`nav-link ${
                    toggleTabs === 1 ? classes["tab-active"] : classes["tab"]
                  }`}
                  onClick={() => toggleTabsChange(1)}
                >
                  Upcoming
                </button>
              </li>
              <li className="nav-item">
                <button
                  id="completedQuizzes"
                  className={`nav-link ${
                    toggleTabs === 2 ? classes["tab-active"] : classes["tab"]
                  }`}
                  onClick={() => toggleTabsChange(2)}
                >
                  Completed
                </button>
              </li>
              <li className="nav-item">
                <button
                  id="participatedQuizzes"
                  className={`nav-link ${
                    toggleTabs === 3 ? classes["tab-active"] : classes["tab"]
                  }`}
                  onClick={() => toggleTabsChange(3)}
                >
                  Participated
                </button>
              </li>
            </ul>
            <div className="col-lg-2 p-2 col-sm-6 col-12">
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
            <div className="col-lg-2 p-2 col-sm-6 col-12">
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
            <div className="col-lg-2 p-2 col-sm-6 col-12">
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
          </div>
          <div className="row p-0 ms-2">
            {filteredData.length > 0 ? (
              filteredData.map((ele, idx) => (
                <QuizCard
                  title={ele.Title}
                  description={ele.Description}
                  scheduledDate={ele.ScheduledDate}
                  categoryId={ele.CategoryId}
                  difficultyId={ele.DifficultyId}
                  key={idx}
                  totalMarks={ele.TotalMarks}
                  totalQuestions={ele.TotalQuestion}
                  onClickHandler={ViewDetailsHandler}
                  statusId={tabStatus}
                  quizLink={ele.QuizLink}
                />
              ))
            ) : isLoading == true ? (
              <PacmanLoader
                className="position-absolute top-50 start-50 translate-middle p-0"
                color="#fada65"
              />
            ) : (
              <h2 className="text-center text-white my-5">No Data Available</h2>
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
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </FormControl>
              <Pagination
                defaultPage={1}
                siblingCount={1}
                page={currentPage}
                count={PageSize}
                variant="outlined"
                onChange={handlePageChange}
                className="p-0"
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
    </Fragment>
  );
};
export default Quizzes;
