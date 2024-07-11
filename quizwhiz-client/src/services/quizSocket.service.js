import axios from "./axios";
import { API_URLS } from "../utils/enum";

export const getSingleQuestion = async (data) => {
  try {
    const response = await axios.post(API_URLS.GET_SINGLE_QUESTION, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // rethrow the error to handle it in the calling function
  }
};