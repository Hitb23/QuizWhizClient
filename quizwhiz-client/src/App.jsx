import "./App.css";
import { Route, RouterProvider, Routes } from "react-router-dom";
import { router } from "./constants/Routing";
import Welcome from "./pages/welcome";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
     <ToastContainer/>
     <RouterProvider router={router()} />
     </>
  );
};

export default App;
