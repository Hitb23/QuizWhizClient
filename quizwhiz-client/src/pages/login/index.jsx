import React, { useState, Fragment } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link, Navigate, RouterProvider, useNavigate } from "react-router-dom";
import { RoutePaths } from "../../utils/enum";
import axios from "../../services/axios";
import { login } from "../../services/auth.service";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecoder from "../../services/jwtDecoder";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { userActions } from "../../redux/action-creators";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actions = bindActionCreators(userActions, dispatch);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
      localStorage.setItem("token", response.data.data);
      localStorage.setItem("token-expiry", new Date().getTime() + 3600 * 1000);

      const data = await jwtDecoder();
      const userRole = data["Role"];
      {
        actions.changeUserRole(data["Role"]);
        actions.changeUserName(data["Username"]);
        actions.changeUserEmail(data["Email"]);
      }

      if (userRole === "Admin") {
        navigate(RoutePaths.AdminDashboard, {
          state: { IsSuccessMessage: true, Message: response.data.message },
        });
      } else if (userRole === "Contestant") {
        navigate(RoutePaths.Quizzes, {
          state: { IsSuccessMessage: true, Message: response.data.message },
        });
      } else {
        navigate(RoutePaths.Login, {
          state: { IsSuccessMessage: true, Message: response.data.message },
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
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
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3">
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
                        autoComplete="on"
                      />
                      {touched.email && errors.email ? (
                        <span className={classes["error-message"]}>{errors.email}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="password"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Password
                      </label>
                      <Field as="input" name="password">
                        {({ field, form }) => (
                          <div className={classes["password-field"]}>
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className={`${classes["form-input"]} form-control form-control-md p-3`}
                              placeholder="Password"
                              id="password"
                              autoComplete="off"
                            />
                            <button
                              type="button"
                              onClick={handleTogglePasswordVisibility}
                              className={classes["visibility-toggle"]}
                            >
                              {showPassword ? (
                                <MdVisibilityOff size={20} />
                              ) : (
                                <MdVisibility size={20} />
                              )}
                            </button>
                          </div>
                        )}
                      </Field>
                      {touched.password && errors.password ? (
                        <span className={classes["error-message"]}>{errors.password}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex flex-row-reverse">
                      <Link to={RoutePaths.ForgotPassword}>
                        <label
                          className={`form-label fw-bold text-end text-decoration-none pe-auto ${classes["forgot-password-label"]}`}
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
                  className={`d-flex align-items-center ${classes["link-message"]}`}
                >
                  Don't you have an account?
                </div>
                <Link to={RoutePaths.SignUp}>
                  <label
                    className={`form-label fw-bold text-end text-decoration-none m-0 pe-auto ${classes["log-in-label"]}`}
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
