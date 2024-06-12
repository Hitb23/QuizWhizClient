import React from "react";
import { Logo } from "../../assets";
import classes from "./LandingHeader.module.css";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <React.Fragment>
      <header className={classes["header"]}>
        <div className={classes["logo-div"]}>
          <Link to="/">
            <img
              className={`img-responsive ${classes["web-logo"]}`}
              src={Logo}
              alt="logo"
            />
          </Link>
        </div>
        <div className={classes["header-buttons"]}>
          <Link to="/sign-up">
            <button className={classes["sign-up-button"]}>Sign Up</button>
          </Link>
          <Link to="/login">
            <button className={classes["log-in-button"]}>Log In</button>
          </Link>
        </div>
      </header>
    </React.Fragment>
  );
};

export default LandingHeader;
