import { Route } from "react-router-dom";

export const RoutePaths = {
  Welcome: "/",
  Login: "/login",
  SignUp: "/sign-up",
  ForgotPassword: "/forgot-password",
  ResetPassword: "/reset-password",
  AdminDashboard: "/admin-dashboard/upcoming",
  Quizzes: "/quizzes",
  PageNotFound: "/page-not-found",
  MyProfile: "/my-profile",
  AdminLogin: "/admin-login",
  CreateNewQuiz:"/create-new-quiz",
  GetQuizDetails:"/get-quiz-details",
  AddQuizQuestions:"/add-quiz-questions"
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
  CREATE_NEW_QUIZ:'/quiz/create-new-quiz',
  GET_QUIZ_DETAILS_BY_LINK :`/quiz/get-quiz-details?quizLink=`,
  ADD_QUIZ_QUESTIONS:'/quiz/add-quiz-questions',
  QUIZ_RECORDS:'/auth/change-record-size',
  QUIZ_STATUS:'/quiz/get-quiz-status-count',
  GET_SINGLE_QUESTION:'/quiz/get-single-quiz-question',
  GET_COUNT_OF_QUESTIONS: '/quiz/get-count-of-questions',
  QUIZ_DETAILS:'/quiz/get-quiz-details?quizLink=',
  DELETE_QUIZ:'/quiz/delete-quiz?quizLink='
};
export const statusEnum={
  "pending": 1,
  "upcoming": 2,
  "active": 3,
  "completed": 4
}

export const DIFFICULTIES = {
  1: "Easy",
  2: "Medium",
  3: "Hard"
}

export const CATEGORIES = {
  1: "General Knowledge",
  2: "Entertainment",
  3: "Education",
  4: "Sports",
  5: "Technology"
}