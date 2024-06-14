import React from "react";
import { Logo } from "../../../assets";
import classes from "./style.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

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
        {!isAuthenticated ? (
          <div className={classes["header-buttons"]}>
            <Link to="/sign-up">
              <button className={classes["sign-up-button"]}>Sign Up</button>
            </Link>
            <Link to="/login">
              <button className={classes["log-in-button"]}>Log In</button>
            </Link>
          </div>
        ) : (
          <div className={classes["header-buttons"]}>
            <button
              className={classes["log-out-button"]}
              onClick={logoutHandler}
            >
              Log Out
            </button>
          </div>
        )}
      </header>
    </React.Fragment>
  );
};

export default LandingHeader;
