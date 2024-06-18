import axios from "./axios";

export const login = async (data) => {
  return await axios.post("/Auth/login/", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const signup = async (data) => {
  return await axios.post("/User/register", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

export const userNameValidity = async (data) => {
  return await axios.get("/User/checkUserName/", {
    params: data,
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const sendResetPasswordLink = async (data) => {
  //debugger;
  return await axios.post("/Auth/forgot-password/", 
  JSON.stringify(data),
  {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const checkToken = async (data) => {
  debugger;
  return await axios.get(`/Auth/validate-reset-token?token=${data}`, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      "/Auth/reset-password",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          // Uncomment and modify the line below if an authorization token is needed
          // 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    // Handle error as appropriate
    console.error("Error resetting password:", error);
    throw error;
  }
};
