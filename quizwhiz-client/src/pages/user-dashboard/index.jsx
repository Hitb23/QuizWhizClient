import React, { useState, useEffect } from "react";
import classes from "./style.module.css";
import LandingHeader from "../../components/header/landing-header";
import { ToastContainer, toast } from "react-toastify";
import { getSingleQuestion } from "../../services/quizSocket.service";
import { getQuizDetailsByLink } from "../../services/admindashboard.service";

const UserDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [questionCount, setQuestionCount] = useState(-1);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const QuizLink = "PEPa86wz";

  useEffect(() => {
    async function fetchQuizData() {
      const response = await getQuizDetailsByLink(QuizLink);
      setTotalQuestions(response.data.TotalQuestion);
    }

    fetchQuizData();
  }, []);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const attendQuiz = async () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    setQuestionCount((q) => {
      const newCount = q + 1;
      if (newCount < totalQuestions) {
        fetchQuestion(newCount);
        return newCount;
      } else {
        return q;
      }
    });

    const newIntervalId = setInterval(async () => {
      setQuestionCount((q) => {
        const newCount = q + 1;
        if (newCount < totalQuestions) {
          fetchQuestion(newCount);
          return newCount;
        } else {
          clearInterval(intervalId);
          return q;
        }
      });
    }, 5000);

    setIntervalId(newIntervalId);
  };

  const fetchQuestion = async (updatedQuestionCount) => {
    console.log("Updated question count : " + updatedQuestionCount);
    console.log("Total question count : " + totalQuestions);
    try {
      const response = await getSingleQuestion({
        QuizLink,
        QuestionCount: updatedQuestionCount,
      });
      if (response.isSuccess) {
        console.log(response.data);
      }
      setCurrentQuestion(response.data);
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <LandingHeader />
        <h1>User Dashboard</h1>
      {/* <ToastContainer /> */}
      <button onClick={attendQuiz}>Attend Quiz</button>
      <h1 className="text-white">Current Question:</h1>
      <p className="text-white">
        {currentQuestion ? currentQuestion.QuestionText : ""}
      </p>

      {currentQuestion && currentQuestion.Options ? (
        currentQuestion.Options.length === 2 ? (
          <div>
            <button>{currentQuestion.Options[0].OptionText}</button>
            <button>{currentQuestion.Options[1].OptionText}</button>
          </div>
        ) : (
          <div>
            {currentQuestion.Options.map((option, index) => (
              <div key={index}>
                <input type="radio" name="option" value={option.OptionText} />
                <label className="text-white">{option.OptionText}</label>
              </div>
            ))}
          </div>
        )
      ) : (
        <div>No question available</div>
      )}

      <h1 className="text-white">Previous Questions:</h1>
      <ul>
        {questions.map((question, index) => (
          <li className="text-white" key={index}>
            {question.QuestionText}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
 
export default UserDashboard;
