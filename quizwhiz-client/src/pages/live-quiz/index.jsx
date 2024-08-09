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
import { HeartPY, Theme } from "../../assets/index";
import UserScoreModal from "../user-score";
import { jwtDecode } from "jwt-decode";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [questionCountdown, setQuestionCountdown] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({});
  const [questionId, setQuestionId] = useState();
  const [totalQuestions, setTotalQuestions] = useState();
  const [isCountdownOn, setIsCountdownOn] = useState();
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
  const [isHeartUsed, setIsHeartUsed] = useState(true);
  const [isFiftyUsed, setIsFiftyUsed] = useState(true);
  const [isSkipUsed, setIsSkipUsed] = useState(true);
  const navigate = useNavigate();
  const data = jwtDecoder();
  const username = data["Username"];
  const MySwal = withReactContent(Swal);
  const [isRegistered, setIsRegistered] = useState();
  const [isSkipQuestion, setIsSkipQuestion] = useState(false);
  const [playSound, { stop }] = useSound(Theme, { loop: true });

  useEffect(() => {
    setIsLoading(true);
    const conn = new HubConnectionBuilder()
      .withUrl(`http://localhost:7234/quizhub`)
      .withAutomaticReconnect()
      .build();

    setConnections(conn);

    conn.on(`ReceiveRemainingTime_${params.quizLink}`, (minutes, seconds) => {
      setIsLoading(true);
      setIsClock(true);
      if (minutes >= 0 && seconds >= 0) {
        setRemainingMinutes(minutes);
        setRemainingSeconds(seconds);
        if (isCountdownOn == null) {
          setIsCountdownOn(true);
        }
      }
      setIsLoading(false);
    });

    conn.on(
      `ReceiveQuestion_${params.quizLink}`,
      (questionNo, question, timerSeconds, disqualifiedUsers) => {
        console.log(disqualifiedUsers.data);
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
          setWrongAnswers([]);
          setIsSkipQuestion(false);
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
        setIsCountdownOn(false);
      }
    );

    conn.on(`ReceiveTimerSeconds${params.quizLink}`, (timerSeconds) => {
      setIsLoading(false);
      setIsClock(false);
      setQuestionCountdown(timerSeconds);
      setIsCountdownOn(false);
    });

    conn.on(`QuizCompleted_${params.quizLink}`, (isTrue) => {
      
      function removeExistingItem(key) {
        if (localStorage.getItem(key) === null) return false;
        localStorage.removeItem(key);
        return true;
      }

      removeExistingItem("isHeartUsed");
      removeExistingItem("isSkipUsed");
      removeExistingItem("isFiftyUsed");
      removeExistingItem("isRegistered");
      removeExistingItem("current");
      removeExistingItem("totalQuestions");
      removeExistingItem("questionId");
      removeExistingItem("questionText");
      removeExistingItem("options");
      removeExistingItem("isOutCheck");
      removeExistingItem("questionTypeId");
      setIsQuizCompleted(isTrue);
    });

    conn.on(`RegisterUserResponse_${username}`, (data) => {
      // setIsHeartUsed(data.data);
      if (data.isSuccess == true) {
        setIsHeartUsed(data.data.isHeartUsed);
        localStorage.setItem("isHeartUsed", data.data.isHeartUsed);
        setIsSkipUsed(data.data.isSkipUsed);
        localStorage.setItem("isSkipUsed", data.data.isSkipUsed);
        setIsFiftyUsed(data.data.isFiftyUsed);
        localStorage.setItem("isFiftyUsed", data.data.isFiftyUsed);
        setIsRegistered(true);
        localStorage.setItem("isRegistered", "true");
      } else {
      }
    });

    conn.on(`ResponseOfUserScoreboard_${username}`, (data) => {
      setScore(data.data.score);
      setTotalScore(data.data.totalScore);
      setWinningAmount(data.data.winningAmount);
      setRank(data.data.rank);
      setIsLoading(false);
    });

    conn.on(`ResponseOfHeartLifeline_${username}`, (data) => {
      if (data.isSuccess == true) {
        setIsOut(false);
        setIsHeartUsed(true);
        localStorage.setItem("isHeartUsed", true);
      } else {
        toast.error("You don't have Lifeline!");
      }
    });

    conn.on(`FetchFiftyOptions_${username}`, (data) => {
      if (data.isSuccess == true) {
        setIsFiftyUsed(true);
        localStorage.setItem("isFiftyUsed", true);
        var list = [];
        console.log(data.data);
        data.data.map((element, index) => {
          var number = element.optionNo;
          list = list.concat(number);
        });
        console.log(list);
        setWrongAnswers(list);
      } else {
        toast.error("You don't have Lifeline!");
      }
    });

    // conn.invoke(`UpdateScore`, (params.quizLink, username, currentQuestion, ))

    conn.start().catch((error) => console.error("Connection failed: ", error));
  }, []);

  useEffect(() => {
    console.log("Hello");
    const registerUser = async () => {
      try {
        if (isCountdownOn == true && connections) {
          await connections
            .invoke("RegisterUser", params.quizLink, username)
            .catch(function (err) {
              //return console.error(err.toString());
            });
        }
      } catch (err) {
        console.log(err);
      }
    };

    registerUser();

    if (isCountdownOn != null) {
      var checkRegister = localStorage.getItem("isRegistered");
      console.log(checkRegister);
      if (checkRegister != "true" && isCountdownOn != true) {
        navigate("/quizzes");
      }
    }
  }, [isCountdownOn]);

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
    const useLifeline = async () => {
      var list = [];
      answers.map((element, index) => {
        var number = element.optionNo;
        list = list.concat(number);
      });

      const checkHeartUsed = localStorage.getItem("isHeartUsed");
      const checkCurrent = localStorage.getItem("current");
      const checkTotalQuestions = localStorage.getItem("totalQuestions");
      if (
        JSON.stringify(list) != JSON.stringify(sendAnswers) &&
        isOut == false &&
        questionCountdown >= 17 &&
        checkCurrent < checkTotalQuestions &&
        connections &&
        checkHeartUsed == "false" &&
        isSkipQuestion == false
      ) {
        const result = await MySwal.fire({
          title: "Stay in the Game",
          text: "Use the Heart Lifeline to avoid disqualification.",
          iconHtml: `<img src=${HeartPY} style="width: 200px">`,
          customClass: {
            icon: "no-border",
          },
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          color: "#fada65",
          background: "#3d3189",
          timer: 5000,
          timerProgressBar: true,
          willOpen: () => {
            const timerProgressBar = document.querySelector(
              ".swal2-container .swal2-timer-progress-bar"
            );
            if (timerProgressBar) {
              timerProgressBar.style.backgroundColor = "#fada65";
            }
            const swal2Icon = document.querySelector(
              ".swal2-container .swal2-icon.swal2-question"
            );
            if (swal2Icon) {
              swal2Icon.style.color = "#fada65";
              swal2Icon.style.borderColor = "#fada65";
            }
            const cancelButton = document.querySelector(
              ".swal2-container .swal2-cancel"
            );
            if (cancelButton) {
              cancelButton.style.color = "#fada65"; // Change this to desired color
              cancelButton.style.border = "none"; // Optional: Remove border if needed
            }

            // Style the confirm button
            const confirmButton = document.querySelector(
              ".swal2-container .swal2-confirm"
            );
            if (confirmButton) {
              confirmButton.style.color = "#fada65"; // Change this to desired color
              confirmButton.style.border = "none"; // Optional: Remove border if needed
            }
          },
          focusConfirm: false,
          focusCancel: false,
        });

        if (result.isConfirmed) {
          try {
            if (connections) {
              await connections
                .invoke("HeartLifeline", params.quizLink, username)
                .catch(function (err) {
                  return console.error(err.toString());
                });
            }
          } catch (err) {
            console.log(err);
          }
        } else if (result.isDismissed) {
        }
      }
    };
    useLifeline();
  }, [sendAnswers]);

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
          answerIds,
          isSkipQuestion
        )
        .catch(function (err) {
          return console.error(err.toString());
        });
    }
  };

  const onFiftyHandler = async (questionId) => {
    try {
      if (
        connections &&
        localStorage.getItem("isFiftyUsed") == "false" &&
        localStorage.getItem("questionTypeId") == 1 &&
        questionId
      ) {
        await connections
          .invoke("FiftyLifeline", params.quizLink, username, questionId)
          .catch(function (err) {
            return console.error(err.toString());
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSkipHandler = () => {
    setIsSkipQuestion(true);
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
        <div
          className={` ${classes["live-quiz"]} d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0 p-0`}
        >
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
                onSkipClick={onSkipHandler}
                onFiftyClick={onFiftyHandler}
                sendWrongAnswers={wrongAnswers}
              />
            </>
          </div>
        </div>
      )}
      {rank != null && rank != 0 && (
        <div className="d-flex justify-content-center align-items-center row-gap-2 row min-vh-100 m-0">
          <div className="d-flex justify-content-center align-items-center row row-gap-5 m-0 p-0">
            <>
              <UserScoreModal
                score={score}
                totalScore={totalScore}
                winningAmount={winningAmount}
                rank={rank}
              />
            </>
          </div>
        </div>
      )}
    </main>
  );
};

export default LiveQuiz;
