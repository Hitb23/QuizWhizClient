import React, { Fragment } from "react";
import classes from "./style.module.css";
import AuthHeader from "../../components/header/auth-header";
import LandingHeader from "../../components/header/landing-header";
import AdminSideBar from "../../components/admin-sidebar";

const AdminDashboard = () => {
  return (
    <Fragment>
      {/* <LandingHeader/>
      <h1>Admin DashBoard</h1> */}
    <AdminSideBar/> 
    </Fragment>
  );
} 

export default AdminDashboard;