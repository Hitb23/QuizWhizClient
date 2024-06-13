import "./App.css";
import { router } from "./constants/Routing";
import { Route, RouterProvider } from "react-router-dom";

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
