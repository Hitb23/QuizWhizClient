import React from "react";
import Welcome from "../pages/welcome";
import Login from "../pages/login";
import SignUp from "../pages/sign-up";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import AdminDashboard from "../pages/admin-dashboard";
import UserDashboard from "../pages/user-dashboard";
import { Role } from "../utils/enum";

export const ROUTES = [
  {
    path: '/',
    element: <Welcome />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: '/login',
    element: <Login />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: '/sign-up',
    element: <SignUp />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
    roles: [Role.Admin],
  },
  {
    path: '/user-dashboard',
    element: <UserDashboard />,
    roles: [Role.Contestant],
  }
];