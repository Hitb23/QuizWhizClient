import axios from "./axios";
import { API_URLS } from "../utils/enum";
export const filterByCategory = async (data) => {
  return await axios.post(API_URLS.QUIZ_FILTER, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const getDifficulties = async () => {
  return await axios.get(API_URLS.QUIZ_DIFFICULTIES, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const getCategories = async () => {
  return await axios.get(API_URLS.QUIZ_CATEGORIES, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
