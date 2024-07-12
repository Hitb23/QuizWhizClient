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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewQuizModal({ currentQuizLink }) {
  const [open, setOpen] = useState(false);
  const [quizDetail, setQuizDetail] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        sx={{ backgroundColor: "#6f41db" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        View Questions
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#6F41DB" }}>
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
            <Button
              autoFocus
              sx={{
                color: "#6F41DB",
                backgroundColor: "#fada65",
                "&:hover": {
                  color: "#fada65",
                },
              }}
              onClick={handleClose}
            >
              Go To Dashboard
            </Button>
          </Toolbar>
        </AppBar>
        <ViewQuizQuestions currentQuizLink={currentQuizLink} />
      </Dialog>
    </Fragment>
  );
}
