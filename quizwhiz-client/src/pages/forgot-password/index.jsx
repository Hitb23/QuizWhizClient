import React, { useState } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { SendMail } from "../../services/auth.service";

const ForgotPassword = () => {
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .required("Email is required")
      .email("Please enter a valid email"),
  });

  const handleSubmit = (values) => {
    console.log("Email: " + values.email);
    SendMail(values.email);
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
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, isSubmitting }) => (
                <Form>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-5 pb-5">
                      <label htmlFor="email" className={`form-label fw-bold ${classes["black-font"]}`}>
                        Email
                      </label>
                      <Field
                        as="input"
                        type="text"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        autoComplete="off"
                      />
                      {touched.email && errors.email ? (
                      <span className="text-danger">{errors.email}</span>
                    ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
                      <button
                        type="submit"
                        className={`${classes["forgot-password-button"]} ${!isValid || isSubmitting? classes["disabled-button"] : ""}`}
                        disabled={!isValid || isSubmitting}
                      >
                        Send Email Link
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
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

export default ForgotPassword;
