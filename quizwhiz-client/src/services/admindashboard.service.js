import axios from "./axios";
import { API_URLS } from "../utils/enum";
import { addYears } from "date-fns";


export const filterByCategory = async (data) => {
  return await axios.post(API_URLS.QUIZ_FILTER, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};
export const getDifficulties = async () => {
  const response = await axios.get(API_URLS.QUIZ_DIFFICULTIES, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });

  return response;
};
export const getCategories = async () => {
  return await axios.get(API_URLS.QUIZ_CATEGORIES, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const createNewQuiz = async (data) => {
  try {
    const response = await axios.post(
      API_URLS.CREATE_NEW_QUIZ,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizDetailsByLink = async (quizLink) => {
  try {
    const response = await axios.get(
      API_URLS.GET_QUIZ_DETAILS_BY_LINK + quizLink
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// export const addQuizQuestions = async (data) => {
//   try {
//     console.log("token", CurrentToken);
//     const response = await axios.post(
//       API_URLS.ADD_QUIZ_QUESTIONS,
//       JSON.stringify(data),
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${CurrentToken}`,
//         },
//       }
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const changeRecordsSize = async (data) => {
  return await axios.get(API_URLS.QUIZ_RECORDS, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
    params: data,
  });
};
export const getAllStatusCount = async () => {
  return await axios.get(API_URLS.QUIZ_STATUS, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const getQuizQuestions = async (quizLink) => {
  try {
    const response = await axios.get(API_URLS.GET_QUIZ_QUESTIONS + quizLink);
    return response.data;
  } catch (error) {
    console.log("errrrrr");
  }
};

export const updateQuizQuestions = async (data) => {
  try {
    console.log("token", localStorage.getItem("token"));
    const response = await axios.post(
      API_URLS.UPDATE_QUIZ_QUESTION,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuizQuestion = async (questionId) => {
  try {
    const response = await axios.get(
      API_URLS.DELETE_QUIZ_QUESTION + questionId,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateQuizDetails = async (data) => {
  try {
    const response = await axios.post(
      API_URLS.UPDATE_QUIZ_DETAILS,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getQuizDetails = async (Link) => {
  return await axios.get(API_URLS.QUIZ_DETAILS + Link, {
    headers: {
      "Content-Type": "application/json",
      // token: "Bearer " + localStorage.getItem("token")
    },
  });
};

export const DeleteQuiz = async (quizLink) => {
  // try {
    const response = await axios.get(API_URLS.DELETE_QUIZ + quizLink, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  // } catch (error) {
  //   console.log(error);
  // }
};

export const PublishQuiz = async (quizLink)=>{
  debugger;
  try{
   const response = await axios.get(API_URLS.PUBLISH_QUIZ + quizLink, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
   })
   
   console.log(response);
   return response.data;
  }
  catch(error){
    return error.response.data;
    console.log(error.response.data)
  }
}
