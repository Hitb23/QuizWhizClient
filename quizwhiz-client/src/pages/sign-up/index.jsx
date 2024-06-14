import React from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import userNameValidity from "../../services/userNameValidity";

const SignUp = () => {
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter valid email")
      .required("Email is required")
      .test("email", "Username already exist", async (email) => {
        const username = email.split("@")[0];
        try {
          const response = await userNameValidity({ username });
          console.log(response);
          return response.data; // if response is true, validation passes
        } catch (error) {
          return false; // if response is false or error occurs, validation fails
        }
      }),
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
  };

  const handleSubmit = async (values) => {
    console.log(values.email);
    console.log(values.password);
    console.log(values.confirmPassword);
  };
  const handleEmailChange = () => {
    // initialValues.setFieldValue('email', e.target.value);
    initialValues.validateField("email");
  };

  // const checkValidUser= (e)=>{
  //   const email = e.target.value.split('@')[0];
  //   console.log("Called",email);

  //   try {
  //     const response = await userNameValidity({email});
  //     if(!response){

  //     }
  //   } catch (error) {
  //     setErrorMessage("Invalid Email or Password");
  //   }
  // }
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
                      <label htmlFor="email" className="form-label fw-bold">
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
                      {}
                    </div>
                  </div>
                  <div className={`d-flex justify-content-center`}>
                    <div className="col-xl-4 col-md-6 col-sm-8 col-10 pt-3 pb-3">
                      <label htmlFor="password" className="form-label fw-bold">
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
                        className="form-label fw-bold"
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
