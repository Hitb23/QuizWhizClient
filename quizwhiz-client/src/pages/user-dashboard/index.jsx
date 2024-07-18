import React, { useState, useEffect } from "react";
import classes from "./style.module.css";
import LandingHeader from "../../components/header/landing-header";
import { ToastContainer, toast } from "react-toastify";
import { getSingleQuestion } from "../../services/quizSocket.service";
import { getQuizDetailsByLink } from "../../services/admindashboard.service";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder } from "@microsoft/signalr";

const UserDashboard = () => {
  const { quizLink } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionId, setQuestionId] = useState(0);
  const [connection, setConnection] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    async function fetchQuizData() {
      const response = await getQuizDetailsByLink(quizLink);
      console.log("Data");
      console.log(response.data);
      setTotalQuestions(response.data.TotalQuestion);
    }

    fetchQuizData();

    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44361/quizhub")
      .build();
    setConnection(connection);

    connection.on("ReceiveQuestion", (question) => {
      console.log("Question : ");
      console.log(question);
      setCurrentQuestion(question);
      setQuestionCount((prevCount) => prevCount + 1);
      setQuestionId(question.questionId);
      console.log("QuestionId : " + typeof(question.questionId));
    });

    connection.on("ReceiveCorrectAnswer", (answer) => {
      console.log("Correct ans : " + answer);
      setCorrectAnswer(answer);
    });

    connection.on("ReceiveError", (message) => {
      console.log(message);
    });

    connection.on("GetTitleOfQuiz", (data) =>  {
      console.log(data);
    });

    connection.start().catch((error) => {
      console.error(error);
    });

    // fetchQuestion(0);
  }, []);

  // const fetchQuestion = async (updatedQuestionCount) => {
  //   if (questionCount <= totalQuestions) {
  //     await connection
  //       .invoke("GetNewQuestion", quizLink, updatedQuestionCount)
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };

  const getCorrectAnswer = async (quizLink, questionCount) => {
    console.log("Quizlink and its type: " + quizLink + typeof(quizLink));
    if (questionCount <= totalQuestions) {
      await connection
        .invoke("GetCorrectAnswer", quizLink, questionCount)
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (questionCount <= totalQuestions) {
      // fetchQuestion(questionCount);
      // getCorrectAnswer(quizLink, questionCount);
    }
  }, [questionCount, totalQuestions]);

  return (
    <React.Fragment>
      <LandingHeader />
        <h1>User Dashboard</h1>
      {/* <ToastContainer /> */}
      <button onClick={attendQuiz}>Attend Quiz</button>
      <h1 className="text-white">Current Question:</h1>
      <div className="d-flex justify-content-center">
        <div className="text-white">
          {currentQuestion ? (
            <div className="d-flex align-items-center text-white">
              <div>{currentQuestion.questionText}</div>
            </div>
          ) : (
            <div>No question available</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="text-white">
          {correctAnswer ? (
            <div className="d-flex align-items-center text-white">
              <div>{correctAnswer}</div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {currentQuestion && currentQuestion.options ? (
        currentQuestion.options.length === 2 ? (
          <div className="d-flex justify-content-center">
            <button>{currentQuestion.options[0].optionText}</button>
            <button>{currentQuestion.options[1].optionText}</button>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center">
            {currentQuestion.options.map((option, index) => (
              <div className="d-flex align-items-center mb-2" key={index}>
                <input
                  type="radio"
                  name="option"
                  className="me-2"
                  value={option.optionText}
                />
                <label className="text-white">{option.optionText}</label>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-white">No question available</div>
      )}
    </React.Fragment>
  );
};

export default UserDashboard;