import React from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { signup } from "../../services/auth.service";
import * as yup from "yup";

import userNameValidity from "../../services/userNameValidity";

import { ToastContainer, toast } from "react-toastify";


const SignUp = () => {
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    username:yup
    .string()
    .required("UserName is required")
    .lowercase("Username should be in lowercase")
    .test("username", "Username already exist", async (username) => {
      if(username.trim()==="") return true;
      username=username.trim().toLowerCase();
      try {
        const response = await userNameValidity({ username });
        return response.data; 
      } catch (error) {
        return false; 
      }
    
    }),
    email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter valid email")
      .required("Email is required")
      ,
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
    username:""
  };

  const handleSubmit = async (values) => {

    const email = values.email;
    const password = values.password;
    const confirmPassword = values.confirmPassword;
    const username=values.username;
    try {
      const response = await signup({username, email, password, confirmPassword });
      navigate("/login");
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, isSubmitting }) => (
                <Form>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label htmlFor="username" className={`form-label fw-bold ${classes["black-font"]}`}>
                        UserName
                      </label>
                      <Field
                        as="input"
                        type="text"
                        name="username"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="username"
                        placeholder="abc@123"
                        autoComplete="off"
                        // onKeyUp={checkValidUser}
                        //onKeyUp={handleEmailChange}
                      />
                      {touched.username && errors.username ? (
                        <span className="text-danger">{errors.username}</span>
                      ) : touched.username ?  <span className="text-success">UserName available</span> :null}
                     
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label htmlFor="email" className={`form-label fw-bold ${classes["black-font"]}`}>
                        Email
                      </label>
                      <Field
                        as="input"
                        type="email"
                        name="email"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="email"
                        placeholder="name@example.com"
                        autoComplete="off"
                        // onKeyUp={checkValidUser}
                        //onKeyUp={handleEmailChange}
                      />
                      {touched.email && errors.email ? (
                        <span className="text-danger">{errors.email}</span>
                      ) : null}
                   
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label htmlFor="password" className={`form-label fw-bold ${classes["black-font"]}`}>
                        Password
                      </label>
                      <Field
                        as="input"
                        type="password"
                        name="password"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="password"
                        placeholder="Password"
                      />
                      {touched.password && errors.password ? (
                        <span className="text-danger">{errors.password}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label
                        htmlFor="confirmPassword"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Confirm Password
                      </label>
                      <Field
                        as="input"
                        name="confirmPassword"
                        type="password"
                        className={`${classes["form-input"]} form-control form-control-md p-3`}
                        id="confirmPassword"
                        placeholder="Password"
                      />
                      {touched.confirmPassword && errors.confirmPassword ? (
                        <span className="text-danger">
                          {errors.confirmPassword}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center">
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
              <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3 d-flex justify-content-center column-gap-2 flex-wrap">
                <div className={`d-flex align-items-center ${classes["black-font"]}`}>
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
      <ToastContainer />
    </React.Fragment>
  );
};

export default SignUp;
