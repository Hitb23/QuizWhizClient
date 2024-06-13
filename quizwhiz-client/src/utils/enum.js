import { Route } from "react-router-dom"

export const RoutePaths = {
  Welcome : "/",
  Login : "/login",
  SignUp : "/sign-up",
  ForgotPassword : "/forgot-password",
  ResetPassword : "/reset-password",
  AdminDashboard : "/admin-dashboard",
  UserDashboard : "/user-dashboard",
}

export const Role = {
  Public : "",
  Admin : "Admin",
  Contestant : "Contestant",
}