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
import jwtDecoder from "../../services/jwtDecoder";
import useSound from 'use-sound';
import {Theme} from "../../assets/index";
import { jwtDecode } from "jwt-decode";

const LiveQuiz = () => {
  const [datetime, setDateTime] = useState();
  const [countdownStart, setCountdownStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [remainingMinutes, setRemainingMinutes] = useState();
  const [remainingSeconds, setRemainingSeconds] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [questionCountdown, setQuestionCountdown] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({});
  const [questionId, setQuestionId] = useState();
  const [totalQuestions, setTotalQuestions] = useState();
  const [isClock, setIsClock] = useState(false);
  const [isOut, setIsOut] = useState(false);
  const params = useParams();
  const [redirect, setRedirect] = useState(false);
  const [sendAnswers, setSendAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const navigate = useNavigate();
  const data = jwtDecoder();
  const username = data["Username"];
  const [playSound, { stop }] = useSound(Theme, { loop: true });

  useEffect(() => {
    setIsLoading(true);
    const conn = new HubConnectionBuilder()
      .withUrl(`https://localhost:44361/quizhub?username=${encodeURIComponent(username)}`)
      .withAutomaticReconnect()
      .build();

    setConnections(conn);

    conn.on(`ReceiveRemainingTime_${params.quizLink}`, (minutes, seconds) => {
      setIsLoading(true);
      setIsClock(true);
      if (minutes >= 0 && seconds >= 0) {
        setRemainingMinutes(minutes);
        setRemainingSeconds(seconds);
      }
      setIsLoading(false);
    });

    conn.on(
      `ReceiveQuestion_${params.quizLink}`,
      (questionNo, question, timerSeconds, disqualifiedUsers) => {
        
        if (questionNo) {
          console.log(username);
          setQuestionId(question?.question?.questionId);
          localStorage.setItem("questionId", question?.question?.questionId);
          setIsClock(false);
          setIsLoading(true);
          setQuestionDetails(question);
          setCurrentQuestion(questionNo);
          setTotalQuestions(question.question.quiz.totalQuestion);
          setQuestionCountdown(timerSeconds);
          setIsOut(false);
          setIsLoading(false);
          if(disqualifiedUsers.data.includes(username))
            {
              console.log(username);
              setIsOut(true);
            }
        }
        conn.on(
          `IsDisqualified_FLP4rUCd`,
          (IsDisaqualified) => {
           console.log("Disqualified_user: ",IsDisaqualified);
          }
        );
      }
    );

    conn.on(
      `ReceiveAnswer_${params.quizLink}`,
      (questionNo, answers, timerSeconds) => {
        setIsClock(false);
        setIsLoading(false);
        setAnswers(answers);
        setQuestionCountdown(timerSeconds);
        if(currentQuestion == totalQuestions)
        {
          setIsQuizCompleted(true);
        }
      }
    );
    if(conn){
    console.log(conn.on(
      `IsDisqualified_FLP4rUCd`,
      (IsDisaqualified) => {
       console.log("Disqualified_user: ",IsDisaqualified);
      })
    );
    console.log("Inside If conditoin")
    }
    else{
      console.log("connection failed by some error yeeehh")
    }

    conn.on(`ReceiveTimerSeconds${params.quizLink}`, (timerSeconds) => {
      setIsLoading(false);
      setIsClock(false);
      setQuestionCountdown(timerSeconds);
    });

    conn.start().then(() => {
      conn
        .invoke("RegisterUser", params.quizLink, username)
        .catch(function (err) {
          return console.error(err.toString());
        });
    });

    // conn.invoke(`UpdateScore`, (params.quizLink, username, currentQuestion, ))

    conn.start().catch((error) => console.error("Connection failed: ", error));
  }, []);

  // const handleonUnload = (e) => {
  // };

  const stopTimerHandler = () => {
    setCountdownStart(0);
  };

  useEffect(() => {
    playSound();

    return () => {
      stop();
    };
  },[playSound, stop]);

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
    });
    setAnswerList(list);
  }, [answers]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getAnswersHandler = async (answerIds) => {
    setSendAnswers(answerIds);
    const tempQuestionId = parseInt(localStorage.getItem("questionId"));
    console.log(tempQuestionId);
    if (questionCountdown >= 17 && connections && tempQuestionId) {
      console.log(answerIds);
      await connections
        .invoke(
          "UpdateScore",
          params.quizLink,
          username,
          tempQuestionId,
          answerIds
        )
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
  };

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
      {isClock == false && isLoading == false && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5">
            <>
              <LiveQuestions
                questionDetail={questionDetails}
                questionNo={currentQuestion}
                total={totalQuestions}
                questionCountdown={questionCountdown}
                answers={answerList}
                isOut={isOut}
                isLoading={() => {
                  setIsLoading(true);
                }}
                getAnswer={getAnswersHandler}
              />
            </>
          </div>
        </div>
      )}
    </main>
  );
};

export default LiveQuiz;
