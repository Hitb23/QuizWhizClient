import React from "react";
import Welcome from "../pages/welcome";
import Login from "../pages/login";
import SignUp from "../pages/sign-up";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import AdminDashboard from "../pages/admin-dashboard";
import UserDashboard from "../pages/user-dashboard";
import { Role } from "../utils/enum";
import NotFoundPage from "../pages/page-not-found";
import AdminLogin from "../pages/admin-login";
import MyProfile from "../pages/my-profile";
import AdminCategory from "../pages/admin-category";
import CreateQuizModal from "../components/dialog-boxes/create-quiz";
import AddQuestions from "../components/dialog-boxes/add-questions";
import ViewQuizModal from "../components/dialog-boxes/view-quiz";
import QuizDescription from "../pages/problem-description";
import QuizList from "../pages/quiz-list";
import Quiz from "../pages/QuizHub";

export const ROUTES = [
  {
    path: "/",
    element: <Welcome />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/login",
    element: <Login />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    roles: [Role.Public],
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/admin-dashboard/:id",
    element: <AdminDashboard />,
    roles: [Role.Admin],
  },
  {
    path: "/quizzes",
    element: <QuizList />,
    roles: [Role.Contestant],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/my-profile",
    element: <MyProfile />,
    roles: [Role.Admin, Role.Contestant],
  },
  {
    path: "/admin/dashboard/:id",
    element: <AdminCategory />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/create-new-quiz/:token",
    element: <CreateQuizModal />,
    roles: [Role.Admin],
  },
  {
    path: "/get-quiz-details/:quizLink",
    element: <AddQuestions />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path:'/add-quiz-questions/:quizLink',
    element:<AddQuestions/>,
    roles:[Role.Admin]
  },
  {
    path:'/get-quiz-questions/:quizLink',
    element:<AddQuestions/>,
    roles:[Role.Admin]
  },

  {
    path:'/update-quiz-questions:token',
    element:<ViewQuizModal/>,
    roles:[Role.Admin]
  },
  {
    path:'/admin-dashboard/:id/:quizLink',
    element:<QuizDescription/>,
    roles:[Role.Admin, Role.Contestant, Role.Public]
  },
  {
    path: "/user-dashboard/:quizLink",
    element: <UserDashboard />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
  {
    path: "/admin-dashboard/quiz",
    element: <Quiz />,
    roles: [Role.Admin, Role.Contestant, Role.Public],
  },
];
