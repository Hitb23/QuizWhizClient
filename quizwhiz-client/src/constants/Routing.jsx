import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";
import { ROUTES } from "./Routes";
import { RoutePaths } from "../utils/enum";
import { useSelector } from "react-redux";

export const router = () => {
  const userRole = useSelector((state) => state.userRole.userRole);
  return createBrowserRouter(
    createRoutesFromElements(
      ROUTES.map((route) => {
        const sendElement = route.element;
        const sendRoles = route.roles;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              AuthorizedRoute({
                roles: sendRoles,
                userRole: userRole ? userRole : "",
              }) ? (
                route.element
              ) : (
                <Navigate to={RoutePaths.PageNotFound} />
              )
            }
          />
        );
      })
    )
  );
};
