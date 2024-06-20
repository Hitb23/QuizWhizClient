import { Route } from "react-router-dom"

export const RoutePaths = {
  Welcome : "/",
  Login : "/login",
  SignUp : "/sign-up",
  ForgotPassword : "/forgot-password",
  ResetPassword : "/reset-password",
  AdminDashboard : "/admin-dashboard",
  UserDashboard : "/user-dashboard",
  PageNotFound: "/page-not-found",
  AdminLogin:"/admin-login"
}

export const Role = {
  Public : "",
  Admin : "Admin",
  Contestant : "Contestant",
}
export const API_URLS={
  LOGIN_URL : "/Auth/login/",
 SIGNUP_URL : "/User/register",
 USERNAME_VALIDITY_URL : "/User/checkUserName/",
 FORGOT_PASSWORD_URL : "/Auth/forgot-password/",
 VALIDATE_TOKEN_URL: `/Auth/validate-reset-token?token=`,
 REEST_PASSWORD: "/Auth/reset-password",
 ADMIN_LOGIN:"/Auth/admin-login"
}