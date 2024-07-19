import React, { useEffect, useState } from "react";
import CountdownTimer from "../../components/countdown-timer";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizDetailsByLink } from "../../services/admindashboard.service";
import QuizDescription from "../problem-description";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import classes from "./style.module.css";
import { PacmanLoader } from "react-spinners";
import { HubConnectionBuilder } from "@microsoft/signalr";
import LiveQuestions from "../../components/live-questions";

const LiveQuiz = () => {
  const [datetime, setDateTime] = useState();
  const [countdownStart, setCountdownStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [remainingMinutes, setRemainingMinutes] = useState();
  const [remainingSeconds, setRemainingSeconds] = useState();
  const [currentQuestion, setcurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [questionCountdown, setQuestionCountdown] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({});
  const [totalQuestions, setTotalQuestions] = useState();
  const [isClock, setIsClock] = useState(false);
  const [isOut, setIsOut] = useState(false);
  const params = useParams();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setIsLoading(true);
    const conn = new HubConnectionBuilder()
      .withUrl("https://localhost:44361/quizhub")
      .withAutomaticReconnect()
      .build();

    setConnection(conn);

    conn.on(`ReceiveRemainingTime_${params.quizLink}`, (minutes, seconds) => {
      console.log("Time");
      setIsLoading(true);
      setIsClock(true);
      if(minutes >= 0 && seconds >= 0)
      {
        setRemainingMinutes(minutes);
        setRemainingSeconds(seconds);
      }
      setIsLoading(false);
    });

    conn.on(
      `ReceiveQuestion_${params.quizLink}`,
      (questionNo, question, timerSeconds) => {
        if (questionNo) {
          setIsClock(false);
          setIsLoading(true);
          setQuestionDetails(question);
          setcurrentQuestion(questionNo);
          setTotalQuestions(question.question.quiz.totalQuestion);
          setQuestionCountdown(timerSeconds);
          setIsOut(false);
          setIsLoading(false);
        }
      }
    );

    conn.on(
      `ReceiveAnswer_${params.quizLink}`,
      (questionNo, answers, timerSeconds) => {
        setIsClock(false);
        setIsLoading(false);
        setAnswers(answers);
        setQuestionCountdown(timerSeconds);
      }
    );

    conn.on(`ReceiveTimerSeconds${params.quizLink}`, (timerSeconds) => {
      setIsLoading(false);
      setIsClock(false);
      setQuestionCountdown(timerSeconds);
    });

    conn.start().catch((error) => console.error("Connection failed: ", error));
  }, []);

  // const handleonUnload = (e) => {
  // };

  const stopTimerHandler = () => {
    setCountdownStart(0);
  };

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

  useEffect(() => {
    var list = [];
    answers.map((element, index) => {
      var number = element.optionNo;
      list = list.concat(number);
    })
    setAnswerList(list);
  },[answers]);

  return (
    <main className={classes["live-quiz-div"]}>
      {isLoading == true && (
        <PacmanLoader
          className="position-absolute top-50 start-50 translate-middle p-0"
          color="#fada65"
        />
      )}
      {countdownStart == 1 && isClock == true && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5">
            <div
              className={`${classes["timer-header"]} d-flex justify-content-center align-items-center`}
            >
              <h1>Quiz Starts In</h1>
            </div>
            <CountdownTimer
              getMinutes={remainingMinutes}
              getSeconds={remainingSeconds}
              stopTimer={stopTimerHandler}
            />
          </div>
        </div>
      )}
      {(isClock == false && isLoading == false) && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5">
            <>
              <LiveQuestions
                questionDetail={questionDetails}
                questionNo={currentQuestion}
                total={totalQuestions}
                questionCountdown={questionCountdown}
                answers = {answerList}
                isOut = {isOut}
                isLoading = {() => {
                  setIsLoading(true);
                }}
              />
            </>
          </div>
        </div>
      )}
    </main>
  );
};

export default LiveQuiz;
