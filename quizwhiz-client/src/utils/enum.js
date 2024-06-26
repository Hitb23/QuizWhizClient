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
  MyProfile: "/my-profile",
  AdminLogin: "/admin-login",
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
  EDIT_PROFILE: "/auth/edit-profile",
  GET_USER_DATA: "/auth/get-profile-details?username=",
  UPLOAD_PHOTO: "/auth/upload-profile-photo",
  QUIZ_DIFFICULTIES:"/quiz/get-quiz-difficulties",
  QUIZ_CATEGORIES:"/quiz/get-quiz-categories",
  QUIZ_FILTER:'/quiz/get-quizzes-filter',
  QUIZ_RECORDS:'/auth/change-record-size',
  QUIZ_STATUS:'/quiz/get-quiz-status-count'
};
export const statusEnum={
  "pending": 1,
  "upcoming": 2,
  "active": 3,
  "completed": 4
}