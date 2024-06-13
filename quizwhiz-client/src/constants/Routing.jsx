import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";
import { ROUTES } from "./Routes";
import jwtDecoder from "../services/jwtDecoder";
import Login from "../pages/login";
import { RoutePaths } from "../utils/enum";
import Welcome from "../pages/welcome";

const jwtData = jwtDecoder();
const userRole =
  jwtData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

export const router = createBrowserRouter(
  createRoutesFromElements(
    ROUTES.map((route) => {
      const sendElement = route.element;
      const sendRoles = route.roles;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            AuthorizedRoute({ element : sendElement, roles : sendRoles, userRole : userRole ? userRole : "" }) ? (
              route.element
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
      );
    })
  )
);

// const Routing = () => {
//   const roles = ROUTES[1].roles;
//   console.log(AuthorizedRoute({roles, userRole}));
//   return (<Routes>
//     <Route exact path="/" element={<Welcome />} />
//     <Route exact path="/login" element={<AuthorizedRoute() element={ROUTES[1].element} roles={ROUTES[1].roles} userRole = {userRole} /> != null ? ROUTES[1].element : <Login />} />
//     <Route exact path="/admin-dashboard" element={AuthorizedRoute( element={ROUTES[5].element} roles={ROUTES[5].roles} userRole = {userRole}) != null ? ROUTES[5].element : <Login />} />
//     <Route exact path="/user-dashboard" element={<AuthorizedRoute element={ROUTES[6].element} roles={ROUTES[6].roles} userRole = {userRole} /> != null ? ROUTES[6].element : <Login />} />
//   </Routes>);
// }
