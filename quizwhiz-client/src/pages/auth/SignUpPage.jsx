import React from "react";
import AuthHeader from "../../components/headers/auth/AuthHeader";
import classes from "./SignUpPage.module.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <React.Fragment>
      <AuthHeader />
      <main className={`${classes["main-component"]} container-fluid`}>
        <div className={`row justify-content-center`}>
          <div
            className={`${classes["sign-up-title"]} col-xl-4 col-md-6 col-sm-8 col-10 text-center fw-bold`}
          >
            Sign Up
          </div>
          <div>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Email
                </label>
                <input
                  type="email"
                  className={`${classes["form-input"]} form-control form-control-md p-3`}
                  id="email"
                  placeholder="name@example.com"
                  autoComplete="off"
                />
              </div>
            </div>
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
                <button className={classes["sign-up-button"]}>Sign Up</button>
              </div>
            </div>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <div className="d-flex align-items-center">
                  Already have an account?
                </div>
                <Link to="/login">
                  <label
                    className={`form-label fw-bold text-end text-decoration-none m-0 text-black pe-auto ${classes["sign-up-label"]}`}
                  >
                    Log In
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default SignUp;
