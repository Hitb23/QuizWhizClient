import "./App.css";
import { Route, RouterProvider, Routes } from "react-router-dom";
import { router } from "./constants/Routing";
import Welcome from "./pages/welcome";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { userActions } from "./redux/action-creators";
import jwtDecoder from "./services/jwtDecoder";

const App = () => {
  const authToken = jwtDecoder();
  const dispatch = useDispatch();
  const actions = bindActionCreators(userActions, dispatch);

  {
    console.log(authToken["Role"]);
    actions.changeUserRole(authToken["Role"]);
    actions.changeUserName(authToken["Username"]);
    actions.changeUserEmail(authToken["Email"]);
  }
  
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router()} />
    </>
  );
};

export default App;
