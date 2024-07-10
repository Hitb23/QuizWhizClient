import React, { useEffect, useState } from "react";
import { border, styled } from "@mui/system";
import { IoTimeOutline } from "react-icons/io5";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaListCheck } from "react-icons/fa6";
import classes from "./style.module.css";
import { DIFFICULTIES, CATEGORIES } from "../../../utils/enum";
import { getQuizDetailsByLink } from "../../../services/admindashboard.service";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {
  Description,
  Celebration,
  EventNote,
  AccessTime,
  CurrencyRupee,
} from "@mui/icons-material";

const QuizDescription = ({ quizLink, modalClose }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [difficultyName, setDifficultyName] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [winningAmount, setWinningAmount] = useState(0);
  const [scheduledDate, setScheduledDate] = useState();

  useEffect(() => {
    const setData = async () => {
      try {
        const allData = await getQuizDetailsByLink(quizLink);
        const data = allData.data;
        console.log(data);
        setTitle(data.Title);
        setDescription(data.Description);
        setCategoryName(CATEGORIES[data.CategoryId]);
        setDifficultyName(DIFFICULTIES[data.DifficultyId]);
        setTotalQuestions(data.TotalQuestion);
        setWinningAmount(data.WinningAmount);
        setScheduledDate(data.ScheduledDate);
        setOpen(true);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    setData();
  }, [quizLink]);

  const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(scheduledDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const onCloseHandler = () => {
    setOpen(false);
    modalClose();
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={onCloseHandler}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 700,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          backgroundColor: "#3d3189",
          borderColor: "#fada65",
          margin: "2rem",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h1"
          textColor="#fada65"
          fontWeight="lg"
          mb={1}
        >
          {title}
        </Typography>
        <div className="m-2">
          <div className="row p-0">
            <div className={`${classes["div-underline"]} d-flex justify-content-start align-items-start column-gap-2 py-3 col-12`}>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10 w-100"
                >
                  {description}
                </Typography>
              </div>
            </div>
          </div>
          <div className={`${classes["div-underline"]} row p-0 pt-3 pb-3 row-gap-3`}>
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12">
              <div>
                <Typography
                  id="modal-category-label"
                  textColor="#fada65"
                  className="col-md-2 fw-bold"

                >
                  Category:
                </Typography>
              </div>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10"
                >
                  {categoryName}
                </Typography>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12">
              <div>
                <Typography
                  id="modal-category-label"
                  textColor="#fada65"
                  className="col-md-2 fw-bold"
                >
                  Difficulty:
                </Typography>
              </div>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10"
                >
                  {difficultyName}
                </Typography>
              </div>
            </div>
          </div>

          <div className={`${classes["div-underline"]} row p-0 py-3 row-gap-3`}>
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12">
              <div>
                <Description
                  id="modal-category-label"
                  htmlColor="#fada65"
                  className="col-md-2 fw-bold"
                  fontSize="large"
                />
              </div>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10 fw-bold"
                  whiteSpace={"nowrap"}
                >
                  {totalQuestions} Questions
                </Typography>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12">
              <div>
                <Celebration
                  id="modal-category-label"
                  htmlColor="#fada65"
                  className="col-md-2 fw-bold"
                  fontSize="large"
                />
              </div>
              <div className="d-flex justify-content-start align-item-center column-gap-0">
                <div>
                  <Typography
                    id="modal-category"
                    textColor="#fada65"
                    className="fw-bold"
                  >
                    {winningAmount}
                  </Typography>
                </div>
                <div>
                  <CurrencyRupee
                    id="modal-category-label"
                    htmlColor="#fada65"
                    className="col-md-2 fw-bold"
                    fontSize="small"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row p-0 py-3 row-gap-3">
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12 ">
              <div>
                <EventNote
                  id="modal-category-label"
                  htmlColor="#fada65"
                  className="col-md-2 fw-bold"
                  fontSize="large"
                />
              </div>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10 fw-bold"
                  whiteSpace={"nowrap"}
                >
                  {formattedDate}
                </Typography>
              </div>
            </div>
            <div className="d-flex justify-content-start align-items-center column-gap-2 col-sm-6 col-12">
              <div>
                <AccessTime
                  id="modal-category-label"
                  htmlColor="#fada65"
                  className="col-md-2 fw-bold"
                  fontSize="large"
                />
              </div>
              <div>
                <Typography
                  id="modal-category"
                  textColor="#fada65"
                  className="col-md-10 fw-bold"
                  whiteSpace={"nowrap"}
                >
                  {formattedTime}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </Modal>
  );
};

export default QuizDescription;
