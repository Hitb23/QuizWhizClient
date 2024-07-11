import React, { useState, useEffect } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { signUp } from "../../services/auth.service";
import * as yup from "yup";

import { checkUsername } from "../../services/auth.service";

import { ToastContainer, toast } from "react-toastify";

import { RoutePaths } from "../../utils/enum";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("UserName is required")
      .matches(
        /^[a-z][a-z0-9._-]{2,19}$/,
        "Username must start with a lowercase letter, be 3-20 characters, and contain only lowercase letters, numbers, _, ., or -."
      )
      .test("username", "Username already exist", async (username) => {
        if (username.trim() === "") return true;
        username = username.trim().toLowerCase();
        try {
          const response = await checkUsername({ username });
          return response.data;
        } catch (error) {
          return false;
        }
      }),
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
    confirmPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Password does not match"),
  });

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  };

  const handleSubmit = async (values) => {
    const email = values.email;
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const username = values.username;
    try {
      const response = await signUp({
        username,
        email,
        password,
        confirmPassword,
      });
      navigate(RoutePaths.Login);
    } catch (error) {
      const message = error?.response?.data?.message
        ? error.response.data.message
        : "Something went wrong";
      toast.error(message, {
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
    <React.Fragment>
      <div className={`${classes['full-screen']}`}>
      <AuthHeader />
      <main className={`${classes["main-component"]} container-fluid`}>
        <div className={`row justify-content-center`}>
          <div
            className={`${classes["sign-up-title"]} col-xl-4 col-md-6 col-sm-8 col-10 text-center fw-bold`}
          >
            Sign Up
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                errors,
                touched,
                isValid,
                isSubmitting,
                setFieldTouched,
              }) => (
                <Form>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="username"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Username
                      </label>
                      <Field
                        as="input"
                        type="text"
                        name="username"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="username"
                        placeholder="abc@123"
                        autoComplete="on"
                        onKeyUp={() => setFieldTouched("username", true)}
                      />
                      {touched.username && errors.username ? (
                        <span className={classes["error-message"]}>{errors.username}</span>
                      ) : (
                        touched.username && (
                          <span className={classes["success-message"]}>
                            Username is available
                          </span>
                        )
                      )}
                    </div>
                  </div>
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
                        name="email"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="email"
                        placeholder="name@example.com"
                        autoComplete="on"
                        // onKeyUp={checkValidUser}
                        //onKeyUp={handleEmailChange}
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
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="confirmPassword"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Confirm Password
                      </label>
                      <Field as="input" name="confirmPassword">
                        {({ field, form }) => (
                          <div className={classes["password-field"]}>
                            <input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              className={`${classes["form-input"]} form-control form-control-md p-3`}
                              placeholder="Password"
                              id="confirmPassword"
                              autoComplete="off"
                            />
                            <button
                              type="button"
                              onClick={handleToggleConfirmPasswordVisibility}
                              className={classes["visibility-toggle"]}
                            >
                              {showConfirmPassword ? (
                                <MdVisibilityOff size={20} />
                              ) : (
                                <MdVisibility size={20} />
                              )}
                            </button>
                          </div>
                        )}
                      </Field>
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <span className={classes["error-message"]}>
                          {errors.confirmPassword}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                      <button
                        type="submit"
                        className={`${classes["sign-up-button"]} ${
                          !isValid || isSubmitting
                            ? classes["disabled-button"]
                            : ""
                        }`}
                        disabled={!isValid || isSubmitting}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-3 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <div
                  className={`d-flex align-items-center ${classes["link-message"]}`}
                >
                  Already have an account?
                </div>
                <Link to={RoutePaths.Login}>
                  <label
                    className={`form-label fw-bold text-end text-decoration-none m-0 pe-auto ${classes["sign-up-label"]}`}
                  >
                    Log In
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default SignUp;
