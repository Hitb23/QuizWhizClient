import React, { useState, Fragment } from "react";
import AuthHeader from "../../components/headers/auth/AuthHeader";
import classes from "./Login.module.css";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

const Login = () => {
  const [formValues, setFormValues] = useState({
    email: {
      value: "",
      error: false,
      requiredErrorMessage: "Email is required",
      invalidErrorMessage: "Please enter valid email",
    },
    password: {
      value: "",
      error: false,
      requiredErrorMessage: "Password is required",
      invalidErrorMessage:
        "Password must have uppercase, lowercase, number, and special character",
    },
  });

  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (value.trim() === "")
          return { isValid: false, errorType: "required" };
        if (!validateEmail(value))
          return { isValid: false, errorType: "invalid" };
        return { isValid: true, errorType: null };
      case "password":
        if (value.trim() === "")
          return { isValid: false, errorType: "required" };
        if (!validatePassword(value))
          return { isValid: false, errorType: "invalid" };
        return { isValid: true, errorType: null };
      default:
        return { isValid: true, errorType: null };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
        error: !validation.isValid,
        errorType: validation.errorType,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formFields = Object.keys(formValues);
    let newFormValues = { ...formValues };

    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index];
      const currentValue = formValues[currentField].value;
      const validation = validateField(currentField, currentValue);

      newFormValues = {
        ...newFormValues,
        [currentField]: {
          ...newFormValues[currentField],
          error: !validation.isValid,
          errorType: validation.errorType,
        },
      };
    }

    setFormValues(newFormValues);
    const email = formValues.email.value;
    const password = formValues.password.value;

    try {
      const response = await axios.post(
        "/Auth/login/",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Invalid Email or Password");
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
            <form onSubmit={handleSubmit}>
              <div className={`d-flex justify-content-center`}>
                <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`${classes["form-input"]} form-control form-control-md p-3`}
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    autoComplete="off"
                    onChange={handleChange}
                    value={formValues.email.value}
                  />
                  {formValues.email.error && (
                    <span className="text-danger">
                      {formValues.email.errorType === "required"
                        ? formValues.email.requiredErrorMessage
                        : formValues.email.invalidErrorMessage}
                    </span>
                  )}
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
                    name="password"
                    placeholder="Password"
                    value={formValues.password.value}
                    onChange={handleChange}
                  />
                  {formValues.password.error && (
                    <span className="text-danger">
                      {formValues.password.errorType === "required"
                        ? formValues.password.requiredErrorMessage
                        : formValues.password.invalidErrorMessage}
                    </span>
                  )}
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
                  <button type="submit" className={classes["log-in-button"]}>
                    Log In
                  </button>
                </div>
              </div>
            </form>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <div className="d-flex align-items-center">
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
    </Fragment>
  );
};

export default Login;
