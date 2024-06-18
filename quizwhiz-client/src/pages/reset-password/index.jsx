import React, { useState, Fragment, useEffect } from "react";
import AuthHeader from "../../components/header/auth-header";
import classes from "./style.module.css";
import {  useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { checkToken } from "../../services/auth.service";
import { RoutePaths } from "../../utils/enum";
import { resetPassword } from "../../services/auth.service";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();

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
  const tokenValidation = async () => {
    try {
      const tokenValue = params.token;
      
      var result = await checkToken(tokenValue);
      //console.log(result);
      if (result?.status !== 200) {
        navigate(RoutePaths.Login);
      }
    } catch (error) {
      //console.log("ERROR404:",error);
      navigate(RoutePaths.Login);
    }
  };
  useEffect(() => {
    tokenValidation();
    //if(data)
  }, []);
  const handleSubmit = async (values) => {
    // resetPassword({params.token,values.password,values.})
    var token = params.token;
    var newPassword = values.password;
    var confirmNewPassword = values.confirmPassword;
    try {
      const data = await resetPassword({
        Token: token,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmNewPassword,
      });
      console.log(data);
      if (data.status === 200) {
        toast.success(
          "Password reset successfully. Please log in with your new password.",
         
        );
        navigate('/login', { state: { fromResetPassword: true } });
        
      } else {
        navigate("/login");
        toast.error(
          "Something Went Wrong",
         
        );
      }
      // if(data)
      // navigate("/login");
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
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
                      <label
                        htmlFor="password"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
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
                        htmlFor="confirmpassword"
                        className={`form-label fw-bold ${classes["black-font"]}`}
                      >
                        Confirm Password
                      </label>
                      <Field
                        as="input"
                        type="password"
                        name="confirmPassword"
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
                        disabled={!isValid || isSubmitting}
                        className={`${classes["reset-password-button"]} ${
                          !isValid || isSubmitting
                            ? classes["disabled-button"]
                            : ""
                        }`}
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
