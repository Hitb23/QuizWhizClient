import React from "react";
import { Logo } from "../../../assets";
import classes from "./style.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { userActions } from "../../../redux/action-creators";
import { RoutePaths } from "../../../utils/enum";
import jwtDecoder from "../../../services/jwtDecoder";

const LandingHeader = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;
  const data = jwtDecoder();
  const userRole = data["Role"];
  var dashboard = null;
  if (userRole === "Admin") {
    dashboard = RoutePaths.AdminDashboard;
  } else if (userRole === "Contestant") {
    dashboard = RoutePaths.UserDashboard;
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actions = bindActionCreators(userActions, dispatch);
  const logoutHandler = () => {
    {
      actions.changeUserRole("");
      actions.changeUserName("");
      actions.changeUserEmail("");
    }
    
    localStorage.removeItem("token");
    navigate(RoutePaths.Login);
  };

  return (
    <React.Fragment>
      <header className={classes["header"]}>
        <div className={classes["logo-div"]}>
          <Link to={RoutePaths.Welcome}>
            <img
              className={`img-responsive ${classes["web-logo"]}`}
              src={Logo}
              alt="logo"
            />
          </Link>
        </div>
        {!isAuthenticated ? (
          <div className={classes["header-buttons"]}>
            <Link to={RoutePaths.SignUp}>
              <button className={classes["sign-up-button"]}>Sign Up</button>
            </Link>
            <Link to={RoutePaths.Login}>
              <button className={classes["log-in-button"]}>Log In</button>
            </Link>
          </div>
        ) : (
          <div className={classes["header-buttons"]}>
            {isAuthenticated && dashboard != null && (
              <Link to={dashboard}>
                <button className={classes["sign-up-button"]}>Dashboard</button>
              </Link>
            )}

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
