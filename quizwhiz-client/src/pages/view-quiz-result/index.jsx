import React, { useEffect, useState } from "react";
import classes from "./style.module.css";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import QuizHeader from "../../components/header/quizzes-header";
import { HashLoader } from "react-spinners";
import jwtDecoder from "../../services/jwtDecoder";
import {
  getQuizDetailsByLink,
  getQuizLeaderboard,
  changeLeaderboardRecordsSize,
  getQuizParticipantsCount,
} from "../../services/admindashboard.service";
import AdminSlider from "../../components/header/admin-header";
import { NoDataFound } from "../../assets";

const ViewQuizResult = () => {
  const { quizLink } = useParams();
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [quizdetail, setQuizDetail] = useState({});
  const [PaticipantDetails, setParticipant] = useState([]);
  const [Records, setRecords] = useState(10);
  const [PageSize, SetPageSize] = useState(1);
  const [currentPage, SetCurrentPage] = useState(1);
  const [totalPage, SetTotalPage] = useState(1);
  const [totalParticipant, setTotalParticipant] = useState(0);
  const [searchedWord, SetSearchedWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getParticipantsByRank = (rank) => {
    return PaticipantDetails.filter((participant) => participant.rank === rank);
  };
  const fetchQuizDetails = async () => {
    const response = await getQuizDetailsByLink(quizLink);
    if (response) {
      setIsUrlValid(true);
      setQuizDetail(response.data);
      const result = await changeLeaderboardRecordsSize({
        recordSize: Records,
      });
      const CountData = await getQuizParticipantsCount(quizLink);
      if (CountData) {
        setTotalParticipant(CountData.data);
      }
      const ress = await getQuizLeaderboard({
        QuizLink: quizLink,
        SearchedWord: searchedWord,
        CurrentPage: currentPage,
        PageSize: PageSize,
      });

      if (ress != null && ress.data != null) {
        setParticipant(ress?.data?.QuizParticipants);
        SetPageSize(ress?.data?.Pagination.PageSize);
        SetCurrentPage(ress?.data?.Pagination.CurrentPage);
        SetTotalPage(ress?.data?.Pagination.TotalPages);
      }
    } else {
      setIsUrlValid(false);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchQuizDetails();
  }, [Records, currentPage, searchedWord]);

  const handlePageSize = async (event) => {
    setRecords(event.target.value);
    SetCurrentPage(1);
    try {
      const result = await changeLeaderboardRecordsSize({
        recordSize: event.target.value,
      });
    } catch (error) {
      setParticipant([]);
    }
  };

  const handlePageChange = async (event, value) => {
    try {
      SetCurrentPage(value);
    } catch (error) {
      setParticipant([]);
    }
  };

  const searchHandler = async (e) => {
    try {
      const searchedWord = e.target.value;
      SetSearchedWord(searchedWord);
      SetCurrentPage(1);
    } catch (error) {
      setParticipant([]);
    }
  };
  const renderLeaderBoard = () => {
    return (
      <div className="container">
        <div className="row p-0 m-0 d-flex justify-content-center align-items-center">
          <div className="col-md-12">
            <div className={` ${classes["title-div"]} py-2`}>
              <div>
                <Typography variant="h4" className="p-0 m-0 fw-bolder">
                  {quizdetail.Title} Leaderboard
                </Typography>
              </div>
              {/* <div className={classes["quiz-name-div"]}>
            <Typography variant="h6" className="p-0 m-0"></Typography>
          </div> */}
            </div>
            {totalParticipant.length !== 0 ? (
              <div className="content">
                <div
                  className={`${classes["main-info-div"]} py-3 row-gap-3 d-flex `}
                >
                  <div className="col-sm-4 col-12">
                    <TextField
                      id="outlined-basic"
                      label="Search"
                      variant="outlined"
                      onChange={searchHandler}
                      className="col-md-8 col-sm-12 col-12"
                      value={searchedWord}
                      sx={{
                        backgroundColor: "#fffff",
                        color: "#21201e !important",
                        boxShadow: "none",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "1px solid #21201e",
                            color: "#21201e",
                            borderColor: "#21201e",
                          },
                          "&:hover fieldset": {
                            border: "1px solid #21201e",
                            color: "#21201e",
                            borderColor: "#21201e",
                          },
                          "&.Mui-focused fieldset": {
                            border: "1px solid #21201e",
                            borderColor: "#21201e",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "#21201e",
                          paddingLeft: "0.2rem",
                          paddingRight: "0.2rem",
                          "&:hover": {
                            color: "#21201e",
                          },
                          "&.Mui-focused": {
                            color: "#21201e",
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="d-flex flex-row flex-wrap col-sm-8 col-12 row-gap-2 justify-content-end column-gap-2">
                    <div
                      className="d-flex flex-row p-2 px-3 rounded justify-content-center align-items-center text-nowrap column-gap-2"
                      style={{ backgroundColor: "#fada65", color: "#070033" }}
                    >
                      <PeopleAltIcon style={{ width: "30", height: "30" }} />
                      <Typography variant="h6" className="p-0 m-0 text-nowrap">
                        {totalParticipant}
                      </Typography>
                    </div>
                    <div
                      className="d-flex flex-row p-2 px-3 rounded justify-content-center align-items-center text-nowrap column-gap-2"
                      style={{ backgroundColor: "#fada65", color: "#070033" }}
                    >
                      <EmojiEventsIcon style={{ width: "30", height: "30" }} />
                      <Typography variant="h6">
                        {quizdetail.WinningAmount ?? 0}
                        <CurrencyRupeeIcon
                          style={{
                            marginTop: "-2px",
                            width: "20",
                            height: "30",
                          }}
                        />
                      </Typography>
                    </div>
                  </div>
                </div>

                {PaticipantDetails.length > 0 ? (
                  <div className="table-responsive py-3">
                    <table className="table border">
                      <thead>
                        <tr>
                          <th
                            // className={`${classes["table-padding"]}`}
                            style={{
                              backgroundColor: "#3d3189",
                              color: "#fada65",
                            }}
                            className={`${classes["th-font"]} text-center py-3 fw-bold`}
                            scope="col"
                          >
                            Rank
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3d3189",
                              color: "#fada65",
                            }}
                            className={`${classes["th-font"]} text-center py-3 fw-bold`}
                            scope="col"
                            colSpan="5"
                          >
                            Username
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3d3189",
                              color: "#fada65",
                            }}
                            className={`${classes["th-font"]} text-center py-3 fw-bold`}
                            scope="col"
                          >
                            Score
                          </th>
                          <th
                            style={{
                              backgroundColor: "#3d3189",
                              color: "#fada65",
                            }}
                            scope="col"
                            colSpan="4"
                            className={`${classes["th-font"]} text-center py-3 fw-bold`}
                          >
                            Price(Rs)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PaticipantDetails?.map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              classes[`rank-${item.rank}`]
                            } text-center  py-3`}
                          >
                            <th
                              className={`${
                                classes[`rank-${item.rank}`]
                              } fw-bold  py-3`}
                              scope="row"
                            >
                              {item.rank}
                            </th>
                            <td
                              className={`${
                                classes[`rank-${item.rank}`]
                              } fw-bold  py-3`}
                              colSpan="5"
                            >
                              {item.username}
                            </td>
                            <td
                              className={`${
                                classes[`rank-${item.rank}`]
                              } fw-bold  py-3`}
                            >
                              {" "}
                              {item.score}/{quizdetail.TotalMarks}
                            </td>
                            <td
                              className={`${
                                classes[`rank-${item.rank}`]
                              } fw-bold  py-3`}
                              colSpan="4"
                            >
                              {item.priceWon}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center">
                    {isLoading == true ? (
                      <HashLoader
                        className="text-center me-2 mt-5"
                        style={{ color: "#a89ee9" }}
                      />
                    ) : (
                      isLoading == false && (
                        <div className="row p-0">
                          <div className="d-flex justify-content-center align-items-center flex-column">
                            <h2
                              className={`${classes["no-data-found"]} text-center mt-5 fw-bold`}
                              style={{ color: "#3d3189" }}
                            >
                              No Data Available
                            </h2>
                            <img
                              src={NoDataFound}
                              width="300px"
                              height="300px"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  // <tr className="text-center  py-3">
                  //   <td style={{ color: "#3d3189" }} colSpan="12">
                  //     <Typography variant="h4">No User Found</Typography>
                  //   </td>
                  // </tr>
                )}

                {PaticipantDetails.length > 0 && (
                  <div className={`${classes["pagination"]}`}>
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
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                      </Select>
                    </FormControl>

                    {PageSize > 0 && (
                      <Pagination
                        defaultPage={1}
                        siblingCount={1}
                        page={currentPage}
                        count={totalPage}
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
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-5" style={{ color: "#070033" }}>
                <Typography variant="h4">No Data Found</Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderInvalidText = () => {
    return (
      <div className="text-center">
        <h1>Invalid Url</h1>
      </div>
    );
  };
  return (
    <div>
      <main className={`${classes["live-quiz-div"]}`}>
        <div>
          <AdminSlider />
        </div>
        {isUrlValid == true ? renderLeaderBoard() : renderInvalidText()}
      </main>
    </div>
  );
};

export default ViewQuizResult;
