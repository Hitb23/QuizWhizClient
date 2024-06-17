import React from "react";
import classes from "./style.module.css";
import { Link, Route } from "react-router-dom";
import { Facebook, LinkedIn, Instagram, Youtube } from "../../../assets";
import { RoutePaths } from "../../../utils/enum";

const LandingFooter = () => {
  return (
    <React.Fragment>
      <footer className={classes["footer"]}>
        <div className={classes["logo-div"]}>
          <Link to={RoutePaths.Welcome} className={classes["name-link"]}>
            <div className={classes["company-name"]}>QuizWhiz</div>
          </Link>
        </div>
        <div className={classes["social-media-icons"]}>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["social-media-icon"]}`}
              src={Facebook}
              alt="Facebook"
            />
          </Link>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["social-media-icon"]}`}
              src={LinkedIn}
              alt="LinkedIn"
            />
          </Link>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["social-media-icon"]}`}
              src={Youtube}
              alt="Youtube"
            />
          </Link>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["social-media-icon"]}`}
              src={Instagram}
              alt="Instagram"
            />
          </Link>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default LandingFooter;
