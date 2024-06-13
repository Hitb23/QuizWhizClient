import React from "react";
import { Logo } from "../../../assets";
import classes from "./style.module.css";
import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <React.Fragment>
      <div className={classes["header"]}>
        <div className={classes["logo-div"]}>
          <Link to="/">
            <img
              className={`img-responsive ${classes["web-logo"]}`}
              src={Logo}
              alt="logo"
            />
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthHeader;
