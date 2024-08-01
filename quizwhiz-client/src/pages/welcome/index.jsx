import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingHeader from "../../components/header/landing-header";
import LandingFooter from "../../components/footer/landing-footer";
import classes from "./style.module.css";
import {
  AttemptQuizMobile,
  AttemptQuizPc,
  JoinQuizMobile,
  JoinQuizPc,
  SummaryQuizMobile,
  SummaryQuizPc,
  WelcomePoster,
} from "../../assets";
import { Button } from "bootstrap";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import { LandingImage } from "../../assets";
import Typed from "typed.js";
import { color } from "@mui/system";
const Welcome = () => {
  const el = React.useRef(null);
  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Get Your Brain in Gear", "Welcome to QuizWhiz"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1000,
      startDelay: 500,
      loop: false, // Set loop to false to stop after typing is complete
      // onComplete: (self) => {
      //   if (el.current) {
      //     // Remove the cursor class after typing is complete
      //     el.current.querySelector('.typed-cursor').style.display = 'none';
      //   }
      // },
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  return (
    <React.Fragment>
      <div className={`${classes["full-screen"]}`}>
        <LandingHeader />
        <main className={classes["main-component"]}>
          <div className={`text-center`}>
            <div className={classes["welcome-title"]}>
              {" "}
              <span ref={el} />
            </div>
            <div className={classes["welcome-slogan"]}>
              where every game is a Brain Boost!
            </div>
          </div>
          <div className={classes["poster"]}>
            <img
              className={`img-responsive ${classes["poster-img"]}`}
              src={LandingImage}
              alt="logo"
            />
          </div>
        </main>
        <div className="d-flex justify-content-center align-items-center py-3 gap-3">
          <div className={classes["lines"]}></div>
          <div className={classes["circle"]}></div>
          <h3 className={`${classes["heading-of-list"]}`}>
            <span className="d-none d-md-inline-block">Master the Quiz:</span>{" "}
            Your Winning Steps
          </h3>
          <div className={classes["circle"]}></div>
          <div className={classes["lines"]}></div>
        </div>
        <div className="container p-5">
          <div className="row px-0 py-5 d-flex justify-content-center align-items-center gx-5">
            <div className="col-lg-6 col-12 d-none d-lg-flex justify-content-center justify-content-lg-end">
              <img src={JoinQuizPc} className={`${classes["image-in-step"]}`} />
            </div>
            <div className="col-lg-6 col-10 d-flex d-lg-none justify-content-center align-items-center mx-auto">
              <img
                src={JoinQuizMobile}
                className={`img-fluid ${classes["image-in-step-mobile"]}`}
              />
            </div>
            <div
              className={`col-lg-6 col-12 py-5 my-auto text-center text-lg-start ${classes["text-of-steps"]}`}
            >
              <h3 className="fw-bold fs-2 p-0 m-0 py-3">
                Find Your Perfect Quiz
              </h3>
              <p className="text-white fs-5 m-0 py-3">
                Browse through our collection of quizzes after Login. If you
                don't have an account, register now to join. Click{" "}
                <strong
                  style={{
                    color: "#fada65",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                  }}
                >
                  "Join Now"
                </strong>{" "}
                to start the quiz of your choice.
              </p>
            </div>
          </div>
          <div className="row  px-0 py-5 d-flex justify-content-center align-items-center flex-md-column-reverse flex-sm-column-reverse flex-column-reverse flex-lg-row gx-5">
            <div
              className={`col-lg-6 col-12 py-5 my-auto text-center text-lg-start ${classes["text-of-steps"]}`}
            >
              <h3 className="fw-bold fs-2 p-0 m-0 py-3">
                Conquer the Quiz Challenge
              </h3>
              <p className="text-white fs-5 m-0 py-3">
                Tackle the questions head-on. Precision is key so answer
                correctly to stay in the game. Even if you stumble, don't worry;
                you still have a shot at victory!
              </p>
            </div>
            <div className="col-lg-6 col-12 d-none d-lg-flex justify-content-center justify-content-lg-end">
              <img
                src={AttemptQuizPc}
                className={`${classes["image-in-step"]}`}
              />
            </div>
            <div className="col-lg-6 col-10 d-flex d-lg-none justify-content-center align-items-center mx-auto">
              <img
                src={AttemptQuizMobile}
                className={`img-fluid ${classes["image-in-step-mobile"]}`}
              />
            </div>
          </div>
          <div className="row px-0 py-5 d-flex justify-content-center align-items-center gx-5">
            <div className="col-lg-6 col-12 d-none d-lg-flex justify-content-center justify-content-lg-end">
              <img
                src={SummaryQuizPc}
                className={`${classes["image-in-step"]}`}
              />
            </div>
            <div className="col-lg-6 col-10 d-flex d-lg-none justify-content-center align-items-center mx-auto">
              <img
                src={SummaryQuizMobile}
                className={`img-fluid ${classes["image-in-step-mobile"]}`}
              />
            </div>
            <div
              className={`col-lg-6 col-12 py-5 my-auto text-center text-lg-start ${classes["text-of-steps"]}`}
            >
              <h3 className="fw-bold fs-2 p-0 m-0 py-3">
                Celebrate Your Success
              </h3>
              <p className="text-white fs-5 m-0 py-3">
                Once you finish, get instant access to your score, rank, and
                winnings. See how you fared and celebrate your success!
              </p>
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    </React.Fragment>
  );
};

export default Welcome;
