import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import Login from "../pages/login";

const AuthorizedRoute = ({ element, roles, userRole }) => {
  console.log(element);
  console.log(roles);
  console.log(userRole);
  if (roles?.includes(userRole)) {
    return true;
  } else {
    return false;
  }
};

export default AuthorizedRoute;
