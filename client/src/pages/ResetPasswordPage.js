import React from "react";
import AuthHeader from "../components/headers/AuthHeader";
import classes from "./ResetPasswordPage.module.css";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  return (
    <React.Fragment>
      <AuthHeader />
      <main className={`${classes["main-component"]} container-fluid`}>
        <div className={`row justify-content-center`}>
          <div
            className={`${classes["reset-password-title"]} col-md-6 col-sm-8 col-10 text-center fw-bold`}
          >
            Reset Password
          </div>
          <div>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  className={`${classes["form-input"]} form-control form-control-md p-3`}
                  id="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                <label htmlFor="confirmpassword" className="form-label fw-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`${classes["form-input"]} form-control form-control-md p-3`}
                  id="confirmpassword"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                <button className={classes["reset-password-button"]}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default ResetPasswordPage;
