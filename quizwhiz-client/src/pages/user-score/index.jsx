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
  Skip,
  Shield,
  Time,
  Priceicon,
  Heart,
  CoinIcon,
  Knapsack,
  CrossMoney,
  LifeLineBG,
  Clock,
  Summary,
  Customer,
  Crowd,
  Growth,
  Celebration,
  Man,
} from "../../../src/assets/index";
import CoinsCard from "../../components/admin-cards/coins-card";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const UserScoreModal = ({ isOpen, closeHandler, coinsAndLifelinesDetails }) => {
  const [open, setOpen] = useState(isOpen);
  const MySwal = withReactContent(Swal);
  const confettiRef = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    closeHandler();
  };

  const incrementHandler = (ele) => {
    // IncrementCount(); - Uncomment and implement this function
  };

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

  useEffect(() => {
    if (open) {
      const confettiInstance = confetti.create(confettiRef.current, {
        resize: true,
        useWorker: true,
      });
      confettiInstance({
        particleCount: 100,
        spread: 160,
      });
    }
  }, [open]);

  return (
    <>
      <button className="bg-white" onClick={handleClickOpen}>
        Open dialog
      </button>
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
        open={open}
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
          <div className="d-flex justify-content-start gap-2 align-items-center">
            <h2 className={` ${classes["Shoptext"]} text-black mt-1`}>
              Quiz Summary
            </h2>
            <img src={Growth} height={59} />
          </div>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{  width: "100%", background: "#6F41DB" }}
        >
          <canvas ref={confettiRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></canvas>
          <div className="d-flex justify-content-center gap-2 align-items-center">
            <img src={Man} height={60} />
            <h1 className={`${classes["username-text"]} `}>harsh</h1>
          </div>
          <h2 className={`${classes["username-text"]}`}>Biweekly Contest</h2>
          <div
            className={` d-flex  align-items-center justify-content-center gap-5 my-2 rounded-2`}
          >
            <img src={Celebration} height={105} />
            <div className={`${classes["score-card"]} px-5`}>
              <h2 className={`${classes["Shoptext"]} `}>Rank</h2>
              <div className="">
                <h2 className={`${classes["rank-text"]}`}>
                  20<sup className={`${classes["rank-text"]} fs-3`}>th</sup>
                </h2>
              </div>
            </div>
            <img
              src={Celebration}
              height={105}
              style={{ transform: "rotate(270deg)" }}
            />
          </div>
          <div className="row g-3">
            <div className="col-6">
              <div
                className="d-flex flex-column rounded px-5 py-3"
                style={{ background: "#3d3189" }}
              >
                <h3 className={`${classes["rank-text"]}`}>Score</h3>
                <h3 className={`${classes["rank-text"]}`}>40</h3>
              </div>
            </div>
            <div className="col-6">
              <div
                className="d-flex flex-column rounded px-5 py-3"
                style={{ background: "#3d3189" }}
              >
                <h3 className={`${classes["rank-text"]}`}>Price</h3>
                <h3 className={`${classes["rank-text"]}`}>2000</h3>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default UserScoreModal;
