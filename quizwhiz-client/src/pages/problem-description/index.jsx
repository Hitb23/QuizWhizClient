import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Link,
  Slider,
  Tooltip,
} from "@mui/material";
import Logo from "../../assets/technology.jpg";
import AdminSlider from "../../components/header/admin-header";
import classes from "./style.module.css";
import { IoTime } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import description from "../../assets/scheduleimg.svg";
import { GiPodiumWinner } from "react-icons/gi";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { TbListDetails, TbRotate360 } from "react-icons/tb";
import { useParams } from "react-router";
import { getQuizDetails } from "../../services/admindashboard.service";
import { ShiningButton } from "../../components/admin-components";
import { AnimationOutlined, Rotate90DegreesCcwRounded } from "@mui/icons-material";
const QuizDescription = () => {
  const [quizData,SetQuizData]=useState(null);
  const params=useParams();
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      // Remove timeZoneName option to exclude time zone name
    };
  
    // Create a Date object from the dateString
    const date = new Date(dateString);
  
    // Format the date using toLocaleString
    return date.toLocaleString('en-US', options);
  };
  const addOneHour = (dateString) => {
    // Create a Date object from the dateString
    const date = new Date(dateString);
  
    // Add one hour to the Date object
    date.setHours(date.getHours() + 1);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      // Remove timeZoneName option to exclude time zone name
    };
  
    // Create a Date object from the dateString
    const newDate = new Date(date);
  
    // Format the date using toLocaleString
    return newDate.toLocaleString('en-US', options);
    // Return the updated date as a string
    // return newDate.toISOString(); // Return ISO string for consistent formatting
  };
  useEffect(()=>{
    const QuizDetailsHandler=async()=>{
    try{
       const data=await getQuizDetails(params.quizLink);
       console.log(data?.data.data);
       SetQuizData(data?.data.data);
    }
    catch(error){
       console.log(error);
    }
  }
  QuizDetailsHandler();
  },[]);
  return (
    <>
      {/* <AdminSlider/>
      <Slider/> */}
      <div className="w-100 mx-0" style={{ background: "#362469" }}>
        {/* <img
          src={Logo}
          alt="Quiz Logo"
          style={{ width: "100%", height: "510px", maxHeight: "400px" }}
        /> */}
        <Container className={`${classes["bg-image"]} `}>
          <img
            src={Logo}
            alt="Quiz Logo"
            style={{ width: "100%", maxHeight: "400px" }}
          />
          <div className="d-flex align-items-center flex-wrap gap-2">
          <Typography
            variant="h2"
            gutterBottom
            className={`text-white fw-bold mt-3 text-break`}
          >
           {quizData && quizData.Title.substring(0,25)}
          </Typography>
            <h3 className="text-white bg-success rounded-4 p-2 ms-4 fw-bold text-center">
              Live
            </h3>
            <ShiningButton className="fw-bold fs-5 " style={{textTransform:'capitalize'}}>
              Edit Quiz Details  <EditIcon/>
            </ShiningButton>
            <ShiningButton  className="fw-bold fs-5 " style={{textTransform:'capitalize'}}> 
              Delete  <DeleteIcon/>
            </ShiningButton>
           </div>
          <Typography
            variant="h5"
            gutterBottom
            className="text-white fw-semibold"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 0%, hsla(77, 100%, 64%, 1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Join us for an exciting quiz competition to test your knowledge!
          </Typography>

          <div
            style={{
              borderRadius: "10px",
              marginTop: "20px",
              backgroundImage: `url(${description})`,
              // "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 0%, hsla(77, 100%, 64%, 1) 100%)",
            }}
            className="row p-4 gy-3 gx-2"
          >
            <div className="text-center col-xl-4 col-md-6 mt-2  shadow py-3">
              <h3 className="text-white fw-bold">Opens on</h3>
              <h5 className="text-white fw-semibold">
                <IoTime size={25} /> {formatDate(quizData?.ScheduledDate)} 
              </h5>
            </div>
            <div className="text-center col-xl-4 col-md-6  mt-2  shadow py-3">
              <h3 className="text-white fw-bold">Closes on</h3>
              <h5 className="text-white fw-semibold">
                <IoTime size={25} /> {addOneHour(quizData?.ScheduledDate)} 
              </h5>
            </div>
            <div className="text-center col-xl-4 col-md-12  mt-2 shadow py-3">
              <h4 className="text-white fw-bold">Total Participants</h4>
              <h4 className="text-white fw-semibold">
                <FaUsers size={25} /> 100K+
              </h4>
            </div>
          </div>

          <Typography
            variant="h4"
            gutterBottom
            style={{
              marginTop: "20px",
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 10%, hsla(77, 100%, 64%, 1) 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-white fw-semibold"
          >
            About Contest <TbListDetails />
          </Typography>
          <Typography variant="h6" className="text-white mb-2">
          - The quiz will consist of multiple-choice questions (MCQ), multiple select questions (MSQ), true or false questions, and written quizzes.
          <br />
          - Each question carries 4 marks.
          <br />
          - Negative marking is applied for every wrong answer.
          <br />
          - If you leave the contest midway, your score will not be counted.
          <br />
          - Plagiarism is strictly prohibited and will result in disqualification.
          <br />
          - The quiz has three difficulty levels: Easy, Medium, and Hard. You will be asked questions specific to the chosen category.
          <br />
          - There will be only one winner for the quiz.
          <br />
          - Participants must score a minimum of 34 marks out of 100 to be considered for ranking.
          <br />
          - Judging will be based on the timing of quiz completion, and only correct answers will contribute to the final score.
          <br />
          - Participants can view their marks and rank on the leaderboard.
        </Typography>

          {/* <Typography
            variant="h4"
            gutterBottom
            className="text-white fw-semibold"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 10%, hsla(77, 100%, 64%, 1) 50%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            
          </Typography>
          <Typography variant="h6" paragraph className="text-white mb-2">
            To register, click the button below and fill out the registration
            form before July 15, 2024.
          </Typography>
          <div className="d-flex gap-2">
            <ShiningButton>
              Edit <EditIcon />
            </ShiningButton>
            <ShiningButton>
              Delete <DeleteIcon />
            </ShiningButton>
          </div> */}
          <Typography
            variant="h4"
            gutterBottom
            style={{
              marginTop: "20px",
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 10%, hsla(77, 100%, 64%, 1) 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-white fw-semibold"
          >
            Prizes and Awards <GiPodiumWinner />
          </Typography>
          <Typography variant="h6" paragraph className="text-white mb-2">
            We're thrilled to announce that this time, there will be only one
            grand winner! The lucky champion will walk away with an amazing
            prize of $1000. Get ready to compete and put in your best effort
            because the stakes are high, and the reward is even higher! Will you
            be the one to claim the $1000 prize?
          </Typography>

          <Typography
            variant="h4"
            gutterBottom
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 10%, hsla(77, 100%, 64%, 1) 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="text-white fw-semibold"
          >
            Contact Us
          </Typography>
          <Typography variant="h6" className="text-white mb-2">
            For any queries, contact us at quiz@example.com or call (123)
            456-7890.
          </Typography>

          <Typography
            variant="h4"
            gutterBottom
            className="text-white fw-semibold"
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 10%, hsla(77, 100%, 64%, 1) 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Comments
          </Typography>
          <Typography variant="body1" paragraph className="text-white">
            <Link href="/faqs">
              Click here to read the frequently asked questions.
            </Link>
          </Typography>

          <footer
            style={{
              marginTop: "40px",
              padding: "20px 0",
              borderTop: "1px solid #ccc",
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              className="text-white"
            >
              &copy; 2024 Quiz Competition. All rights reserved.
            </Typography>
          </footer>
        </Container>
      </div>
    </>
  );
};

export default QuizDescription;
