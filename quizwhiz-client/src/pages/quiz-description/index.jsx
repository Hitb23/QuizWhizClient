import React from "react";
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
import description from "../../assets/quizdesc.svg";
import { GiPodiumWinner } from "react-icons/gi";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { TbListDetails } from "react-icons/tb";
const QuizDescription = () => {
  const ShiningButton = styled(Button)({
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#6200ea",
    backgroundImage: "linear-gradient(270deg, #ff00c8, #6200ea)",
    backgroundSize: "200% 200%",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    transition: "background-position 1s",
    "&:hover": {
      backgroundPosition: "right center",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(255, 255, 255, 0.2)",
      opacity: "0",
      transition: "opacity 0.3s",
    },
    "&:hover:before": {
      opacity: "1",
    },
  });
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
          <Typography
            variant="h2"
            gutterBottom
            className={`${classes["text-background"]} text-white fw-bold mt-3`}
          >
            Quiz Competition 2024
            <small className="text-white bg-success rounded-4 p-2 ms-4">
              Live
            </small>
          </Typography>

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
              gap: "2rem",
              justifyContent: "space-between",
              display: "flex",
              padding: "40px",
              marginTop: "20px",
              backgroundImage: `url(${description})`,
              // "linear-gradient(90deg, hsla(284, 100%, 53%, 1) 0%, hsla(77, 100%, 64%, 1) 100%)",
            }}
          >
            <div className="text-center">
              <h3 className="text-white fw-bold">Opens on</h3>
              <h5 className="text-white fw-semibold">
                <IoTime size={25} /> Jun 08, 2024, 09:00 AM IST
              </h5>
            </div>
            <div className="text-center">
              <h3 className="text-white fw-bold">Closes on</h3>
              <h5 className="text-white fw-semibold">
                <IoTime size={25} /> Jun 09, 2024, 08:00 PM IST
              </h5>
            </div>
            <div className="text-center">
              <h4 className="text-white fw-bold">Total Participants</h4>
              <h4 className="text-white">
                <FaUsers size={25} /> 10002
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
            - The quiz will consist of multiple-choice questions.
            <br />
            - There will be three rounds.
            <br />
            - Points will be awarded for each correct answer.
            <br />
            - Participants must maintain decorum.
            <br />
            - The quiz will cover a range of topics.
            <br />
            - There will be prizes for the top participants.
            <br />
            - Electronic devices are not allowed during the quiz.
            <br />
            - Registration is required to participate.
            <br />
          </Typography>

          <Typography
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
            Registration
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
