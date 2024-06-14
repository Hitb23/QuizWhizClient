import React, { useState, Fragment } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link, Navigate, RouterProvider, useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { login } from "../../services/auth.service";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import jwtDecoder from "../../services/jwtDecoder";
import { router } from "../../constants/Routing";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&_]+$/,
        "Password must have an uppercase, a lowercase, a number, and a special character."
      )
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const email = values.email;
    const password = values.password;

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.data.token);
      const data = await jwtDecoder();

      const userRole =
        data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      
      if (userRole === "Admin") {
        console.log("Admin");
        navigate("/admin-dashboard", { replace: true });
      } else if (userRole === "Contestant") {
        console.log("Contestant");
        navigate("/user-dashboard", { replace: true });
      } else {
        console.log("Login");
        navigate("/login", { replace: true });
      }

      //navigate("/");
    } catch (error) {
      toast.error("Invalid email or password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Fragment>
      <AuthHeader />
      <main className={`${classes["main-component"]} container-fluid`}>
        <div className={`row justify-content-center`}>
          <div
            className={`${classes["log-in-title"]} col-md-6 col-sm-8 col-10 text-center fw-bold`}
          >
            Log In
          </div>
          <div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isValid, isSubmitting }) => (
                <Form>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="email"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Email
                      </label>
                      <Field
                        as="input"
                        type="email"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        autoComplete="off"
                        onKeyUp={() => {
                          setErrorMessage("");
                        }}
                      />
                      {touched.email && errors.email ? (
                        <span className="text-danger">{errors.email}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="password"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Password
                      </label>
                      <Field
                        as="input"
                        type="password"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="off"
                        onKeyUp={() => {
                          setErrorMessage("");
                        }}
                      />
                      {touched.password && errors.password ? (
                        <span className="text-danger">{errors.password}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <span
                      value={errorMessage}
                      className={`${
                        errorMessage ? classes["error-message"] : "offscreen"
                      }`}
                    >
                      {errorMessage}
                    </span>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex flex-row-reverse">
                      <Link to="/forgot-password">
                        <label
                          className={`form-label fw-bold text-end text-decoration-none text-black pe-auto ${classes["forgot-password-label"]}`}
                        >
                          Forgot Password?
                        </label>
                      </Link>
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                      <button
                        type="submit"
                        className={`${classes["log-in-button"]} ${
                          !isValid || isSubmitting
                            ? classes["disabled-button"]
                            : ""
                        }`}
                        disabled={!isValid || isSubmitting}
                      >
                        Log In
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <div
                  className={`d-flex align-items-center ${classes["black-font"]}`}
                >
                  Don't you have an account?
                </div>
                <Link to="/sign-up">
                  <label
                    className={`form-label fw-bold text-end text-decoration-none m-0 text-black pe-auto ${classes["log-in-label"]}`}
                  >
                    Sign Up
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
    </Fragment>
  );
};

export default Login;
