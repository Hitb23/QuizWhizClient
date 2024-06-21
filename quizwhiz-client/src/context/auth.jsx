import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import Shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialUserValue = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  roleId: 0,
  role: "",
  password: "",
};

const initialState = {
  setUser: () => {},
  user: initialUserValue,
  signOut: () => {},
  appInitialize: false,
}

export const AuthContext = createContext(initialState);

export const AuthWrapper = ({ children }) => {

}

export const useAuthContext = () => {
  return useContext(AuthContext);
}