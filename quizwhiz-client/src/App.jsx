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
    actions.changeUserRole(authToken["Role"]);
    actions.changeUserName(authToken["Username"]);
    actions.changeUserEmail(authToken["Email"]);
  }

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("token-expiry");

    // if (tokenExpiry) {
    //   const currentTime = new Date().getTime();
    //   const delay = tokenExpiry - currentTime;

    //   if (delay > 0) {
    //     setTimeout(() => {
    //       localStorage.removeItem("token");
    //       localStorage.removeItem("token-expiry");
    //     }, delay);
    //   } else {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("token-expiry");
    //   }
    // }
  }, []);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router()} />
    </>
  );
};

export default App;
