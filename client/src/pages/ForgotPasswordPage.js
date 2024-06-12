import React, { useState } from "react";
import AuthHeader from "../components/headers/AuthHeader";
import classes from "./ForgotPasswordPage.module.css";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [formValues, setFormValues] = useState({
    email: {
      value: "",
      error: false,
      requiredErrorMessage: "Email is required",
      invalidErrorMessage: "Please enter valid email",
    },
  });

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

  const handleSubmit = (e) => {
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
    console.log("Email: " + formValues.email.value);
  };

  return (
    <React.Fragment>
      <AuthHeader />
      <main className={`${classes["main-component"]} container-fluid`}>
        <div className={`row justify-content-center`}>
          <div
            className={`${classes["forgot-password-title"]} col-md-6 col-sm-8 col-10 text-center fw-bold`}
          >
            Forgot Password?
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className={`d-flex justify-content-center`}>
                <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-5 pb-5">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email Address
                  </label>
                  <input
                    type="text"
                    className={`${classes["form-input"]} form-control form-control-md p-3`}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="off"
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
                <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                  <button type="submit" className={classes["forgot-password-button"]}>
                    Send Email Link
                  </button>
                </div>
              </div>
            </form>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <Link to="/login">
                  <label
                    className={`form-label fw-bold text-end text-decoration-none m-0 text-black pe-auto ${classes["back-to-login-label"]}`}
                  >
                    &lt; Back To Login
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

export default ForgotPasswordPage;
