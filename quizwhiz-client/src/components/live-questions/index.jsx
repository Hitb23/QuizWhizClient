import React, { useEffect, useRef, useState } from "react";
import classes from "./style.module.css";
import QuestionTimer from "../question-timer";
import CheckIcon from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { GiEntryDoor } from "react-icons/gi";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LiveQuestions = ({
  questionDetail,
  questionNo,
  total,
  questionCountdown,
  answers,
  isOut,
  isLoading,
  getAnswer,
}) => {
  const [questionText, setQuestionText] = useState();
  const [options, setOptions] = useState([]);
  const optionsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState();
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [questionTypeId, setQuestionTypeId] = useState();
  const [sendAnswersList, setSendAnswersList] = useState([]);
  const [answersList, setAnswersList] = useState([]);
  const [isCorrect, setIsCorrect] = useState([-1]);
  const [isIncorrect, setIsIncorrect] = useState([-1]);
  const [isOutCheck, setIsOutCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (questionNo != 0) {
      setQuestionText(questionDetail?.question?.questionText);
      localStorage.setItem(
        "questionText",
        questionDetail?.question?.questionText
      );
      setOptions(questionDetail?.options);
      localStorage.setItem("options", JSON.stringify(questionDetail?.options));
      setQuestionTypeId(questionDetail?.question?.questionTypeId);
      localStorage.setItem(
        "questionTypeId",
        questionDetail?.question?.questionTypeId
      );
      setCurrent(questionNo);
      localStorage.setItem("current", questionNo);
      setTotalQuestions(total);
      localStorage.setItem("totalQuestions", total);
      setIsOutCheck(isOut);
      console.log("IsOut? ", isOut);
      localStorage.setItem("isOutCheck", JSON.stringify(isOut));
    } else {
      setQuestionText(localStorage.getItem("questionText"));
      setOptions(JSON.parse(localStorage.getItem("options")));
      setQuestionTypeId(localStorage.getItem("questionTypeId"));
      setCurrent(localStorage.getItem("current"));
      setTotalQuestions(localStorage.getItem("totalQuestions"));
      setIsOutCheck(JSON.parse(localStorage.getItem("isOutCheck")));
    }
  }, [questionDetail, questionNo, total, isOut]);

  useEffect(() => {
    options?.map((element, index) => {
      isOutCheck
        ? optionsRef[index].classList.add(classes["option-box-disabled"])
        : optionsRef[index].classList.remove(classes["option-box-disabled"]);
    });
  }, [isOutCheck]);

  useEffect(() => {
    setAnswersList(answers);
    console.log("Answers:", answers);
    var correctList = [];
    var incorrectList = [];
    var selectedList = [];
    options?.map((element, index) => {
      if (
        optionsRef[index].classList.contains(classes["option-box-selected"])
      ) {
        selectedList = selectedList.concat(index + 1);
        if (answers.includes(index + 1)) {
          optionsRef[index].classList.remove(classes["option-box-selected"]);
          optionsRef[index].classList.add(classes["option-box-correct"]);
          correctList = correctList.concat(index);
        } else {
          optionsRef[index].classList.remove(classes["option-box-selected"]);
          optionsRef[index].classList.add(classes["option-box-incorrect"]);
          incorrectList = incorrectList.concat(index);
        }
      } else {
        if (answers.includes(index + 1)) {
          optionsRef[index].classList.add(classes["option-box-correct"]);
          correctList = correctList.concat(index);
        }
      }
    });
    setSendAnswersList(selectedList);
    setIsCorrect(correctList);
    setIsIncorrect(incorrectList);
  }, [answers]);

  useEffect(() => {
    setCountdownTimer(questionCountdown);
    console.log(questionCountdown);
    if (questionCountdown == 20) {
      setOptions();
      localStorage.removeItem("options");
      setQuestionText();
      localStorage.removeItem("questionText");
      setCurrent();
      localStorage.removeItem("current");
      setTotalQuestions();
      localStorage.removeItem("totalQuestions");
      setAnswersList();
      setIsCorrect([-1]);
      setIsIncorrect([-1]);
      isLoading();
      setIsOutCheck(false);
      localStorage.removeItem("isOutCheck");
    }
  }, [questionCountdown]);

  useEffect(() => {
    console.log("Sent", sendAnswersList);
    getAnswer(sendAnswersList);
  }, [sendAnswersList]);

  const onLeaveHandler = () => {
    navigate("/quizzes");
  }

  const onOptionSelect = (e) => {
    if (questionCountdown < 17 && questionTypeId == 1) {
      options?.map((element, index) => {
        if (
          optionsRef[index].classList.contains(classes["option-box-selected"])
        ) {
          optionsRef[index].classList.remove(classes["option-box-selected"]);
        }
      });
      if (!e.target.classList.contains(classes["option-box-disabled"])) {
        if (e.target.classList.contains(classes["option-box-selected"])) {
          e.target.classList.remove(classes["option-box-selected"]);
        } else {
          e.target.classList.add(classes["option-box-selected"]);
        }
      }
    }

    if (questionCountdown < 17 && questionTypeId == 2) {
      if (!e.target.classList.contains(classes["option-box-disabled"])) {
        if (e.target.classList.contains(classes["option-box-selected"])) {
          e.target.classList.remove(classes["option-box-selected"]);
        } else {
          e.target.classList.add(classes["option-box-selected"]);
        }
      }
    }

    if (questionCountdown < 17 && questionTypeId == 3) {
      options?.map((element, index) => {
        if (
          optionsRef[index].classList.contains(classes["option-box-selected"])
        ) {
          optionsRef[index].classList.remove(classes["option-box-selected"]);
        }
      });
      if (!e.target.classList.contains(classes["option-box-disabled"])) {
        if (e.target.classList.contains(classes["option-box-selected"])) {
          e.target.classList.remove(classes["option-box-selected"]);
        } else {
          e.target.classList.add(classes["option-box-selected"]);
        }
      }
    }
  };

  return (
    <main className={`${classes["live-questions-div"]} row row-gap-1`}>
      <div
        className={`${classes["countdown-header"]} d-flex justify-content-center align-items-top col-md-8 col-sm-10 col-11 p-0`}
      >
        {current != 0 && countdownTimer != 20 && (
          <div
            className={`${classes["timer-div"]} col-4 d-flex justify-content-between align-items-center col-11 column-gap-4`}
          >
            <div className={`${classes["questions-count"]}`}>
              <div className={`${classes["question-count-text"]}`}>
                <Gauge
                  value={(current / totalQuestions) * 100}
                  startAngle={0}
                  endAngle={360}
                  width={100}
                  height={100}
                  cornerRadius="50%"
                  innerRadius="84%"
                  className="guage"
                  sx={{
                    "& .MuiGauge-valueText text": {
                      fill: "#ffe37e !important",
                    },
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 15,
                      transform: "translate(0px, 0px)",
                      color: "#fada65 !important",
                    },
                    "& .MuiGauge-referenceArc": {
                      fill: "gray !important",
                    },
                    "& .MuiGauge-valueArc": {
                      fill: "#ffe37e !important",
                    },
                  }}
                  text={({ value, valueMax }) =>
                    `${current} / ${totalQuestions}`
                  }
                />
              </div>
            </div>
            <div className={`${classes["countdown"]}`}>
              <div
                className={`${classes["countdown-text"]} d-flex justify-content-center align-items-center`}
              >
                <QuestionTimer seconds={countdownTimer} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center align-items-around row-gap-4 row m-0 column-gap-4 col-md-8 col-sm-10 col-11 p-0">
        <div className="d-flex justify-content-start align-items-start row row-gap-5 p-0 col-11">
          <div className={`${classes["questionText"]}`}>{questionText}</div>
        </div>
        <div className="d-flex justify-content-center row align-items-around row-gap-4 p-0 col-11">
          {options != null &&
            options?.map((element, index) => (
              <div
                id={index}
                key={index}
                className={`${classes["options"]} d-flex justify-content-start align-items-center row-gap-5 column-gap-1`}
              >
                <div
                  className={`${classes["option-box"]} col-12 d-flex justify-content-between align-items-center`}
                  id={index}
                  ref={(ref) => (optionsRef[index] = ref)}
                  onClick={onOptionSelect}
                >
                  <div className="m-0 pe-none">{element}</div>
                  {isCorrect.includes(index) && (
                    <div>
                      <CheckIcon />
                    </div>
                  )}
                  {isIncorrect.includes(index) && (
                    <div>
                      <Clear />
                    </div>
                  )}
                </div>
              </div>
            ))}
          {isOutCheck == true && (
            <div className={`d-flex justify-content-center p-0`}>
              <FaSignOutAlt size={70} className={`${classes["leave-btn"]}`} onClick={onLeaveHandler}/>
            </div>
          )}

          {/* <div
            className={`${classes["options"]} d-flex justify-content-start align-items-center row-gap-5 column-gap-1`}
          >
            <div
              className={`${classes["option-box-right"]} col-12 d-flex justify-content-between align-items-center`}
            >
              <div className="m-0">{}</div>
              <div>
                <CheckIcon htmlColor="0b3900" />
              </div>
            </div>
          </div>
          <div
            className={`${classes["options"]} d-flex justify-content-start align-items-center row-gap-5 column-gap-1`}
          >
            <div
              className={`${classes["option-box-wrong"]} col-12 d-flex justify-content-between align-items-center`}
            >
              <div className="m-0">{}</div>
              <div>
                <Clear htmlColor="0b3900" />
              </div>
            </div>
          </div>
          <div
            className={`${classes["options"]} d-flex justify-content-start align-items-center row-gap-5 column-gap-1`}
          >
            <div className={`${classes["option-box"]} col-12`}>
              <div className="m-0">{}</div>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default LiveQuestions;
