import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import classes from "./style.module.css";
import confetti from "canvas-confetti";

import {
  CrossMoney,
  HeartPY,
} from "../../assets/index";
import { useNavigate } from "react-router-dom";
import jwtDecoder from "../../services/jwtDecoder";
import CoinsCard from "../admin-cards/coins-card";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const HeartLifelineModal = ({ score, totalScore, winningAmount, rank }) => {
  const [open, setOpen] = useState(true);
  const MySwal = withReactContent(Swal);
  const confettiRef = useRef(null);
  const [userScore, setUserScore] = useState(score);
  const [userTotalScore, setTotalScore] = useState(totalScore);
  const [userWinningAmount, setUserWinningAmount] = useState(winningAmount);
  const [userRank, setUserRank] = useState(rank);
  const data = jwtDecoder();
  const username = data["Username"];
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    navigate("/quizzes");
  };

  const OnDeleteHandler = async (QuizLink) => {
    const result = await MySwal.fire({
      title: "Continue?",
      text: "You've been disqualified. Click below to use your lifeline and continue.",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      color: "#fada65",
      background: "#3d3189",
      timer: 5000,
      timerProgressBar: true,
      iconHtml: `<img src=${HeartPY} style="width: 200px">`,
      customClass: {
        icon: 'no-border'
      },
      willOpen: () => {
        const timerProgressBar = document.querySelector(
          ".swal2-container .swal2-timer-progress-bar"
        );
        if (timerProgressBar) {
          timerProgressBar.style.backgroundColor = "#fada65";
        }
        const swal2Icon = document.querySelector(
          ".swal2-container .swal2-icon.swal2-question"
        );
        if (swal2Icon) {
          swal2Icon.style.color = "#fada65";
          swal2Icon.style.borderColor = "#fada65";
        }
        const cancelButton = document.querySelector(
          ".swal2-container .swal2-cancel"
        );
        if (cancelButton) {
          cancelButton.style.color = "#fada65"; // Change this to desired color
          cancelButton.style.border = "none"; // Optional: Remove border if needed
        }

        // Style the confirm button
        const confirmButton = document.querySelector(
          ".swal2-container .swal2-confirm"
        );
        if (confirmButton) {
          confirmButton.style.color = "#fada65"; // Change this to desired color
          confirmButton.style.border = "none"; // Optional: Remove border if needed
        }
      },
      focusConfirm: false,
      focusCancel: false,
    });

    if (result.isConfirmed) {
      try {
        //await DeleteQuiz(QuizLink);
        reload();
      } catch (error) {
        console.log(error);
      }
      //MySwal.fire("Deleted!", "Your item has been deleted.", "success");
    } else if (result.isDismissed) {
      //MySwal.fire("Cancelled", "Your item is safe :)", "error");
      reload();
    }
    onClose();
  };

  const incrementHandler = (ele) => {
    // IncrementCount(); - Uncomment and implement this function
  };

  useEffect(() => {
    OnDeleteHandler();
  }, []);

  const NotEnoughCoinsHandler = async (e) => {
    e.preventDefault();
    await Swal.fire({
      imageUrl: CrossMoney,
      imageHeight: "10rem",
      background: "#3d3189",
      title: "Oops...",
      color: "white",
      text: "You Don't Have Enough Amount To Purchase Lifeline!",
      confirmButtonColor: "#6F41DB",
    });
  };

  // useEffect(() => {
  //   if (open) {
  //     const confettiInstance = confetti.create(confettiRef.current, {
  //       resize: true,
  //       useWorker: true,
  //     });
  //     confettiInstance({
  //       particleCount: 100,
  //       spread: 160,
  //     });
  //   }
  // }, [open]);

  return (
    <>
      {/* <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={true}
        sx={{
          zIndex: "10",
          "& .closeButton": {
            position: "absolute",
            top: "-20px", // Adjust the value to move the button outside the dialog
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          },
        }}
      > */}
      {/* <DialogTitle
          sx={{ m: 0, p: 2, background: "#3d3189" }}
          id="customized-dialog-title"
          className={`${classes["main-div"]}`}
        >
          <div className="d-flex justify-content-center gap-2 align-items-center">
            <h2
              className={` ${classes["Shoptext"]} text-black text-center m-0 px-2 `}
            >
              Continue?
            </h2>
          </div>
        </DialogTitle> */}

      {/* <DialogTitle
          sx={{ m: 0, p: 2, background: "#6f41db" }}
          id="customized-dialog-title"
          className={`${classes[""]}`}
        >
          <div className="d-flex justify-content-center gap-2 align-items-center">
            <h4
              className={` ${classes["continue-paragraph"]} text-center m-0 px-2 `}
            >
              You have been disqualified. Click the button below to continue.
            </h4>
          </div>
          <div className="d-flex justify-content-center gap-2 align-items-center">
            <button
              className={` ${classes["coin-btn"]} ${classes["text-bg"]} `}
              onClick={() => onContinueHandler()}
            >
              Yes
            </button>
          </div>
        </DialogTitle> */}
      {/* </BootstrapDialog> */}
    </>
  );
};

export default HeartLifelineModal;
