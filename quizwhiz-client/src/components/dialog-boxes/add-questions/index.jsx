import * as React from "react";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Field, useFormik, Formik } from "formik";
import * as Yup from "yup";
import { ADD_QUESTIONS_VALIDATIONS } from "../../../validations/addQuestionsValidation";
import { Category, ContactSupportOutlined } from "@mui/icons-material";
import {
  addQuizQuestions,
  getQuizDetailsByLink,
  getQuizQuestions,
} from "../../../services/admindashboard.service";
import Swal from "sweetalert2";
import { questionTypeEnum } from "../../../utils/enum";
import { ToastContainer, toast } from "react-toastify";
import { style } from "@mui/system";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const validationSchema = Yup.object().shape(ADD_QUESTIONS_VALIDATIONS);

const initialQuestionState = {
  question: "",
  answerOptions: ["", "", "", ""],
  correctAnswers: [],
  type: 1,
};

export default function AddQuestions({ openDialog, currentQuizLink, closeEditDialog }) {
  const [open, setOpen] = useState(false);
  // const [questions, setQuestions] = useState([]);
  const [questionTypeDialogOpen, setQuestionTypeDialogOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState(1);
  const [isCurrentScreenValid, setIsCurrentScreenValid] = useState(true);
  const [currentQuizDetails, setCurrentQuizDetails] = useState({});
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();
  const filterdOptions = (arr) => {
    const result = arr.answerOptions.map((option) => ({
      OptionText: option,
      isAnswer: arr.correctAnswers.includes(option),
    }));

    return result;
  };

  const renameKeys = (obj) => {
    return {
      QuestionText: obj.question,
      Options: obj.type !== 3 ? filterdOptions(obj) : [],
      Answers: obj.correctAnswers,
      QuestionTypeId: obj.type,
      IsTrue: obj.type === 3 && obj.correctAnswers[0],
    };
  };

  const handleSaveQuiz = async (values, { resetForm }) => {
    console.log(values.questions);
    const newQuestions = values.questions.filter((q) => !q.isSaved);
    const RenamedQuestionsArray = newQuestions.map((question) =>
      renameKeys(question)
    );
    const sendData = {
      QuizLink: currentQuizLink,
      QuestionDTOs: RenamedQuestionsArray,
    };

    console.log("senddata", sendData);
    var response = await addQuizQuestions(sendData);
    console.log(response);
    try {
      if (response && response.statusCode === 200) {
        toast.success("Question Added Successfully");
      } else {
        toast.error("Failed To Add Question");
      }
    } catch (error) {
      toast.error("Error while Add Question");
    }
    resetForm();
    setOpen(false);
    closeEditDialog();
    navigate(`/admin-dashboard/pending`);
  };
  // state stage
  const transformFetchedQuestions = (fetchedQuestions) => {
    return fetchedQuestions.map((question) => ({
      question: question.QuestionText,
      answerOptions: question.Options.map((opt) => opt.OptionText),
      correctAnswers: question.Options.filter((opt) => opt.IsAnswer).map(
        (opt) => opt.OptionText
      ),
      type: question.QuestionTypeId,
      isSaved: true,
    }));
  };

  const getQuizDetail = async () => {
    if (currentQuizLink != "") {
      const response = await getQuizDetailsByLink(currentQuizLink);
      setCurrentQuizDetails(response.data);
      console.log("quizdetail", response);

      if (response) {
        const questions = await getQuizQuestions(currentQuizLink);
        console.log(questions.data);
        if (questions.data !== null) {
          setQuestionTypeDialogOpen(false);
        }
        const transformedQuestions = transformFetchedQuestions(questions.data);
        setFieldValue("questions", transformedQuestions);
        setQuestionCount(transformedQuestions.length);
      }
      // if (response.data && response.data.questions) {
      //   ;
      //   ;
      // }
    }
  };

  useEffect(() => {
    handleClickOpen();
    getQuizDetail();
  }, [currentQuizLink]);
  const formik = useFormik({
    initialValues: {
      questions: [],
    },
    validationSchema: validationSchema,
    onSubmit: handleSaveQuiz,
    validateOnBlur: true,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    index,
    handleBlur,
    setTouched,
    handleSubmit,
    setFieldValue,
    validateForm,
  } = formik;

  const handleClickOpen = () => {
    if (openDialog) {
      setOpen(true);
      if (values.questions.length === 0) {
        setQuestionTypeDialogOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;

    const newQuestions = [...values.questions];

    if (
      name === `values.questions.${index}.correctAnswers` &&
      newQuestions[index].type === 2
    ) {
      const currentAnswers = newQuestions[index].correctAnswers || [];
      const answerIndex = currentAnswers.indexOf(value);
      if (answerIndex === -1) {
        newQuestions[index].correctAnswers = [...currentAnswers, value];
      } else {
        newQuestions[index].correctAnswers = currentAnswers.filter(
          (item) => item !== value
        );
      }
    } else {
      var lastPart = name.split(".").pop();
      if (lastPart == "correctAnswers") {
        newQuestions[index][lastPart] = [value];
      } else {
        newQuestions[index][lastPart] = value;
      }
    }

    setFieldValue("questions", newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, event) => {
    const newQuestions = [...values.questions];
    const optionValue = event.target.value || "";

    const previousOptionValue = newQuestions[qIndex].answerOptions[optIndex];

    newQuestions[qIndex].answerOptions[optIndex] = optionValue;

    newQuestions[qIndex].correctAnswers = newQuestions[qIndex].correctAnswers
      .map((answer) => (answer === previousOptionValue ? optionValue : answer))
      .filter((answer) => newQuestions[qIndex].answerOptions.includes(answer));

    setFieldValue("questions", newQuestions);
  };

  const handleAddQuestionTypeDialogOpen = () => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setQuestionTypeDialogOpen(true);
      } else {
        setTouched({
          questions: values.questions.map(() => ({
            question: true,
            answerOptions: [true, true, true, true],
            correctAnswers: true,
          })),
        });
      }
    });
  };

  const handleAddQuestionTypeDialogClose = () => {
    setQuestionTypeDialogOpen(false);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      ...initialQuestionState,
      type: newQuestionType,
      question: "",
      answerOptions: ["", "", "", ""],
      correctAnswers: [],
    };

    setFieldValue("questions", [...values.questions, newQuestion]);
    setQuestionCount(questionCount + 1);
    const newTouchedState = {
      question: false,
      answerOptions: [false, false, false, false],
      correctAnswers: false,
    };

    setTouched((prevTouched) => ({
      questions: [
        ...values.questions.map((_, index) => ({
          question: prevTouched.questions?.[index]?.question || false,
          answerOptions: prevTouched.questions?.[index]?.answerOptions || [
            false,
            false,
            false,
            false,
          ],
          correctAnswers:
            prevTouched.questions?.[index]?.correctAnswers || false,
        })),
        newTouchedState,
      ],
    }));
    setQuestionTypeDialogOpen(false);
  };

  const toggleCorrectAnswer = (qIndex, optIndex) => {
    const newQuestions = JSON.parse(JSON.stringify(values.questions));
    let currentAnswers = newQuestions[qIndex].correctAnswers || [];
    const optionValue = newQuestions[qIndex].answerOptions[optIndex];

    if (currentAnswers.includes(optionValue)) {
      currentAnswers = currentAnswers.filter((item) => item !== optionValue);
    } else {
      if (currentAnswers.length < 4) {
        currentAnswers = [...currentAnswers, optionValue];
      }
    }

    currentAnswers = currentAnswers.filter((item) =>
      newQuestions[qIndex].answerOptions.includes(item)
    );

    newQuestions[qIndex].correctAnswers = currentAnswers;
    setFieldValue("questions", newQuestions);
  };

  const renderQuestionFields = (thisquestion, qIndex) => {
    const isDisabled = thisquestion.isSaved;
    switch (thisquestion.type) {
      case 1:
        return (
          <>
            {thisquestion.answerOptions.map((option, optIndex) => (
              <Box
                key={optIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <TextField
                  sx={{ mt: 2 }}
                  fullWidth
                  name={`values.questions.${qIndex}.answerOptions.${optIndex}`}
                  label={`Option ${optIndex + 1}`}
                  disabled={isDisabled}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e)}
                  error={
                    touched.questions?.[qIndex]?.answerOptions?.[optIndex] &&
                    Boolean(
                      errors.questions?.[qIndex]?.answerOptions?.[optIndex]
                    )
                  }
                  helperText={
                    touched.questions?.[qIndex]?.answerOptions?.[optIndex] &&
                    errors.questions?.[qIndex]?.answerOptions?.[optIndex]
                  }
                />
                <Radio
                  sx={{ mt: 2 }}
                  disabled={isDisabled}
                  checked={thisquestion.correctAnswers.includes(option)}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  value={option}
                  name={`values.questions.${qIndex}.correctAnswers`}
                />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                  Correct
                </Typography>
              </Box>
            ))}
            {touched.questions?.[qIndex]?.correctAnswers &&
              errors.questions?.[qIndex]?.correctAnswers && (
                <Grid item xs={12}>
                  <Typography color="error" variant="body2">
                    {errors.questions[qIndex].correctAnswers}
                  </Typography>
                </Grid>
              )}
          </>
        );
      case 2:
        return (
          <>
            {thisquestion.answerOptions.map((option, optIndex) => (
              <Box
                key={optIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <TextField
                  fullWidth
                  label={`Option ${optIndex + 1}`}
                  value={thisquestion.answerOptions[optIndex] || ""}
                  onBlur={handleBlur}
                  disabled={isDisabled}
                  onChange={(event) =>
                    handleOptionChange(qIndex, optIndex, event)
                  }
                  margin="normal"
                  error={Boolean(
                    touched.questions &&
                      errors.questions &&
                      errors.questions[qIndex] &&
                      errors.questions[qIndex].answerOptions &&
                      errors.questions[qIndex].answerOptions[optIndex]
                  )}
                  helperText={
                    touched.questions &&
                    errors.questions &&
                    errors.questions[qIndex] &&
                    errors.questions[qIndex].answerOptions &&
                    errors.questions[qIndex].answerOptions[optIndex]
                  }
                />
                <Checkbox
                  onBlur={handleBlur}
                  checked={thisquestion.correctAnswers.includes(option)}
                  disabled={isDisabled}
                  onChange={() => toggleCorrectAnswer(qIndex, optIndex)}
                  sx={{ marginLeft: "8px" }}
                />
                <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                  Correct
                </Typography>
              </Box>
            ))}
            {touched.questions &&
              errors.questions &&
              errors.questions[qIndex] &&
              errors.questions[qIndex].correctAnswers && (
                <Typography variant="caption" color="error">
                  {errors.questions[qIndex].correctAnswers}
                </Typography>
              )}
          </>
        );
      case 3:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={thisquestion.correctAnswers}
              onChange={(event) => handleQuestionChange(qIndex, event)}
              disabled={isDisabled}
              name={`values.questions.${qIndex}.correctAnswers`}
              error={Boolean(
                touched.questions &&
                  errors.questions &&
                  errors.questions[qIndex] &&
                  errors.questions[qIndex].correctAnswers
              )}
            >
              <MenuItem value="True">True</MenuItem>
              <MenuItem value="False">False</MenuItem>
            </Select>
            {touched.questions &&
              errors.questions &&
              errors.questions[qIndex] &&
              errors.questions[qIndex].correctAnswers && (
                <Typography variant="caption" color="error">
                  {errors.questions[qIndex].correctAnswers}
                </Typography>
              )}
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Add Questions
      </Button> */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "fixed", backgroundColor: "#6F41DB" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
              className="d-flex justify-content-between"
            >
              {currentQuizDetails.Title} ({currentQuizDetails.CategoryName})
            </Typography>
            <Button
              sx={{
                color: "#6F41DB",
                backgroundColor: "#fada65",
                "&:hover": {
                  color: "#fada65",
                },
              }}
              autoFocus
              color="inherit"
              type="submit"
              onClick={handleSubmit}
            >
              Save Quiz
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 11 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Questions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${values.questions.length} / ${currentQuizDetails.TotalQuestion}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Marks per Question
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentQuizDetails.MarksPerQuestion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Negative Mark
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentQuizDetails.NegativePerQuestion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Total Marks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {values.questions.length *
                      currentQuizDetails.MarksPerQuestion}{" "}
                    /{currentQuizDetails.TotalMarks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {values.questions &&
            values.questions.map((q, qIndex) => (
              <Box key={qIndex} sx={{ mt: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Question {qIndex + 1} (
                      {questionTypeEnum[values.questions[qIndex].type]})
                    </Typography>
                    <TextField
                      fullWidth
                      label="Question"
                      name={`values.questions.${qIndex}.question`}
                      value={q.question || ""}
                      onBlur={handleBlur}
                      onChange={(event) => handleQuestionChange(qIndex, event)}
                      disabled={q.isSaved}
                      error={Boolean(
                        touched.questions &&
                          errors.questions &&
                          errors.questions[qIndex] &&
                          errors.questions[qIndex].question
                      )}
                      helperText={
                        touched.questions &&
                        errors.questions &&
                        errors.questions[qIndex] &&
                        errors.questions[qIndex].question
                      }
                      margin="normal"
                    />

                    {renderQuestionFields(q, qIndex)}
                  </CardContent>
                </Card>
              </Box>
            ))}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleAddQuestionTypeDialogOpen}
              disabled={questionCount >= currentQuizDetails.TotalQuestion}
              sx={{
                color: "#fada65",
                backgroundColor: "#6F41DB",
                "&:hover": {
                  color: "#6F41DB",
                  backgroundColor: "#fada65",
                },
              }}
            >
              Add Another Question
            </Button>
          </Box>
        </Container>
      </Dialog>

      <Dialog
        open={questionTypeDialogOpen}
        onClose={handleAddQuestionTypeDialogClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Select Question Type</DialogTitle>
        <DialogContent>
          <FormControl margin="normal" fullWidth>
            <InputLabel>Select Question Type</InputLabel>
            <Select
              value={newQuestionType}
              onChange={(event) => setNewQuestionType(event.target.value)}
              label="Select Question Type"
            >
              <MenuItem value={1}>MCQ</MenuItem>
              <MenuItem value={2}>MSQ</MenuItem>
              <MenuItem value={3}>True/False</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddQuestionTypeDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddQuestion} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* <ToastContainer/> */}
    </React.Fragment>
  );
}
