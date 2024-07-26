import React, { useEffect, useImperativeHandle, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Label } from "@mui/icons-material";
import { Switch, Tooltip } from "@mui/material";
import { DIFFICULTIES } from "../../utils/enum";
import { DeleteQuiz, PublishQuiz } from "../../services/admindashboard.service";
import EditQuizModal from "../dialog-boxes/edit-quiz-details";
import PublishIcon from "@mui/icons-material/Publish";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import { toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { MdLeaderboard } from "react-icons/md";
import { TbTriangle } from "react-icons/tb";
import { TbTriangleInverted } from "react-icons/tb";

// import withReactContent from "@sweetalert2/react-content";

const QuizEditTable = ({ data, Status, reload, parentFunction, onClose }) => {
  const [deleteResponse, setDeleteResponse] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDataAscending, setIsDataAscending] = useState(true);

  useEffect(() => {
    getOrderedData("");
  }, []);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // useImperativeHandle(ref, () => ({
  //   callParentFunction: getOrderedData
  // }));

  const getOrderedData = async (name) => {
    data = [];
    parentFunction(name, isDataAscending);
    setIsDataAscending(!isDataAscending);
  };

  const onCloseHandler = () => {
    onClose();
  };

  const OnDeleteHandler = async (QuizLink) => {
    debugger;
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      console.log(`Deleting item with id: ${QuizLink}`);
      try {
        await DeleteQuiz(QuizLink);
        reload();
      } catch (error) {
        console.log(error);
      }
      MySwal.fire("Deleted!", "Your item has been deleted.", "success");
    } else if (result.isDismissed) {
      MySwal.fire("Cancelled", "Your item is safe :)", "error");
    }
  };

  const OnPublishHandler = async (QuizLink) => {
    debugger;
    try {
      const result = await PublishQuiz(QuizLink);
      console.log(result);
      if (result.statusCode === 200) {
        navigate(RoutePaths.AdminDashboard);
        toast.success("Quiz Published Successfully");
        reload();
      } else if (result.statusCode === 400) {
        navigate(RoutePaths.AdminDashboard);
        toast.error(result.message);
      } else {
        toast.error("Failed To Publish Quiz");
      }
    } catch {
      toast.error("Error While Publishing The Quiz");
    }
  };

  const handleFormatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };
  const handleViewQuizResult = (quizLink) => {
    navigate(`${RoutePaths.ViewQuizResult}/${quizLink}`);
  };
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + strMinutes + " " + ampm;
    return strTime;
  };
  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-striped ">
          <thead>
            <tr>
              <th
                scope="col"
                style={{ background: "#a89ee9", cursor: "pointer" }}
                className="text-black text-center py-3"
                onClick={(e) => getOrderedData("title")}
              >
                Title
                {/* {isDataAscending ? (
                  <TbTriangle className="ms-2 mb-1" />
                ) : (
                  <TbTriangleInverted className="ms-2 mb-1" />
                )} */}
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9", cursor: "pointer" }}
                className="text-black py-3"
                onClick={(e) => getOrderedData("totalquestions")}
              >
                Total Questions{" "}
                {/* {isDataAscending ? (
                  <TbTriangle className="ms-2 mb-1" />
                ) : (
                  <TbTriangleInverted className="ms-2 mb-1" />
                )} */}
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Category
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Schedule Date
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9", cursor: "pointer" }}
                className="text-black py-3"
                onClick={(e) => getOrderedData("totalmarks")}
              >
                Total Marks{" "}
                {/* {isDataAscending ? (
                  <TbTriangle className="ms-2 mb-1" />
                ) : (
                  <TbTriangleInverted className="ms-2 mb-1" />
                )} */}
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9", cursor: "pointer" }}
                className="text-black py-3"
                onClick={(e) => getOrderedData("difficulty")}
              >
                Difficulty{" "}
                {/* {isDataAscending ? (
                  <TbTriangle className="ms-2 mb-1" />
                ) : (
                  <TbTriangleInverted className="ms-2 mb-1" />
                )} */}
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Winning Amount
              </th>

              {(Status === "pending" || Status === "completed") && (
                <th
                  scope="col"
                  style={{ background: "#a89ee9" }}
                  className="text-black text-center py-3"
                >
                  Leaderboard
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data?.map((ele) => (
              <tr key={ele.QuizId}>
                <td className="text-black text-center">{ele.Title}</td>
                <td className="text-black text-center">{ele.TotalQuestion}</td>
                <td className="text-black text-center">{ele.CategoryName}</td>
                <td className="text-black text-center">
                  {handleFormatDate(ele.ScheduledDate)}{" "}
                  {formatTime(ele.ScheduledDate)}
                </td>
                <td className="text-black text-center">{ele.TotalMarks}</td>
                <td className="text-black text-center">
                  {DIFFICULTIES[ele.DifficultyId]}
                </td>
                <td className="text-black text-center">{ele.WinningAmount}</td>

                {Status === "pending" && (
                  <td className="text-black text-center">
                    <div className="d-flex justify-content-between align-items-center w-100 h-100 gap-2">
                      <Tooltip title="Edit">
                        <EditQuizModal
                          currentQuizLink={ele.QuizLink}
                          onClose={onCloseHandler}
                        />
                      </Tooltip>
                      {/* {isEditOpen == true ? :null} */}
                      <Tooltip title="Delete">
                        <button
                          className="btn btn-danger fw-bold"
                          onClick={() => OnDeleteHandler(ele.QuizLink)}
                        >
                          <Delete />
                        </button>
                      </Tooltip>
                      <Tooltip title="Publish">
                        <button
                          className="btn btn-primary fw-bold"
                          onClick={() => OnPublishHandler(ele.QuizLink)}
                        >
                          <PublishIcon />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                )}

                {Status === "completed" && (
                  <td className="text-black text-center">
                    <Tooltip title="Result">
                      <button
                        className="btn btn-primary fw-bold"
                        onClick={() => handleViewQuizResult(ele.QuizLink)}
                      >
                        <LeaderboardIcon />
                      </button>
                    </Tooltip>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuizEditTable;
