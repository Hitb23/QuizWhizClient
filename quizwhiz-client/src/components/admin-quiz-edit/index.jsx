import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { DIFFICULTIES } from "../../utils/enum";
import { DeleteQuiz } from "../../services/admindashboard.service";

const QuizEditTable = ({ data, Status,reload }) => {
  const [deleteResponse,setDeleteResponse]=useState('');
  // useEffect(()=>[
     
  // ],[deleteResponse])
  const OnDeleteHandler=async(QuizLink)=>{
      try{
        const response=await DeleteQuiz(QuizLink);
        setDeleteResponse(response);
        console.log(response);
        reload();
      }
      catch(error){
        console.log(error);
      }
  }

  const handleFormatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
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
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Title
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Total Questions
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
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Total Marks
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Difficulty
              </th>
              <th
                scope="col"
                style={{ background: "#a89ee9" }}
                className="text-black text-center py-3"
              >
                Winning Amount
              </th>

              {(Status === "pending" || Status === "upcoming") && (
                <th
                  scope="col"
                  style={{ background: "#a89ee9" }}
                  className="text-black text-center py-3"
                >
                  Action
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
                {(Status === "pending" || Status === "upcoming") && (
                  <td className="text-black text-center">
                    <div className="d-flex justify-content-between align-items-center w-100 h-100 gap-2">
                      <Tooltip title="Edit">
                        <button
                          className="btn fw-bold"
                          style={{ background: "#a89ee9" }}
                        >
                          <Edit />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button className="btn btn-danger fw-bold" onClick={()=> OnDeleteHandler(ele.QuizLink)}>
                          <Delete />
                        </button>
                      </Tooltip>
                    </div>
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
