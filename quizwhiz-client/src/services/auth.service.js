import axios from "./axios";
import { API_URLS } from "../utils/enum";
export const login = async (data) => {
  return await axios.post(API_URLS.LOGIN_URL, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const adminLogin = async (data) =>{
  return await axios.post(API_URLS.ADMIN_URL,JSON.stringify(data),{
    headers:{
      "Content-Type": "application/json",
    },
  });
};

export const signUp = async (data) => {
  return await axios.post(API_URLS.SIGNUP_URL, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const checkUsername = async (data) => {
  return await axios.post(API_URLS.CHECK_USERNAME_URL, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token"),
    },
  });
};

export const sendResetPasswordLink = async (data) => {
  //debugger;
  return await axios.post(API_URLS.FORGOT_PASSWORD_URL, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const checkToken = async (data) => {
  return await axios.get(API_URLS.VALIDATE_TOKEN_URL + data, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      API_URLS.REEST_PASSWORD,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
