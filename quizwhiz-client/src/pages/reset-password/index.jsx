import React, {useState ,Fragment } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const ResetPassword = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const validationSchema = yup.object().shape({
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
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values) => {
    console.log(values.password);
    console.log(values.confirmPassword);
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, isSubmitting }) => (
                <Form>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label htmlFor="password" className={`form-label fw-bold ${classes["black-font"]}`}>
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
                                <MdVisibilityOff />
                              ) : (
                                <MdVisibility />
                              )}
                            </button>
                          </div>
                        )}
                      </Field>
                      {touched.password && errors.password ? (
                      <span className="text-danger">{errors.password}</span>
                    ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="confirmpassword"
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
                                <MdVisibilityOff />
                              ) : (
                                <MdVisibility />
                              )}
                            </button>
                          </div>
                        )}
                      </Field>
                      {touched.confirmPassword && errors.confirmPassword ? (
                      <span className="text-danger">{errors.confirmPassword}</span>
                    ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                      <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`${classes["reset-password-button"]} ${!isValid || isSubmitting ? classes["disabled-button"] : ""}`}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default ResetPassword;
