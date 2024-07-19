import React, { useEffect, useState } from "react";
import "./style.css";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 17;

const QuestionTimer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [remainingPathColor, setRemainingPathColor] = useState(
    COLOR_CODES.info.color
  );

  useEffect(() => {
    if (seconds <= 17) {
      const remainingTime = 17 - seconds;
      setRemainingPathColor(getRemainingPathColor(remainingTime));
      setTimeLeft(remainingTime);
    }
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  };

  const getRemainingPathColor = (timeLeft) => {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      return alert.color;
    } else if (timeLeft <= warning.threshold) {
      return warning.color;
    } else {
      return info.color;
    }
  };

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    return circleDasharray;
  };

  return (
    <>
      {(seconds < 17) && (
        <div className="base-timer" id="timer">
          <svg
            className="base-timer__svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="base-timer__circle">
              <circle
                className="base-timer__path-elapsed"
                cx="50"
                cy="50"
                r="45"
              ></circle>
              <path
                id="base-timer-path-remaining"
                strokeDasharray={setCircleDasharray()}
                className={`base-timer__path-remaining ${remainingPathColor}`}
                d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
              ></path>
            </g>
          </svg>
          <span
            id="base-timer-label"
            className="base-timer__label"
            style={{ color: remainingPathColor }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      )}
    </>
  );
};

export default QuestionTimer;
