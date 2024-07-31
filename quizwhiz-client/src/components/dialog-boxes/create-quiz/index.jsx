import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CREATE_QUIZ_VALIDATIONS } from "../../../validations/createQuizValidation";
import { Formik, Form, Field } from "formik";
import { styled } from "@mui/material/styles";
import { Style } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import classes from "./style.module.css";
import { resolvePath, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import dayjs from "dayjs";
import {
  getCategories,
  getDifficulties,
  createNewQuiz,
} from "../../../services/admindashboard.service";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import ViewQuizModal from "../view-quiz";

export default function CreateQuizModal({ onClose }) {
  const [open, setOpen] = React.useState(false);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [difficultyDetails, setDifficultyDetails] = useState([]);
  const navigate = useNavigate();
  const [addQuestionsOpen, setAddQuestionsOpen] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (addQuestionsOpen != true) {
      onClose();
      navigate(`/admin-dashboard`);
    }
    onClose();
  };

  const ChangeAddQuestionState = () => {
    setAddQuestionsOpen(false);
  };

  const validationSchema = yup.object().shape(CREATE_QUIZ_VALIDATIONS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const difficultyData = await getDifficulties();
        const categoryData = await getCategories();
        setCategoryDetails(categoryData.data.data);
        setDifficultyDetails(difficultyData.data.data);
      } catch (error) {
        //console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const formattedDate = dayjs(values.scheduledDateTime).format(
      "YYYY-MM-DD HH:mm:ss.SSSSSS"
    );
    const sendData = {
      Title: values.quizTitle.trim(),
      Description: values.quizDescription.trim(),
      CategoryId: values.category,
      DifficultyId: values.difficulty,
      TotalQuestion: values.totalQuestions,
      MarksPerQuestion: values.marksPerQuestion,
      NegativePerQuestion: values.negativeMarksPerQuestion,
      TotalMarks: values.marksPerQuestion * values.totalQuestions,
      MinMarks: 0,
      WinningAmount: values.winningAmount,
      ScheduleDate: formattedDate,
    };

    try {
      var response = await createNewQuiz(sendData);
      if (response && response.statusCode === 200) {
        Swal.fire({
          title: "Quiz Created Successfully",
          text: "You can either go to the dashboard or add questions.",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Add Questions",
          cancelButtonText: "Go to Dashboard",
        }).then((result) => {
          if (result.isConfirmed) {
            setAddQuestionsOpen(true);
            setQuizLink(response.data);
          } else {
            navigate(`/admin-dashboard`);
          }
        });
        resetForm();
        handleClose();
      }
    } catch (error) {
      //console.error("Error creating quiz", error);
    }
  };
  return (
    <React.Fragment>
      <button
        className={`${classes["add-quiz-btn"]}`}
        onClick={handleClickOpen}
      >
        Add Quiz
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <Formik
          initialValues={{
            category: "",
            marksPerQuestion: null,
            negativeMarksPerQuestion: null,
            winningAmount: null,
            quizTitle: "",
            quizDescription: "",
            totalQuestions: null,
            difficulty: "",
            scheduledDateTime: dayjs().add(1, "hour"),
            totalMarks: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form>
              <DialogTitle
                id="alert-dialog-title"
                className={`${classes["dialog-title"]}`}
              >
                <strong>Create New Quiz</strong>
              </DialogTitle>
              <DialogContent>
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Quiz Title"
                  type="text"
                  name="quizTitle"
                  value={values.quizTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quizTitle && Boolean(errors.quizTitle)}
                  sx={{
                    "& .MuiFormHelperText-root": { marginLeft: "0px" },
                  }}
                  helperText={touched.quizTitle ? errors.quizTitle : ""}
                />

                <Field
                  as={TextField}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  label="Quiz Description"
                  type="text"
                  name="quizDescription"
                  value={values.quizDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.quizDescription && Boolean(errors.quizDescription)
                  }
                  helperText={
                    touched.quizDescription ? errors.quizDescription : ""
                  }
                />
                <Grid container spacing={2}>
                  <Grid item sm={8} xs={12}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={touched.category && Boolean(errors.category)}
                    >
                      <InputLabel id="demo-simple-select-helper-label">
                        Category
                      </InputLabel>
                      <Field
                        as={Select}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="category"
                      >
                        {categoryDetails &&
                          categoryDetails.map((ele) => (
                            <MenuItem
                              key={ele.CategoryId}
                              value={ele.CategoryId}
                            >
                              {ele.CategoryName}
                            </MenuItem>
                          ))}
                      </Field>
                      {touched.category && errors.category && (
                        <Typography variant="caption" color="error">
                          {errors.category}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={touched.difficulty && Boolean(errors.difficulty)}
                    >
                      <InputLabel id="difficulty-label">Difficulty</InputLabel>
                      <Field
                        as={Select}
                        labelId="difficulty-label"
                        id="difficulty-field"
                        label="Difficulty"
                        value={values.difficulty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="difficulty"
                      >
                        {difficultyDetails &&
                          difficultyDetails.map((ele) => (
                            <MenuItem
                              key={ele.DifficultyId}
                              value={ele.DifficultyId}
                            >
                              {ele.DifficultyName}
                            </MenuItem>
                          ))}
                      </Field>
                      {touched.difficulty && errors.difficulty && (
                        <Typography variant="caption" color="error">
                          {errors.difficulty}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={8} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Total Questions"
                      type="number"
                      name="totalQuestions"
                      value={values.totalQuestions}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.totalQuestions && Boolean(errors.totalQuestions)
                      }
                      sx={{
                        "& .MuiFormHelperText-root": { marginLeft: "0px" },
                      }}
                      helperText={
                        touched.totalQuestions ? errors.totalQuestions : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Marks per Question"
                      value={values.marksPerQuestion}
                      type="number"
                      name="marksPerQuestion"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.marksPerQuestion &&
                        Boolean(errors.marksPerQuestion)
                      }
                      sx={{
                        "& .MuiFormHelperText-root": { marginLeft: "0px" },
                      }}
                      helperText={
                        touched.marksPerQuestion ? errors.marksPerQuestion : ""
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item sm={4} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      disabled
                      margin="normal"
                      label="Total Marks"
                      type="number"
                      name="totalMarks"
                      value={values.totalQuestions * values.marksPerQuestion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.totalMarks && Boolean(errors.totalMarks)}
                      helperText={touched.totalMarks ? errors.totalMarks : ""}
                    />
                  </Grid>
                  <Grid item sm={8} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Winning Amount"
                      type="number"
                      name="winningAmount"
                      value={values.winningAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.winningAmount && Boolean(errors.winningAmount)
                      }
                      sx={{
                        "& .MuiFormHelperText-root": { marginLeft: "0px" },
                      }}
                      helperText={
                        touched.winningAmount ? errors.winningAmount : ""
                      }
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Field
                    as={DateTimePicker}
                    name="scheduledDateTime"
                    label="Schedule Date and Time"
                    value={values.scheduledDateTime}
                    onChange={(value) =>
                      setFieldValue("scheduledDateTime", value)
                    }
                    onBlur={handleBlur}
                    minDateTime={dayjs().add(1, "hour")}
                    slots={{
                      textField: (props) => (
                        <TextField
                          {...props}
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          error={
                            touched.scheduledDateTime &&
                            Boolean(errors.scheduledDateTime)
                          }
                          helperText={
                            touched.scheduledDateTime
                              ? errors.scheduledDateTime
                              : ""
                          }
                        />
                      ),
                    }}
                  ></Field>
                </LocalizationProvider>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  sx={{ backgroundColor: "#fff", borderColor: "#3d3189" }}
                  className={`${classes["cancel-quiz-btn"]}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: "#3d3189", borderColor: "#3d3189" }}
                  className={`${classes["save-quiz-btn"]}`}
                >
                  Create
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      {addQuestionsOpen && quizLink !== "" && (
        <ViewQuizModal
          currentQuizLink={quizLink}
          closeEditDialog={handleClose}
          openViewQuiz={true}
          addQueChange={ChangeAddQuestionState}
        />
      )}
    </React.Fragment>
  );
}
