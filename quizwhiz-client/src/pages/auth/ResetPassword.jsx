import React, {useState ,Fragment } from "react";
import AuthHeader from "../../components/headers/auth/AuthHeader";
import classes from "./ResetPassword.module.css";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [formValues, setFormValues] = useState({
    password: {
      value: "",
      error: false,
      requiredErrorMessage: "Password is required",
      invalidErrorMessage:
        "Password must have uppercase, lowercase, number, and special character",
    },
    confirmPassword: {
      value: "",
      error: false,
      requiredErrorMessage: "Please confirm the entered password",
      notSameErrorMessage: "Password does not match",
    },
  });

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "password":
        if (value.trim() === "")
          return { isValid: false, errorType: "required" };
        if (!validatePassword(value))
          return { isValid: false, errorType: "invalid" };
        return { isValid: true, errorType: null };
      case "confirmPassword":
        if (value.trim() === "")
          return { isValid: false, errorType: "required" };
        if (formValues.password.value === "")
          return {isValid: false, errorType: "required"};
        if (value != formValues.password.value)
          return {isValid: false, errorType: "notSame"}
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
  };

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
            <form onSubmit={handleSubmit}>
              <div className={`d-flex justify-content-center`}>
                <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`${classes["form-input"]} form-control form-control-md p-3`}
                    id="password"
                    value={formValues.password.value}
                    onChange={handleChange}
                    placeholder="Password"
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
                <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                  <label
                    htmlFor="confirmpassword"
                    className="form-label fw-bold"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formValues.confirmPassword.value}
                    className={`${classes["form-input"]} form-control form-control-md p-3`}
                    id="confirmpassword"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  {formValues.confirmPassword.error && (
                    <span className="text-danger">
                      {formValues.confirmPassword.errorType === "required"
                        ? formValues.confirmPassword.requiredErrorMessage
                        : formValues.confirmPassword.notSameErrorMessage}
                    </span>
                  )}

                </div>
              </div>
            </form>
            <div className={`d-flex justify-content-center`}>
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                <button
                  type="submit"
                  className={classes["reset-password-button"]}
                >
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

export default ResetPassword;
