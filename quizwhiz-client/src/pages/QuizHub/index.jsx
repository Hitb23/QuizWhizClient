// import React, { useState, useEffect } from "react";
// import { HubConnectionBuilder } from "@microsoft/signalr";
// import jwtDecoder from "../../services/jwtDecoder";
// import useWindowSize from 'react-use/lib/useWindowSize'
// import Confetti from 'react-confetti'
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";

// const Quiz = () => {
//   const [minutes, SetMinutes] = useState(0);
//   const [Seconds, SetSeconds] = useState(0);
//   const [newMessage, setNewMessage] = useState("");
//   const [Question,SetQuestion]=useState("");
//   const [connection, setConnection] = useState(null);
//   const [isContestActive, setIsContestActive] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(null);
//   const [showJoinButton, setShowJoinButton] = useState(false);
//   const [questiontext,SetQuestiontext]=useState('');
//   const formatTime = (time) => {
//     const seconds = String(time.seconds).padStart(2, "0");
//     const minutes = String(time.minutes).padStart(2, "0");
//     const hours = String(time.hours).padStart(2, "0");
//     return `${hours}:${minutes}:${seconds}`;
//   };

//    useEffect(() => {
//     const connection = new HubConnectionBuilder()
//       .withUrl("https://localhost:44361/quizhub")
//       .withAutomaticReconnect()
//       .build();
//     setConnection(connection);

//     connection.on("ReceiveRemainingTime_PEPa86wz", (minutes, seconds) => {
//       connection
//       .invoke("SendAnswer", user,4)
//       .catch((error) => console.error("SendMessage failed: ", error));
//       console.log(minutes + "-" + seconds);
//       SetMinutes(minutes);
//       SetSeconds(seconds)
//     });
//     connection.on("ReceiveQuestion_PEPa86wz", (questionNo,Question,seconds) => {
//       console.log("QuestionNo : "+ questionNo +" : " + Question)
//       SetQuestion(Question);
//       // SetSeconds(seconds)
//     });
//     connection.on("ReceiveTimerSeconds_PEPa86wz", (seconds) => {
//       console.log("TimerSeconds : "+ seconds)
//       // SetSeconds(seconds)
//     });
//     connection.on("ReceiveAnswer_PEPa86wz", (questionNo,ans,seconds) => {
//       console.log("questionNo : "+questionNo +" : "+"Answer : "+ans)
//       // console.log(ans);
//       // SetSeconds(seconds)
//     });

//     console.log(connection);
//       connection
//         .start()
//         .catch((error) => console.error("Connection failed: ", error));
//       return () => connection.stop();
//   }, [Seconds,Question]);

//   const fun=async()=> {
//     console.log(connection)
//     if(connection){
//       await connection.invoke("UpdateScore",'WJqpRNMN','ishanbhatt',59,[1]);
//     }
//   }

//   return (
//   //   <div>
//   //      <Confetti
//   //      className="h-100 w-100"
//   //     />
//   //     <h1>Quiz Whiz</h1>
//   //     <button onClick={fun}>Send Message</button>
//   //     <button>Open </button>
//   //   </div>
//   // )
// };

