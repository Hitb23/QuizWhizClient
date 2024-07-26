import * as React from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import canvasConfetti from "canvas-confetti";
import classes from "./style.module.css";

export default function LifelineGift(isVisible) {
  const [open, setOpen] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const canvasRef = useRef(null);

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const confetti = canvasConfetti.create(canvas, {
        resize: true,
        useWorker: true,
      });

      const count = 200;
      const defaults = {
        origin: { y: 0.5 },
        gravity: 0.7,
        zIndex: 1,
      };

      function fire(particleRatio, opts) {
        confetti(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            colors: [
              "#FFF",
              "#14BB69",
              "#14BB69",
              "#14BB69",
              "#50BAE2",
              "#A4FFF5",
              "#FFBF28",
              "#FF5447",
            ],
          })
        );
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } else {
      console.error("Canvas is not available");
    }
  };

  useEffect(() => {
    console.log("Use effect of modal");
    if (isVisible) {
      console.log("Is modal opened : " + openBox);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (open) {
      setOpenBox(false);
      setTimeout(() => {
        setOpenBox(true);
        fireConfetti();
      }, 1000);
      const confettiTimeout = setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.display = "none";
        }
      }, 5000);

      return () => {
        clearTimeout(confettiTimeout);
      };
    } else {
      setOpenBox(false);
      if (canvasRef.current) {
        canvasRef.current.style.display = "none";
      }
    }
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "40rem", 
            maxWidth: "none",
            overflow: "hidden", 
          },
        }}
      >
        {/* <DialogTitle className={classes["dialog-title"]}>Hey,</DialogTitle> */}
        <DialogContent
          sx={{ background: "#fada65", height: "9rem", position: "relative", overflow: "hidden" }}
        >
          <div id="giftModal" style={{ position: "relative", height: "100%" }}>
            <div
              className={`${classes.gift} ${
                !openBox ? classes.dukdik : ""
              } mt-2`}
            >
              <div
                className={`${classes["gift-top"]} ${
                  openBox ? classes.boxOpen : ""
                }`}
              ></div>
              {openBox ? (
                <h1 className={`${classes["gift-text"]} text-center`}>
                  Congratulations! You got 100 coins as gift. <br />
                  Use them to avail lifelines!
                </h1>
              ) : null}
              <div
                className={`${classes["gift-box"]} ${
                  openBox ? classes.boxDown : ""
                }`}
              ></div>
            </div>
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
                display: "block",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
