import React from "react";
import { AdminPageLogo } from "../../../assets";
import classes from "./style.module.css";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../../utils/enum";

const AdminAuthHeader = () => {
  return (
    <React.Fragment>
      <div className={classes["header"]}>
        <div className={classes["logo-div"]}>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["web-logo"]}`}
              src={AdminPageLogo}
              alt="logo"
            />
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminAuthHeader;
