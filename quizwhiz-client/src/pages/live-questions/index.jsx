import React, { useEffect, useState } from "react";
import CountdownTimer from "../../components/countdown-timer";
import { useParams } from "react-router-dom";
import { getQuizDetailsByLink } from "../../services/admindashboard.service";
import QuizDescription from "../problem-description";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import classes from "./style.module.css";
import { PacmanLoader } from "react-spinners";

const LiveQuestions = () => {
  const [datetime, setDateTime] = useState();
  const [countdownStart, setCountdownStart] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const setData = async () => {
      try {
        const allData = await getQuizDetailsByLink(params.quizLink);
        const data = allData.data;
        setDateTime(data.ScheduledDate);
        setCountdownStart(1);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    setData();
  }, []);

  const stopTimerHandler = () => {
    setCountdownStart(0);
  };

  return (
    <main className={classes["live-quiz-div"]}>
      {countdownStart == 1 && (
      <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
        <div className="d-flex justify-content-center align-items-center row row-gap-5">
          <div
            className={`${classes["timer-header"]} d-flex justify-content-center align-items-center`}
          >
            <h1>Quiz Starts In</h1>
          </div>
          <CountdownTimer
            endTime={datetime}
            stopTimer={stopTimerHandler}
          />
        </div>
      </div>
      )}
    </main>
  );
};

export default LiveQuestions;
