import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { IoTimeOutline } from "react-icons/io5";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaListCheck } from "react-icons/fa6";
import classes from "./style.module.css";
import { DIFFICULTIES, CATEGORIES } from "../../../utils/enum";
import QuizDescription from "../quiz-description";
import CountdownTimer from "../../countdown-timer";
import { useNavigate } from "react-router-dom";
const QuizCard = ({
  title,
  scheduledDate,
  categoryId,
  difficultyId,
  totalMarks,
  totalQuestions,
  quizLink,
}) => {
  const [minutes, setMinutes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(0);
  var quizDate = new Date(scheduledDate);
  const navigate = useNavigate();

  useEffect(() => {
    setMinutes(Math.round((quizDate.getTime() - new Date().getTime()) / 60000));
  });

  var categoryName = CATEGORIES[categoryId];
  var imageUrl = `${
    import.meta.env.VITE_PUBLIC_URL
  }src/assets/${categoryName.toLowerCase()}.jpg`;
  if (categoryName == "General Knowledge") {
    imageUrl = `${import.meta.env.VITE_PUBLIC_URL}src/assets/gk.jpg`;
  }

  const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(scheduledDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const AnimatedButton = styled(Button)({
    position: "relative",
    overflow: "hidden",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    "&:hover": {
      backgroundColor: "#4caf50", // Change to your preferred hover color
      transform: "scale(1.05)",
    },
    "& .MuiButton-endIcon": {
      transition: "transform 0.3s ease, margin-left 0.3s ease",
    },
    "&:hover .MuiButton-endIcon": {
      transform: "translateX(5px)",
    },
  });

  const viewDetailsHandler = () => {
    setIsModalOpen(1);
    console.log("open");
  };

  const closeModalHandler = () => {
    setIsModalOpen(0);
  };

  const joinNowHandler = () => {
    console.log("H");
    navigate(`/live-quiz/${quizLink}`);
  };

  return (
    <>
      <div
        className={`${classes["quiz-card"]} row rounded-2 px-0 px-sm-3 my-2`}
        style={{
          background: "#3d3189",
          padding: "24px",
          border: "1px solid #fada65",
        }}
      >
        <div className="col-xl-9 col-md-12 d-flex justify-content-start column-gap-3 align-items-center">
          <div className="col-md-4 col-sm-4 img-fluid">
            <img
              className="rounded-2 img-fluid"
              src={imageUrl}
              height={120}
              width={250}
            />
          </div>
          <div className="col-md-8 col-sm-8 text-xl-start text-center">
            <h6 className=" my-1 d-none d-lg-inline">
              {formattedDate} - {formattedTime}
            </h6>
            <h5 className=" my-1 fw-bolder">
              {title} <small>({DIFFICULTIES[difficultyId]})</small>
            </h5>
            <h6 className="my-1 d-none d-lg-inline">
              {CATEGORIES[categoryId]}
            </h6>
            <div className="d-flex column-gap-2 my-2 justify-content-xl-start justify-content-md-center">
              <div className="d-none d-lg-inline d-flex justify-content-center align-items-center flex-wrap">
                {" "}
                <IoTimeOutline color="#fada65" size={25} />
                <small className="m-2">{totalQuestions / 2} Minutes</small>{" "}
              </div>
              <div className="d-none d-lg-inline d-flex justify-content-center align-items-center flex-wrap">
                {" "}
                <LuFileSpreadsheet color="#fada65" size={25} />
                <small className="m-2">{totalMarks} Marks</small>{" "}
              </div>
              <div className="d-none d-lg-inline d-flex justify-content-center align-items-center flex-wrap">
                {" "}
                <FaListCheck color="#fada65" size={25} />
                <small className="m-2">{totalQuestions} Questions</small>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 text-xl-end d-flex justify-content-center align-items-center flex-wrap">
          {minutes <= 5 && minutes >= 0 ? (
            <div className="d-none d-xl-inline">
              <button
                type="submit"
                className={classes["join-now-button"]}
                onClick={joinNowHandler}
              >
                Join Now
              </button>
            </div>
          ) : null}
          {minutes < 0 ? (
            <div className="d-none d-xl-inline">
              <button type="submit" className={classes["join-now-button"]}>
                Leaderboard
              </button>
            </div>
          ) : null}
          <div className="d-none d-xl-inline">
            <button
              type="submit"
              className={classes["join-now-button"]}
              onClick={viewDetailsHandler}
            >
              View Details
            </button>
          </div>
        </div>
        <div className="d-lg-none">
          <div className="d-flex justify-content-center">
            <h6 className="my-2 mt-3 d-lg-none">{CATEGORIES[categoryId]}</h6>
          </div>
          <div className="d-flex justify-content-center">
            <h6 className="my-2 d-lg-none">
              {formattedDate} - {formattedTime}
            </h6>
          </div>
          <div className="d-flex column-gap-2 my-2 justify-content-center align-items-center flex-wrap">
            <div className="d-lg-none my-1 d-flex justify-content-center align-items-center flex-wrap">
              {" "}
              <IoTimeOutline color="#fada65" size={25} />
              <small className="m-2">{totalQuestions / 2} Minutes</small>{" "}
            </div>
            <div className="d-lg-none my-1 d-flex justify-content-center align-items-center flex-wrap">
              {" "}
              <LuFileSpreadsheet color="#fada65" size={25} />
              <small className="m-2">{totalMarks} Marks</small>{" "}
            </div>
            <div className="d-lg-none my-1 d-flex justify-content-center align-items-center flex-wrap">
              {" "}
              <FaListCheck color="#fada65" size={25} />
              <small className="m-2">{totalQuestions} Questions</small>{" "}
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-2 my-auto text-center text-xl-end d-xl-none d-flex justify-content-center align-items-center column-gap-3 row-gap-3 flex-wrap">
          {minutes <= 60 && minutes >= 0 ? (
            <div>
              <button
                type="submit"
                className={classes["join-now-button"]}
                onClick={joinNowHandler}
              >
                Join Now
              </button>
            </div>
          ) : null}
          {minutes < 0 ? (
            <div>
              <button type="submit" className={classes["join-now-button"]}>
                Leaderboard
              </button>
            </div>
          ) : null}
          <div>
            <button
              type="submit"
              className={classes["join-now-button"]}
              onClick={viewDetailsHandler}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      {isModalOpen == 1 ? (
        <QuizDescription quizLink={quizLink} modalClose={closeModalHandler} />
      ) : null}
    </>
  );
};

export default QuizCard;
