import React from "react";
import { jwtDecode } from "jwt-decode";

const jwtDecoder = () => {
  try{
    const data = jwtDecode(localStorage.getItem("token"));
    return data;
  }
  catch(error)
  {
    return error;
  }
};

export default jwtDecoder;
