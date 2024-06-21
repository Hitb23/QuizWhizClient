import { Route } from "react-router-dom";

export const RoutePaths = {
  Welcome: "/",
  Login: "/login",
  SignUp: "/sign-up",
  ForgotPassword: "/forgot-password",
  ResetPassword: "/reset-password",
  AdminDashboard: "/admin-dashboard",
  UserDashboard: "/user-dashboard",
  PageNotFound: "/page-not-found",
};

export const Role = {
  Public: "",
  Admin: "Admin",
  Contestant: "Contestant",
};
export const API_URLS = {
  LOGIN_URL: "/auth/login/",
  ADMIN_URL: "/auth/admin-login/",
  SIGNUP_URL: "/auth/sign-up/",
  CHECK_USERNAME_URL: "/auth/check-username/",
  FORGOT_PASSWORD_URL: "/auth/forgot-password/",
  VALIDATE_TOKEN_URL: `/auth/validate-reset-password-token?token=`,
  REEST_PASSWORD: "/auth/reset-password/",
};
