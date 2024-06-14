import React from "react";
import axios from "./axios";
const userNameValidity = async (data) => {
  return await axios.get("/User/checkUserName/", {
    params: data,
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
// api/User/checkUserName
export default userNameValidity;
