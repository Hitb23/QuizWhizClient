import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingHeader from "../../components/header/landing-header";
import LandingFooter from "../../components/footer/landing-footer";
import classes from "./style.module.css";
import { WelcomePoster } from "../../assets";
import { Button } from "bootstrap";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import { LandingImage } from "../../assets";
import Typed from 'typed.js';
const Welcome =  () => {
  const el = React.useRef(null);
  React.useEffect(() => { 
    const typed = new Typed(el.current, {
      strings: ['Get Your Brain in Gear','Welcome to QuizWhiz'],
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
      <div className={`${classes['full-screen']}`}>
      <LandingHeader />
      <main className={classes["main-component"]}>
        <div className={`text-center`}>
          <div className={classes["welcome-title"]}> <span ref={el} /></div>
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
      <LandingFooter />
      ></div>
    </React.Fragment>
  );
}

export default Welcome;
