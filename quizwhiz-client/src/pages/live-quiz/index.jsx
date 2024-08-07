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
import useSound from "use-sound";
import { Theme } from "../../assets/index";
import UserScoreModal from "../user-score";
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
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [winningAmount, setWinningAmount] = useState(0);
  const [rank, setRank] = useState(0);
  const navigate = useNavigate();
  const data = jwtDecoder();
  const username = data["Username"];
  const [playSound, { stop }] = useSound(Theme, { loop: true });

  useEffect(() => {
    setIsLoading(true);
    const conn = new HubConnectionBuilder()
      .withUrl(`https://localhost:44361/quizhub`)
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
          if (disqualifiedUsers.data.includes(username)) {
            setIsOut(true);
          }
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

    conn.on(`QuizCompleted_${params.quizLink}`, (isTrue) => {
      setIsQuizCompleted(isTrue);
    });

    conn.start().then(() => {
      var result = conn
        .invoke("RegisterUser", params.quizLink, username)
        .catch(function (err) {
          //return console.error(err.toString());
        });
    });

    conn.on(`ResponseOfUserScoreboard_${username}`, (data) => {
      setScore(data.data.score);
      setTotalScore(data.data.totalScore);
      setWinningAmount(data.data.winningAmount);
      setRank(data.data.rank);
      setIsLoading(false);
    });

    // conn.invoke(`UpdateScore`, (params.quizLink, username, currentQuestion, ))

    conn.start().catch((error) => console.error("Connection failed: ", error));
  }, []);

  // const handleonUnload = (e) => {
  // };

  const stopTimerHandler = () => {
    setCountdownStart(0);
  };

  const scoreboard = async () => {
    try {
      if (connections) {
        await connections
          .invoke("UserScoreboard", params.quizLink, username)
          .catch(function (err) {
            return console.error(err.toString());
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    playSound();

    return () => {
      stop();
    };
  }, [playSound, stop]);

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
    if (isQuizCompleted) {
      scoreboard();
    }
  }, [isQuizCompleted]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const getAnswersHandler = async (answerIds) => {
    setSendAnswers(answerIds);
    const tempQuestionId = parseInt(localStorage.getItem("questionId"));
    if (questionCountdown >= 17 && connections && tempQuestionId) {
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
        <div className={` ${classes["live-quiz"]} d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0 p-0`}>
          <div className="d-flex justify-content-center align-items-center row row-gap-5 m-0 p-0">
            <div
              className={`${classes["timer-header"]} d-flex justify-content-center align-items-center m-0 p-0`}
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
      {isClock == false && isLoading == false && isQuizCompleted == false && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5 m-0 p-0">
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
      {(rank != null) && (rank != 0) && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5 m-0 p-0">
            <>
            <UserScoreModal score={score} totalScore={totalScore} winningAmount={winningAmount} rank={rank} />
            </>
          </div>
        </div>
      )}
    </main>
  );
};

export default LiveQuiz;
