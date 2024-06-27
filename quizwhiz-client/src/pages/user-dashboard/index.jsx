import React, { useEffect } from "react";
import classes from "./style.module.css";
import LandingHeader from "../../components/header/landing-header";
import { ToastContainer, toast } from "react-toastify";

const UserDashboard = () => {
  return (
    <React.Fragment>
      <LandingHeader />
      <h1>User Dashboard</h1>
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserDashboard;
