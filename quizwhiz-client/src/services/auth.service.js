import axios from "./axios";

export const login = async (data) => {
  return await axios.post("/Auth/login/", JSON.stringify(data), {
    headers: { "Content-Type": "application/json"
      // token: "Bearer " + localStorage.getItem("token")
     },
  });
};

export const signup = async (data) => {
  return await axios.post("/User/register",JSON.stringify(data), {
    headers: { "Content-Type": "application/json"}
  });
};

export const userNameValidity = async (data) => {
  //debugger;
  return await axios.get("/User/checkUserName/", {
    params: data,
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const SendMail = async (data) => {
  //debugger;
  return await axios.get("/User/ForgotPassword/", {
    params: data,
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const checkToken = async (data) => {
  //debugger;
  return await axios.get("/User/checkTokenValidity/", {
    params: data,
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};