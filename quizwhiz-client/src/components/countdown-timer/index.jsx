import React, { useEffect, useState } from "react";
import classes from "./style.module.css";
import QuizDescription from "../admin-cards/quiz-description";
import { Grid } from "@mui/material";
import { PacmanLoader } from "react-spinners";

const CountdownTimer = ({ endTime, stopTimer }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => getTime(endTime), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTime = () => {
    const time = Date.parse(endTime) - Date.now();
    const tempMinutes = Math.floor((time / 1000 / 60) % 60)
      .toString()
      .padStart(2, 0);
    const tempSeconds = Math.floor((time / 1000) % 60)
      .toString()
      .padStart(2, 0);
    setMinutes(tempMinutes);
    setSeconds(tempSeconds);
    if (time <= 0) {
      stopTimer();
    }
  };

  return (
    <>
      <div
        className={`${classes["countdown__container"]} col-md-8 col-sm-10 row-gap-5`}
      >
        <div className={classes["countdown__card"]}>
          <div className={classes["countdown__card__bg"]}>
            <div className={classes["countdown__card__number"]}>{minutes}</div>
          </div>
          <div className={classes["countdown__card__label"]}>Minutes</div>
        </div>
        <div className={classes["countdown__card"]}>
          <div className={classes["countdown__card__bg"]}>
            <div className={classes["countdown__card__number"]}>{seconds}</div>
          </div>
          <div className={classes["countdown__card__label"]}>Seconds</div>
        </div>
      </div>
    </>
  );
};

export default CountdownTimer;
