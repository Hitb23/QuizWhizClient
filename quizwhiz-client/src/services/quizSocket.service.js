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
export const fetchUserCoinsAndLifeline = async (userName) => {
  try {
    const response = await axios.get(
      API_URLS.COINS_LIFELINE_URL+userName,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};