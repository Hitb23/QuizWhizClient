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
  backdropClasses,
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
import { Edit, Style } from "@mui/icons-material";
import AddQuestions from "../add-questions";
import Typography from "@mui/material/Typography";
import classes from "./style.module.css";
import { resolvePath, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import dayjs from "dayjs";
import {
  getCategories,
  getDifficulties,
  createNewQuiz,
  getQuizDetailsByLink,
  updateQuizDetails,
  getQuizQuestions,
} from "../../../services/admindashboard.service";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import ViewQuizModal from "../view-quiz/index";
import { display } from "@mui/system";

export default function EditQuizModal({ currentQuizLink }) {
  const [open, setOpen] = React.useState(false);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [difficultyDetails, setDifficultyDetails] = useState([]);
  const navigate = useNavigate();
  const [addQuestionsOpen1, setAddQuestionsOpen1] = useState(false);
  const [quizLink, setQuizLink] = useState("");
  const [quizDetail, setQuizDetail] = useState({});
  const [currentQuestionsCount, setCurrentQuestionsCount] = useState(0);


  const handleClickOpen = () => {
    setOpen(true);
    fetchData();
  };

  const handleClose = () => {
    setOpen(false);
    fetchData();
    setAddQuestionsOpen1(false);
  };

  const validationSchema = yup.object().shape(CREATE_QUIZ_VALIDATIONS);
  const fetchData = async () => {
    try {
      const difficultyData = await getDifficulties();
      const categoryData = await getCategories();
      const quizDetailResponse = await getQuizDetailsByLink(currentQuizLink);
      const quizQuestions= await getQuizQuestions(currentQuizLink);
      setCategoryDetails(categoryData.data.data);
      setDifficultyDetails(difficultyData.data.data);
      setQuizDetail(quizDetailResponse.data);
      setCurrentQuestionsCount(quizQuestions.data.length)
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const formattedDate = dayjs(values.scheduledDateTime).format(
      "YYYY-MM-DD HH:mm:ss.SSSSSS"
    );
    const sendData = {
      QuizLink: quizDetail.QuizLink,
      Title: values.quizTitle,
      Description: values.quizDescription,
      CategoryId: values.category,
      DifficultyId: values.difficulty,
      WinningAmount: values.winningAmount,
      ScheduleDate: formattedDate,
    };

    console.log("send", sendData);
    try {
      var response = await updateQuizDetails(sendData);
      if (response && response.statusCode === 200) {
        toast.success("edited succesfully");
        console.log("success edit");
      }
    } catch (error) {
      toast.error("Error While Editing");
      console.error("Error creating quiz", error);
    }
    handleClose();
    navigate(`/admin-dashboard/pending`);
  };

  return (
    <React.Fragment>
      {/* <ToastContainer /> */}
      {/* <button
        className={`${classes["add-quiz-btn"]}`}
        onClick={handleClickOpen}
      >
        Edit Quiz
      </button> */}
      <button
        onClick={handleClickOpen}
        className="btn fw-bold"
        style={{ background: "#a89ee9" }}
      >
        <Edit />
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
            category: quizDetail.CategoryId,
            marksPerQuestion: quizDetail.MarksPerQuestion,
            negativeMarksPerQuestion: quizDetail.NegativePerQuestion,
            winningAmount: quizDetail.WinningAmount,
            quizTitle: quizDetail.Title,
            quizDescription: quizDetail.Description,
            totalQuestions: quizDetail.TotalQuestion,
            minMarks: quizDetail.MinMarks,
            difficulty: quizDetail.DifficultyId,
            scheduledDateTime: dayjs(quizDetail.ScheduledDate),
            totalMarks: quizDetail.TotalMarks,
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
                className={`${classes["dialog-title"]} text-center`}
                sx={{ backgroundColor: "#fada65", color: "#6F41DB" }}
              >
                <strong>Edit Quiz</strong>
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
                        <span
                          className="text-danger "
                          style={{ fontSize: "12px" }}
                        >
                          {errors.category}
                        </span>
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
                        <span
                          className="text-danger "
                          style={{ fontSize: "12px" }}
                        >
                          {errors.difficulty}
                        </span>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item sm={4} xs={12}>
                    <Field
                      as={TextField}
                      disabled
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
                      disabled
                      value={values.marksPerQuestion}
                      type="number"
                      name="marksPerQuestion"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.marksPerQuestion &&
                        Boolean(errors.marksPerQuestion)
                      }
                      helperText={
                        touched.marksPerQuestion ? errors.marksPerQuestion : ""
                      }
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Negative Marks per Question"
                      disabled
                      type="number"
                      value={values.negativeMarksPerQuestion}
                      name="negativeMarksPerQuestion"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.negativeMarksPerQuestion &&
                        Boolean(errors.negativeMarksPerQuestion)
                      }
                      helperText={
                        touched.negativeMarksPerQuestion
                          ? errors.negativeMarksPerQuestion
                          : ""
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
                  <Grid item sm={4} xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Minimum Marks For Qualify"
                      name="minMarks"
                      disabled
                      type="number"
                      value={values.minMarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.minMarks && Boolean(errors.minMarks)}
                      helperText={touched.minMarks ? errors.minMarks : ""}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
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
                    label="Scheduled Date and Time"
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
                  type="button"
                  variant="outlined"
                  sx={{ color: "#6f41db", borderColor: "#6f41db" }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    console.log("add clicked");
                    setAddQuestionsOpen1(true);                                                        
                  }}
                  sx={{ backgroundColor: "#6f41db" }}
                  variant="contained"
                  style={{display:currentQuestionsCount >= quizDetail.TotalQuestion ? "none" :"block"}}
                >
                  Add Questions
                </Button>

               
              
                <ViewQuizModal currentQuizLink={currentQuizLink}  closeEditDialog={handleClose} />
                {addQuestionsOpen1 && (
                  <AddQuestions
                    openDialog={true} 
                    currentQuizLink={currentQuizLink}
                    closeEditDialog={handleClose}
                  />
                )}
                  <Button
                  onClick={handleSubmit}
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: "#6f41db" }}
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
}
