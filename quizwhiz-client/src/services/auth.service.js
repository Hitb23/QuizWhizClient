import axios from "./axios";

const LOGIN_URL = '/Auth/login/';
const SIGNUP_URL = '/User/register';
const USERNAME_VALIDITY_URL = '/User/checkUserName/';

export const login = async (data) => {
  return await axios.post(LOGIN_URL, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const signUp = async (data) => {
  return await axios.post(SIGNUP_URL, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const userNameValidity = async (data) => {
  return await axios.get(USERNAME_VALIDITY_URL, {
    params: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