// export default Quiz;
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Badge } from "@mui/material";
import LifeLineIcons from "../../../src/assets/lifeline.svg";
import {
  Skip,
  Shield,
  Time,
  Priceicon,
  Heart,
  CoinIcon,
  Knapsack,
  CrossMoney,
  LifeLineBG,
} from "../../../src/assets/index";
import withReactContent from "sweetalert2-react-content";
import classes from "./style.module.css";
import Swal from "sweetalert2";
import CoinsCard from "../../components/admin-cards/coins-card";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const Quiz = ({ isOpen, closeHandler, coinsAndLifelinesDetails }) => {
  const [open, setOpen] = React.useState(isOpen);
  const [coins, setCoins] = useState(coinsAndLifelinesDetails?.CoinsCount);
  const [userlifeLines, setUserLifeLines] = useState(
    coinsAndLifelinesDetails?.UserLifelines
  );
  const [lifelines, setLifelines] = useState(
    coinsAndLifelinesDetails?.Lifelines
  );
  const MySwal = withReactContent(Swal);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    closeHandler();
  };
  const incrementHandler = (ele) => {
    IncrementCount();
  };
  const NotEnoughCoinsHandler = async (e) => {
    e.preventDefault();
    await Swal.fire({
      // icon: "error",
      imageUrl: CrossMoney,
      imageHeight: "10rem",
      background: "#3d3189",
      title: "Oops...",
      color: "white",
      text: "You Don't Have Enough Amount To Purchase Lifeline!",
      confirmButtonColor: "#6F41DB",
    });
  };
  return (
    <React.Fragment>
      {/* <button className="bg-white"  onClick={handleClickOpen}>
        Open dialog
      </button> */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          color: "white",
          zIndex: "5",
        }}
      >
        <CloseIcon />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        maxWidth={true}
        sx={{
          zIndex: "10",
          marginTop: "6rem",
          "& .closeButton": {
            position: "absolute",
            top: "-20px", // Adjust the value to move the button outside the dialog
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, background: "#3d3189", width: "55rem" }}
          id="customized-dialog-title"
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-2 align-items-center">
              <h2 className={` ${classes["Shoptext"]} text-black mt-1`}>
                Shop
              </h2>
              <img src={Knapsack} height={45} />
            </div>

            <div className="d-flex">
              <div
                className={`rounded-4 d-flex  justify-content-between align-items-center m-3 ${classes["lifeLineShadow"]}`}
                style={{ background: "#6F41DB" }}
              >
                <img src={Heart} height={28} className={`ms-2 me-3 my-2 `} />
                <small
                  className={`mx-2 fw-bold fs-5  px-2 ${classes["text-bg"]}`}
                >
                  {userlifeLines?.length}
                </small>
              </div>

              <div
                className={`rounded-4 d-flex  justify-content-between align-items-center m-3 ${classes["lifeLineShadow"]}`}
                style={{ background: "#6F41DB" }}
              >
                <img src={CoinIcon} height={28} className={`ms-2 me-3 my-2`} />
                <small className={`mx-2 fw-bold fs-5 ${classes["text-bg"]}`}>
                  {coins}
                </small>
              </div>
            </div>
          </div>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ height: "37rem", width: "100%", background: "#6F41DB" }}
        >
          <h2 className={` ${classes["Shoptext"]} text-black mt-1`}>
            Purchase Lifeline
          </h2>
          <div className="d-flex justify-content-center my-2 rounded-2">
            <img src={LifeLineBG} height={200} />
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap  gap-3 rounded-2">
            {/* <div
              className="d-flex flex-column align-items-center rounded-2 gap-3 flex-grow-1  "
              style={{ background: "#3d3189" }}
            >
              <img
                src={Skip}
                height={110}
                className={`${classes["hanging-image"]} mx-5 mt-4`}
              />
              <div className="d-flex justify-content-between align-items-center gap-3 bg-gradient px-3 rounded-3">
                <img src={Priceicon} height={25} />
                <h5 className={`${classes["text-bg"]} text-white mt-2`}>30</h5>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3 pb-3">
                <div className={` ${classes["coin-btn"]} `}>
                  <button
                    className={` ${classes["coin-btn"]} ${classes["text-bg"]} `}
                    onClick={() => AddCoinsHandler()}
                  >
                    + Add
                  </button>
                </div>
                <div className={`${classes["count-of-lifeline"]}`}>
                  <span className={` ${classes["text-bg"]}`}>0</span>
                </div>
              </div>
            </div>
            <div
              className="d-flex flex-column align-items-center gap-3 rounded-2 flex-grow-1 "
              style={{ background: "#3d3189" }}
            >
              <img
                src={Shield}
                height={110}
                className={`${classes["hanging-image"]} mx-5 mt-4`}
              />
              <div className="d-flex justify-content-between align-items-center gap-3 bg-gradient px-3 rounded-3">
                <img src={priceicon} height={25} />
                <h5 className={`${classes["text-bg"]} text-white mt-2`}>25</h5>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3 pb-3">
                <div className={` ${classes["coin-btn"]} `}>
                  <button
                    className={` ${classes["coin-btn"]} ${classes["text-bg"]} `}
                  >
                    + Add
                  </button>
                </div>
                <div className={`${classes["count-of-lifeline"]}`}>
                  <span className={` ${classes["text-bg"]}`}>0</span>
                </div>
              </div>
            </div>

            <div
              className="d-flex flex-column align-items-center gap-3 rounded-2 flex-grow-1 "
              style={{ background: "#3d3189" }}
            >
              <img
                src={Time}
                height={110}
                className={`${classes["hanging-image"]} mx-5 mt-4`}
              />
              <div className="d-flex justify-content-between align-items-center gap-3 bg-gradient px-3 rounded-3">
                <img src={priceicon} height={25} />
                <h5 className={`${classes["text-bg"]} text-white mt-2`}>95</h5>
              </div>
              <div className="d-flex justify-content-between align-items-center gap-3 pb-3">
                <div className={` ${classes["coin-btn"]} `}>
                  <button
                    className={` ${classes["coin-btn"]} ${classes["text-bg"]}`}
                    onClick={NotEnoughCoinsHandler}
                  >
                    + Add
                  </button>
                </div>
                <div className={`${classes["count-of-lifeline"]}`}>
                  <span className={` ${classes["text-bg"]}`}> 0</span>
                </div>
              </div>
            </div> */}
            <CoinsCard
              imageUrl={Skip}
              value={lifelines[0].Value}
              priceIcon={Priceicon}
              totalLifeline={userlifeLines[0]?.LifelineCount}
              incrementCount={incrementHandler}
              NotEnoughCoinsHandler={NotEnoughCoinsHandler}
            />
            <CoinsCard
              imageUrl={Shield}
              value={lifelines[1].Value}
              priceIcon={Priceicon}
              totalLifeline={userlifeLines[1]?.LifelineCount}
              incrementCount={incrementHandler}
              NotEnoughCoinsHandler={NotEnoughCoinsHandler}
            />
            <CoinsCard
              imageUrl={Time}
              value={lifelines[2].Value}
              priceIcon={Priceicon}
              totalLifeline={1}
              incrementCount={incrementHandler}
              NotEnoughCoinsHandler={NotEnoughCoinsHandler}
            />
          </div>
        </DialogContent>

        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default Quiz;
