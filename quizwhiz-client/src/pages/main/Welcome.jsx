import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingHeader from "../../components/headers/main/LandingHeader";
import LandingFooter from "../../components/footers/main/LandingFooter";
import classes from "./Welcome.module.css";
import { WelcomePoster } from "../../assets";
import { Button } from "bootstrap";
import { Link } from "react-router-dom";
 
const Welcome =  () => {
  return (
    <React.Fragment>
      <LandingHeader />
      <main className={classes["main-component"]}>
        <div className={classes["welcome-message"]}>
          <div className={classes["welcome-title"]}>Welcome To QuizWhiz</div>
          <div className={classes["welcome-slogan"]}>
            Where Every Game is a Brain Boost!
          </div>
        </div>
        <div className={classes["poster"]}>
          <img
            className={`img-responsive ${classes["poster-img"]}`}
            src={WelcomePoster}
            alt="logo"
          />
          <Link to="">
            <button className={classes["get-started-button"]}>Get Started</button>
          </Link>
        </div>
      </main>
      <LandingFooter />
    </React.Fragment>
  );
}

export default Welcome;
