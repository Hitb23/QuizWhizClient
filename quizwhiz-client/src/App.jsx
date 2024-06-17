import "./App.css";
import { Route, RouterProvider, Routes } from "react-router-dom";
import { router } from "./constants/Routing";
import Welcome from "./pages/welcome";

const App = () => {
  return (
     <RouterProvider router={router()} />
  );
};

export default App;
