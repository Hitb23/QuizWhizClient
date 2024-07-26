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

export const adminLogin = async (data) => {
  return await axios.post(API_URLS.ADMIN_URL, JSON.stringify(data), {
    headers: {
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

export const uploadProfilePhoto = async (ProfilePhoto, Username) => {
  const formData = new FormData();
  formData.append("ProfilePhoto", ProfilePhoto);
  formData.append("Username", Username);
  return await axios.post(API_URLS.UPLOAD_PHOTO, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserDetails = async (userName) => {
  return await axios.get(API_URLS.GET_USER_DATA + userName, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const editProfile = async (data) => {
  return await axios.post(API_URLS.EDIT_PROFILE, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getContestRecords = async (data) => {
  return await axios.get(API_URLS.VALIDATE_TOKEN_URL, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const createNewQuiz = async (data) =>{
  try {
    const CurrentToken = localStorage.getItem("token");
    console.log('CurrentToken:', CurrentToken);
    const response = await axios.post(API_URLS.CREATE_NEW_QUIZ, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CurrentToken}`
      }
    });
    return response.data;
 
  } catch (error) {
    console.log(error);
  }
};