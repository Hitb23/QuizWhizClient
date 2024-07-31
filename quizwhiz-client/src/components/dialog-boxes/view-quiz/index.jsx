import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useState, Fragment, forwardRef, useEffect } from "react";
import ViewQuizQuestions from "../../view-quiz-questions";
import { getQuizDetailsByLink } from "../../../services/admindashboard.service";
import { ToastContainer, toast } from "react-toastify";
import classes from "./style.module.css";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewQuizModal({ currentQuizLink , closeEditDialog, openViewQuiz, addQueChange  }) {
  const [open, setOpen] = useState(openViewQuiz);
  const [quizDetail, setQuizDetail] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    closeEditDialog();
   if(addQueChange != null) {
    addQueChange();
   } 
  };

  useEffect(() => {
    fetchQuizDetails1();
  }, []);

  const fetchQuizDetails1 = async () => {
    const qd = await getQuizDetailsByLink(currentQuizLink);
    setQuizDetail(qd.data);
  };

  return (
    <Fragment>
      <Button
        className={`${classes["save-quiz-btn"]}`}
        variant="contained"
        onClick={handleClickOpen}
      >
        Edit Questions
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "fixed", backgroundColor: "#3d3189" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {quizDetail.Title} ({quizDetail.CategoryName})
            </Typography>
            
            {/* <Button
              autoFocus
              sx={{
                color: "#3d3189",
                backgroundColor: "#fada65",
                "&:hover": {
                  color: "#fada65",
                },
              }}
              onClick={handleClose}
            >
               Dashboard
            </Button> */}
          </Toolbar>
        </AppBar>
        <div className="mt-5">
        <ViewQuizQuestions currentQuizLink={currentQuizLink}  />
        </div>
      </Dialog>
    </Fragment>
  );
}
