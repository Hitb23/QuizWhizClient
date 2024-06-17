import React, { Fragment } from "react";
import classes from "./style.module.css";
import AuthHeader from "../../components/header/auth-header";
import LandingHeader from "../../components/header/landing-header";

const AdminDashboard = () => {
  return (
    <Fragment>
      <LandingHeader />
      <h1>Admin Dashboard</h1>
    </Fragment>
  );
} 

export default AdminDashboard;