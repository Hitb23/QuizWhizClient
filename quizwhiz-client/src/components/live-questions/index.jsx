import React, { useEffect, useRef, useState } from "react";
import classes from "./style.module.css";
import QuestionTimer from "../question-timer";
import CheckIcon from "@mui/icons-material/Check";
import Clear from "@mui/icons-material/Clear";
import { Gauge, gaugeClasses } from "@mui/x-charts";

const LiveQuestions = ({
  questionDetail,
  questionNo,
  total,
  questionCountdown,
  answers,
  isOut,
  isLoading,
}) => {
  const [questionText, setQuestionText] = useState();
  const [options, setOptions] = useState([]);
  const optionsRef = useRef([]);
  const [current, setCurrent] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(); 
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [answersList, setAnswersList] = useState([]);
  const [isCorrect, setIsCorrect] = useState([-1]);
  const [isIncorrect, setIsIncorrect] = useState([-1]);
  const [isOutCheck, setIsOutCheck] = useState(false);

  useEffect(() => {
    setQuestionText(questionDetail?.question?.questionText);
    setOptions(questionDetail?.options);
    setCurrent(questionNo);
    setTotalQuestions(total);
    setIsOutCheck(isOut);
  }, [questionDetail, questionNo, total, isOut]);

  useEffect(() => {
    setAnswersList(answers);
    var correctList = [];
    var incorrectList = [];
    options.map((element, index) => {
      if (
        optionsRef[index].classList.contains(classes["option-box-selected"])
      ) {
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
    setIsCorrect(correctList);
    setIsIncorrect(incorrectList);
  }, [answers]);

  useEffect(() => {
    if (isOutCheck) {
      options.map((element, index) => {
        optionsRef[index].classList.add(classes["option-box-disabled"]);
      });
    }
  }, [isOutCheck]);

  useEffect(() => {
    setCountdownTimer(questionCountdown);
    console.log(questionCountdown);
    if (questionCountdown == 20) {
      setOptions();
      setQuestionText();
      setCurrent();
      setTotalQuestions();
      setAnswersList();
      setIsCorrect([-1]);
      setIsIncorrect([-1]);
      isLoading();
      setIsOutCheck(false);
    }
  }, [questionCountdown]);

  const onOptionSelect = (e) => {
    if (
      questionCountdown < 17 &&
      questionDetail?.question?.questionTypeId == 1
    ) {
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

    if (
      questionCountdown < 17 &&
      questionDetail?.question?.questionTypeId == 2
    ) {
      if (!e.target.classList.contains(classes["option-box-disabled"])) {
        if (e.target.classList.contains(classes["option-box-selected"])) {
          e.target.classList.remove(classes["option-box-selected"]);
        } else {
          e.target.classList.add(classes["option-box-selected"]);
        }
      }
    }

    if (
      questionCountdown < 17 &&
      questionDetail?.question?.questionTypeId == 3
    ) {
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
            options.map((element, index) => (
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
