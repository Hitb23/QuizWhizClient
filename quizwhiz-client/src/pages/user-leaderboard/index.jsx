import { Fragment, useEffect, useState } from "react";
import QuizHeader from "../../components/header/quizzes-header";
import classes from "./style.module.css";
import { Trophy, Money, NoDataFound } from "../../assets";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import jwtDecoder from "../../services/jwtDecoder";
import { getQuizLeaderboardData } from "../../services/quizSocket.service";
import { BeatLoader } from "react-spinners";
import { HiUsers } from "react-icons/hi2";
import { BsFillTrophyFill } from "react-icons/bs";
import { MdCurrencyRupee } from "react-icons/md";
import { changeLeaderboardRecordsSize } from "../../services/admindashboard.service";
import { border } from "@mui/system";

const UserSideLeaderboard = () => {
  const params = useParams();
  const user = jwtDecoder();
  const username = user["Username"];
  const [records, setRecords] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [searchedWord, setSearchedWord] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [prizeMoney, setPrizeMoney] = useState(0);
  const [superText, setSuperText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNoParticipation, setIsNoParticipation] = useState(null);
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const participatedSegment = pathSegments.includes("participated");
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const getleaderBoardData = async () => {
      const data = {
        QuizLink: params.quizLink,
        Username: username,
        SearchedWord: searchedWord,
        CurrentPage: currentPage,
        PageSize: pageSize,
      };
      try {
        const participantsData = await getQuizLeaderboardData(data).then(
          (leaderBoardData) => {
            console.log(leaderBoardData);
            setLeaderBoardData(leaderBoardData?.data?.QuizParticipants);
            setQuizTitle(leaderBoardData?.data?.QuizParticipants[0]?.QuizTitle);
            setUserScore(
              leaderBoardData?.data?.QuizParticipants[0]?.AchievedScore
            );
            setPrizeMoney(
              leaderBoardData?.data?.QuizParticipants[0]?.PrizeMoney
            );
            setTotalMarks(
              leaderBoardData?.data?.QuizParticipants[0]?.TotalMarks
            );
            setUserRank(
              leaderBoardData?.data?.QuizParticipants[0]?.PersonalRank
            );
            setPageSize(leaderBoardData?.data?.Pagination?.TotalPages);
            setRecords(leaderBoardData?.data?.Pagination?.RecordSize);
            setTotalParticipants(
              leaderBoardData?.data?.QuizParticipants[0]?.TotalParticipants
            );
            const userrank =
              leaderBoardData?.data?.QuizParticipants[0]?.PersonalRank;
            let superText = "th";
            if (userrank === 1) superText = "st";
            else if (userrank === 2) superText = "nd";
            else if (userrank === 3) superText = "rd";
            setSuperText(superText);
            console.log(
              leaderBoardData?.data?.QuizParticipants[0]?.TotalParticipants
            );
            if (isNoParticipation == null) {
              if (
                leaderBoardData?.data?.QuizParticipants[0]?.TotalParticipants ==
                  undefined ||
                leaderBoardData?.data?.QuizParticipants[0]?.TotalParticipants ==
                  0
              ) {
                console.log("true");
                setIsNoParticipation(true);
              } else {
                console.log("false");
                setIsNoParticipation(false);
              }
            }
            setIsLoading(false);
            return leaderBoardData;
          }
        );
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getleaderBoardData();
  }, [records]);

  const handlePageSize = async (event) => {
    setRecords(event.target.value);
    setCurrentPage(1);
    try {
      const result = await changeLeaderboardRecordsSize({
        recordSize: event.target.value,
      });
    } catch (error) {
      setleaderBoardData([]);
    }
  };
  const handlePageChange = async (event, value) => {
    setCurrentPage(value);
    const data = {
      QuizLink: params.quizLink,
      Username: username,
      SearchedWord: searchedWord,
      CurrentPage: value,
      PageSize: pageSize,
    };
    try {
      const leaderBoardData = await getQuizLeaderboardData(data);
      setLeaderBoardData(leaderBoardData?.data?.QuizParticipants);
      setPageSize(leaderBoardData?.data?.Pagination?.TotalPages);
      setRecords(leaderBoardData?.data?.Pagination?.RecordSize);
    } catch (error) {
      setleaderBoardData([]);
    }
  };

  const searchHandler = async (e) => {
    const word = e.target.value;
    setSearchedWord(word);
    setCurrentPage(1);
    const data = {
      QuizLink: params.quizLink,
      Username: username,
      SearchedWord: word,
      CurrentPage: 1,
      PageSize: pageSize,
    };
    try {
      const leaderBoardData = await getQuizLeaderboardData(data);
      setLeaderBoardData(leaderBoardData?.data?.QuizParticipants);
      setPageSize(leaderBoardData?.data?.Pagination?.TotalPages);
    } catch (error) {
      console.log("error:", error);
      setleaderBoardData([]);
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex" }} className={`${classes["full-screen"]}`}>
        <QuizHeader />
        <div className={`${classes["container-box"]} container py-4`}>
          <div className="d-flex gap-2 py-3 align-items-center">
            <h1 className="m-0 d-flex justify-content-center align-items-center">
              <FaRightLong color="#fada65" />
            </h1>
            <h1 className="m-0" style={{ color: "#fada65" }}>
              Leaderboard
            </h1>
          </div>
          {!userRank ? (
            <div className="d-flex justify-content-between flex-wrap py-3 row-gap-2 column-gap-2">
              <div className="d-flex align-items-center">
                <h2
                  className={`${classes["score"]} m-0`}
                  style={{ color: "#fada65" }}
                >
                  {quizTitle}
                  {/* {quizTitle?.length < 12
                    ? quizTitle
                      ? quizTitle
                      : ""
                    : quizTitle
                    ? quizTitle?.substring(0, 12) + "..."
                    : ""} */}
                </h2>
              </div>
              {isNoParticipation == false && (
                <div className="d-flex row-gap-1 column-gap-2 py-2 justify-content-end">
                  <div
                    className={`${classes["score-no"]} m-0 px-2 py-2 rounded`}
                    style={{ color: "#fada65", border: "1px solid #fada65" }}
                  >
                    <HiUsers size={30} /> {totalParticipants}
                  </div>
                  <div
                    className={`${classes["score-no"]} m-0 px-2 py-2 rounded img-fluid`}
                    style={{ color: "#fada65", border: "1px solid #fada65" }}
                  >
                    <img src={Money} height={30} /> {prizeMoney}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`${classes["trophy-section"]} d-flex justify-content-center py-5`}
            >
              <div className={`${classes["user-details"]} d-flex flex-column`}>
                <div className="d-flex justify-content-between pt-2 py-4 gap-2">
                  <div className="d-flex justify-content-center align-items-center img-fluid">
                    <img
                      src={Trophy}
                      height={140}
                      width={160}
                      className={`${classes["trophy-image"]}`}
                    />
                  </div>
                  <div
                    className="pb-2 pt-2 text-center align-self-lg-stretch px-5 rounded-3"
                    style={{ border: "1px solid #fada65" }}
                  >
                    <h4
                      style={{ color: "#fada65" }}
                      className={`${classes["rank-title"]} fs-1 fw-bold m-0 py-3`}
                    >
                      Rank
                    </h4>
                    <h3
                      style={{ color: "#fada65" }}
                      className={`${classes["rank"]} fs-1 fw-bold m-0 py-3`}
                    >
                      {userRank}
                    </h3>
                  </div>
                  <div className="d-flex justify-content-center align-items-center  img-fluid">
                    <img
                      src={Trophy}
                      height={140}
                      width={160}
                      className={`${classes["trophy-image"]}`}
                    />
                  </div>
                </div>
                <div className="container-fluid m-0 p-0 py-2 d-flex justify-content-center align-items-center ">
                  <div className="row col-12 row-gap-2 m-0 flex-wrap">
                    <div
                      className="text-center col-md-6 d-flex justify-content-start align-items-center p-0"

                      // style={{ boxShadow: "0px 0px 5px 2px #fada65" }}
                    >
                      <div
                        className="col-12 col-md-11 py-3 m-0 p-0"
                        style={{
                          border: "1px solid #fada65",
                          borderRadius: "5px",
                        }}
                      >
                        <h3
                          style={{ color: "#fada65" }}
                          className={`${classes["score"]} m-0`}
                        >
                          Score
                        </h3>
                        <h5
                          style={{ color: "#fada65" }}
                          className={`${classes["score-no"]} m-0`}
                        >
                          {userScore}/
                          <span
                            style={{ color: "#fada65" }}
                            className={`${classes["score-no"]}`}
                          >
                            {totalMarks}
                          </span>
                        </h5>
                      </div>
                    </div>
                    <div
                      className="text-center col-md-6  d-flex justify-content-end align-items-center p-0"
                      // style={{ boxShadow: "0px 0px 5px 2px #fada65" }}
                    >
                      <div
                        className="col-12 col-md-11 py-3 m-0 p-0"
                        style={{
                          border: "1px solid #fada65",
                          borderRadius: "5px",
                        }}
                      >
                        <h3
                          style={{ color: "#fada65" }}
                          className={`${classes["score"]} m-0`}
                        >
                          Participants
                        </h3>
                        <h5
                          style={{ color: "#fada65" }}
                          className={`${classes["score-no"]} m-0`}
                        >
                          {totalParticipants}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className="table-responsive container p-5 px-4 shadow-lg rounded"
            style={{ border: "1px solid #fada65" }}
          >
            {isNoParticipation == false && (
              <TextField
                variant="outlined"
                placeholder="Search"
                onChange={searchHandler}
                className="mb-3"
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#fada65" }} />
                    </InputAdornment>
                  ),
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fada65",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fada65",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fada65",
                    },
                    "& input": {
                      color: "#fada65",
                    },
                  },
                }}
              />
            )}
            {leaderBoardData?.length > 0 ? (
              <table
                className="w-100 table table-hover"
                style={{ borderBottomColor: "#fada65" }}
              >
                <thead className="bg-primary ">
                  <tr>
                    <th
                      className={`${classes["table-design"]} py-4 px-1`}
                      scope="col"
                    >
                      #Rank
                    </th>
                    <th
                      className={`${classes["table-design"]} py-4 px-1`}
                      scope="col"
                    >
                      Username
                    </th>
                    <th
                      className={`${classes["table-design"]} py-4 text-center`}
                      scope="col"
                    >
                      Score
                    </th>
                    <th
                      className={`${classes["table-design"]} py-4 text-center`}
                      scope="col"
                    >
                      Prize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderBoardData.map((user, index) => (
                    <tr key={index} style={{ color: "#fada65" }}>
                      <th
                        className={`${classes["table-design"]} ${classes["user-data"]} px-1 p-4 my-auto`}
                        scope="row"
                      >
                        {user.Rank}
                      </th>
                      <td
                        className={`${classes["table-design"]} ${classes["user-data"]} px-1 p-4 my-auto`}
                      >
                        {/* <img height={30} src={AvatarPerson} /> */}
                        <span> {user.Username}</span>
                      </td>
                      <td
                        className={`${classes["table-design"]} ${classes["user-data"]} px-1 p-4 my-auto text-center`}
                      >
                        {user.Score}/{totalMarks}
                      </td>
                      <td
                        className={`${classes["table-design"]} ${classes["user-data"]} px-1 p-4 my-auto  text-center`}
                      >
                        {user.Prize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : isLoading ? (
              <BeatLoader color="#fada65" className="text-center" />
            ) : (
              <div className="row p-0">
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <h2
                    className={`${classes["no-data-found"]} text-center mt-5`}
                    style={{ color: "#fada65" }}
                  >
                    No Data Available
                  </h2>
                  <img src={NoDataFound} width="300px" height="300px" />
                </div>
              </div>
            )}
          </div>
          {isNoParticipation == false && (
            <div
              className={`${classes["pagination"]} d-flex justify-content-between mt-3 flex-wrap`}
            >
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
                  value={records}
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
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
              <Pagination
                defaultPage={1}
                siblingCount={1}
                page={currentPage}
                count={pageSize}
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
        </div>
      </Box>
    </Fragment>
  );
};

export default UserSideLeaderboard;
