import * as React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormHelperText,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  deleteQuizQuestion,
  getQuizDetailsByLink,
  getQuizQuestions,
  updateQuizQuestions,
} from "../../services/admindashboard.service";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { questionTypeEnum } from "../../utils/enum";
import { ToastContainer, toast } from "react-toastify";
import { WidthNormal } from "@mui/icons-material";
import { color } from "@mui/system";
import classes from "./style.module.css";

const ViewQuizQuestions = ({ currentQuizLink }) => {
  const [questions, setQuestions] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editing, setEditing] = useState(false);
  const [totalCurrentQuestions, setTotalCurrentQuestions] = useState(0); // To store the total number of questions
  const [newQuestionType, setNewQuestionType] = useState(1); // Default to MCQ
  const [quizId, setQuizId] = useState(0);
  const [quizdetail, setQuizDetail] = useState({});
  const [questionTypeDialogOpen, setQuestionTypeDialogOpen] = useState(false);

  const initialValues = {
    Questions: [], // Initialize Questions array
  };

  const validationSchema = Yup.object().shape({
    Questions: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().trim().required("Question is required"),
        questionTypeId: Yup.number().required("Question type is required"),
        Options: Yup.array().when("questionTypeId", {
          is: (val) => val !== 3, // Only validate options for non-True/False questions
          then: () =>
            Yup.array()
              .of(
                Yup.object().shape({
                  OptionText: Yup.string()
                    .trim()
                    .required("Option is required"),
                  IsAnswer: Yup.boolean(),
                })
              )
              .test(
                "at-least-one-checked",
                "At least one option must be marked as correct",
                (options) => options.some((option) => option.IsAnswer)
              )
              .test(
                "unique-options",
                "All options must be unique",
                (options) => {
                  const optionTexts = options.map(
                    (option) => option.OptionText
                  );
                  return new Set(optionTexts).size === optionTexts.length;
                }
              ),
        }),
        Answers: Yup.string().when("questionTypeId", {
          is: (val) => val === 3, // Validate Answers for True/False questions
          then: () => Yup.string().required("Correct answer is required"),
        }),
      })
    ),
  });

  const handleAddQuestionTypeDialogClose = () => {
    setQuestionTypeDialogOpen(false);
  };

  const getUpdatedOptions = (OptionArr, Ans) => {
    const UpdatedOptions = OptionArr.map((option) => ({
      ...option,
      IsAnswer: option.OptionText === Ans,
    }));
    return UpdatedOptions;
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: saveQuestion,
  });

  async function saveQuestion() {
    const questionData = formik.values.Questions[editMode];
    const trimmedQuestionText = questionData.question.trim();
    const trimmedOptions = questionData.Options.map((option) => ({
      ...option,
      OptionText: option.OptionText.trim(),
    }));
    const sentData = {
      QuestionId: questionData.questionId,
      QuestionText: trimmedQuestionText,
      Options:
        questionData.questionTypeId === 1
          ? getUpdatedOptions(trimmedOptions, questionData.Answers)
          : questionData.questionTypeId === 2
          ? trimmedOptions
          : [],
      IsTrue:
        questionData.questionTypeId === 3 && questionData.Answers
          ? questionData.Answers
          : "", // For true/false
      QuestionTypeId: questionData.questionTypeId,
      QuizId: quizId,
    };
    const result = await updateQuizQuestions(sentData);
    fetchQuizDetails();
    if (result && result.statusCode === 200) {
      toast.success(result.message || "Updated Successfully");
    } else {
      toast.error("Error While Updating!");
    }

    setEditMode(null);
    setEditing(false);
  }

  useEffect(() => {
    fetchQuizDetails();
  }, [currentQuizLink]);

  const fetchQuizDetails = async () => {
    try {
      const response = await getQuizDetailsByLink(currentQuizLink);
      setQuizDetail(response.data);
      if (response && response.data) {
        setQuizId(response.data.QuizId);
        const result = await getQuizQuestions(currentQuizLink);
        if (result) {
          setQuestions(result.data);
          setTotalCurrentQuestions(result.data.length);
          const initialFormValues = result.data.map((question) => ({
            questionId: question.QuestionId,
            questionTypeId: question.QuestionTypeId,
            question: question.QuestionText,
            Options: question.Options
              ? question.Options.map((option) => ({
                  OptionId: option.OptionId, // Ensure each option has a unique ID
                  OptionText: option.OptionText,
                  IsAnswer: option.IsAnswer,
                }))
              : [],
            Answers: getCorrectAnswer(
              question.Options || [],
              question.QuestionTypeId
            ),
          }));
          formik.setValues({ Questions: initialFormValues });
        } else {
          setQuestions([]);
          setTotalCurrentQuestions(0);
          formik.setValues({ Questions: [] });
        }
      }
    } catch (error) {
      console.log("Error fetching quiz details:");
    }
  };

  const handleEditClick = (index) => {
    setEditMode(index);
    setEditing(true);
  };

  const addNewQuestion = () => {
    setQuestionTypeDialogOpen(false);
    const newQuestion = {
      questionId: 0, // Generate a unique ID for the new question
      questionTypeId: newQuestionType, // The type of question to be added (MCQ, MSQ, TF)
      question: "",
      Options: initializeOptions(newQuestionType), // Initialize options based on the type
      Answers: "", // Default value for Answers
    };

    // Update the local state
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);

    // Update Formik values
    formik.setValues((prevValues) => ({
      Questions: [...prevValues.Questions, newQuestion],
    }));

    setTotalCurrentQuestions(totalCurrentQuestions + 1);
    setEditMode(updatedQuestions.length - 1);
    setEditing(true);
  };

  // Initialize options based on the question type
  const initializeOptions = (type) => {
    switch (type) {
      case 1: // MCQ
      case 2: // MSQ
        return Array.from({ length: 4 }, (_, i) => ({
          OptionId: i, // Generate a unique ID for each option
          OptionText: "",
          IsAnswer: false,
        }));
      case 3: // TF
        return []; // No options needed for true/false questions
      default:
        return [];
    }
  };

  const handleDeleteClick = async (index) => {
    if (editing) return;
    const questionId = questions[index].QuestionId;
    const response = await deleteQuizQuestion(questionId);
    if (response && response.statusCode === 200) {
      toast.success(response.message || "Deleted Successfully");
      setQuestions(questions.filter((_, qIndex) => qIndex !== index));
    } else {
      toast.error("Error While deleting the question");
    }
    fetchQuizDetails();
  };

  const getCorrectAnswer = (optionsArray, questionType) => {
    for (let i = 0; i < optionsArray.length; i++) {
      if (optionsArray[i].IsAnswer === true) {
        switch (questionType) {
          case 1:
            return optionsArray[i].OptionText;
          case 3:
            return (
              optionsArray[i].OptionText.charAt(0).toUpperCase() +
              optionsArray[i].OptionText.slice(1)
            );
          default:
            return "";
        }
      }
    }
    return "";
  };

  const handleOptionChange = (index, optIndex, event) => {
    const { name, value } = event.target;
    const updatedQuestions = [...formik.values.Questions];
    updatedQuestions[index].Options[optIndex][name.split(".").pop()] = value;
    if (updatedQuestions[index].Options[optIndex].IsAnswer) {
      updatedQuestions[index].Answers = value;
    }
    formik.setValues({ Questions: updatedQuestions });
  };
  function printformik(v) {}
  const renderQuestionFields = (question, index) => {
    switch (question.questionTypeId) {
      case 1:
        return (
          <Box>
            <RadioGroup
              name={`Questions[${index}].Answers`}
              value={formik.values.Questions[index]?.Answers || ""}
              onChange={(event) => handleRadioChange(index, event)}
            >
              {formik.values.Questions[index]?.Options.map(
                (option, optIndex) => (
                  <Box key={option.OptionId} display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      label={`Option ${optIndex + 1}`}
                      name={`Questions[${index}].Options[${optIndex}].OptionText`}
                      value={option?.OptionText || ""}
                      onChange={(event) =>
                        handleOptionChange(index, optIndex, event)
                      }
                      disabled={editMode !== index}
                      margin="normal"
                      error={
                        formik.touched.Questions &&
                        formik.touched.Questions[index]?.Options &&
                        formik.errors.Questions &&
                        formik.errors.Questions[index]?.Options &&
                        Boolean(
                          formik.errors.Questions[index]?.Options[optIndex]
                            ?.OptionText
                        )
                      }
                      helperText={
                        formik.touched.Questions &&
                        formik.touched.Questions[index]?.Options &&
                        formik.errors.Questions &&
                        formik.errors.Questions[index]?.Options &&
                        formik.errors.Questions[index]?.Options[optIndex]
                          ?.OptionText
                      }
                    />

                    <Radio
                      checked={
                        formik.values.Questions[index]?.Answers ===
                          option.OptionText && option.OptionText !== ""
                      }
                      fullWidth
                      value={option.OptionText}
                      name={`Questions[${index}].Answers`}
                      onChange={(event) => handleRadioChange(index, event)}
                      disabled={editMode !== index || option.OptionText === ""}
                      sx={
                        editMode !== index || option.OptionText === ""
                          ? {}
                          : {
                              color: "#070033",
                              "&.Mui-checked": {
                                color: "#070033",
                              },
                            }
                      }
                    />
                  </Box>
                )
              )}
            </RadioGroup>
            {formik.touched.Questions &&
              formik.errors.Questions &&
              typeof formik.errors.Questions[index]?.Options === "string" && (
                <Typography variant="caption" color="error">
                  {formik.errors.Questions[index]?.Options}
                </Typography>
              )}
          </Box>
        );
      case 2:
        return (
          <Box>
            {formik.values.Questions[index]?.Options.map((option, optIndex) => (
              <Box key={option.OptionId} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label={`Option ${optIndex + 1}`}
                  name={`Questions[${index}].Options[${optIndex}].OptionText`}
                  value={option?.OptionText || ""}
                  onChange={(event) =>
                    handleOptionChange(index, optIndex, event)
                  }
                  disabled={editMode !== index}
                  margin="normal"
                  error={
                    formik.touched.Questions &&
                    formik.touched.Questions[index]?.Options &&
                    formik.errors.Questions &&
                    formik.errors.Questions[index]?.Options &&
                    Boolean(
                      formik.errors.Questions[index]?.Options[optIndex]
                        ?.OptionText
                    )
                  }
                  helperText={
                    formik.touched.Questions &&
                    formik.touched.Questions[index]?.Options &&
                    formik.errors.Questions &&
                    formik.errors.Questions[index]?.Options &&
                    formik.errors.Questions[index]?.Options[optIndex]
                      ?.OptionText
                  }
                />

                <Checkbox
                  checked={option?.IsAnswer || false}
                  name={`Questions[${index}].Options[${optIndex}].IsAnswer`}
                  onChange={(event) =>
                    handleOptionChange(index, optIndex, {
                      target: {
                        name: `Questions[${index}].Options[${optIndex}].IsAnswer`,
                        value: event.target.checked,
                      },
                    })
                  }
                  disabled={editMode !== index}
                  sx={
                    editMode !== index || option.OptionText === ""
                      ? {}
                      : {
                          color: "#070033",
                          "&.Mui-checked": {
                            color: "#070033",
                          },
                        }
                  }
                />
              </Box>
            ))}
            {formik.touched.Questions &&
              formik.touched.Questions[index]?.Answers &&
              formik.errors.Questions &&
              typeof formik.errors.Questions[index]?.Options === "string" && (
                <Typography variant="caption" color="error">
                  {formik.errors.Questions[index]?.Options}
                </Typography>
              )}
          </Box>
        );
      case 3:
        return (
          <Box display="flex" alignItems="center">
            <FormControl component="fieldset">
              <RadioGroup
                name={`Questions[${index}].Answers`}
                value={formik.values.Questions[index]?.Answers || ""}
                onChange={(event) => handleRadioChange(index, event)}
              >
                <FormControlLabel
                  value="True"
                  control={
                    <Radio
                      sx={
                        editMode !== index
                          ? {}
                          : {
                              color: "#070033",
                              "&.Mui-checked": {
                                color: "#070033",
                              },
                            }
                      }
                    />
                  }
                  label="True"
                  disabled={editMode !== index}
                />
                <FormControlLabel
                  value="False"
                  control={
                    <Radio
                      sx={
                        editMode !== index
                          ? {}
                          : {
                              color: "#070033",
                              "&.Mui-checked": {
                                color: "#070033",
                              },
                            }
                      }
                    />
                  }
                  label="False"
                  disabled={editMode !== index}
                />
              </RadioGroup>
              <div>
                {formik.touched.Questions &&
                  formik.touched.Questions[index]?.Answers &&
                  formik.errors.Questions &&
                  formik.errors.Questions[index]?.Answers && (
                    <Typography variant="caption" color="error">
                      {formik.errors.Questions[index]?.Answers}
                    </Typography>
                  )}
              </div>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleRadioChange = (index, event) => {
    const { value } = event.target;
    const updatedQuestions = [...formik.values.Questions];
    updatedQuestions[index].Answers = value;

    if (updatedQuestions[index].questionTypeId === 1) {
      updatedQuestions[index].Options.forEach((option) => {
        option.IsAnswer = option.OptionText === value;
      });
    }
    formik.setValues({ Questions: updatedQuestions });
  };

  const validateFormAndOpenDialog = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors.Questions || {}).length === 0 && editing != true) {
      setQuestionTypeDialogOpen(true);
    } else {
      toast.info("please,Save the Changes");
    }
    // formik.setTouched({
    // Questions: formik.values.Questions.map(() => ({
    //   question: true,
    //   Options: Array.from({ length: 4 }, () => true),
    //   Answers: true,
    // })),
    // });
  };

  const handleAddQuestionTypeDialogOpen = () => {
    formik.setTouched({
      Questions: formik.values.Questions.map(() => ({
        question: false,
        Options: Array.from({ length: 4 }, () => false),
        Answers: false,
      })),
    });
    formik.setErrors({});
    validateFormAndOpenDialog();
  };

  const handleCancelEdit = () => {
    fetchQuizDetails();
    setEditMode(null);
    setEditing(false);
  };

  return (
    <Container>
      <Grid container spacing={2} className="mt-4">
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ color: "#070033" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Questions
              </Typography>
              <Typography variant="body1">
                {totalCurrentQuestions} / {quizdetail.TotalQuestion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ color: "#070033" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Marks
              </Typography>
              <Typography variant="body1">
                {totalCurrentQuestions} /{" "}
                {quizdetail.TotalMarks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        {formik.values.Questions.map((question, index) => (
          <Card key={index} sx={{ marginTop: 2 }}>
            <CardContent>
              <div
                className={`${classes["darkPurpleColor"]} d-flex justify-content-between`}
              >
                <Typography variant="h6">
                  Q.{index + 1} (
                  {
                    questionTypeEnum[
                      formik.values.Questions[index].questionTypeId
                    ]
                  }
                  )
                </Typography>
                <div>
                  <IconButton
                    sx={
                      editing === true
                        ? { color: "grey" }
                        : { color: "#070033" }
                    }
                    onClick={() => handleEditClick(index)}
                    disabled={editMode !== null && editMode !== index}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    sx={
                      editing === true
                        ? { color: "grey" }
                        : { color: "#070033" }
                    }
                    onClick={() => handleDeleteClick(index)}
                    disabled={editMode !== null}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              <TextField
                fullWidth
                label="Question"
                name={`Questions[${index}].question`}
                value={formik.values.Questions[index]?.question || ""}
                onChange={formik.handleChange}
                disabled={editMode !== index}
                margin="normal"
                error={
                  formik.touched.Questions &&
                  formik.touched.Questions[index] &&
                  Boolean(formik.errors.Questions) &&
                  Boolean(formik.errors.Questions[index]?.question)
                }
                helperText={
                  formik.touched.Questions &&
                  formik.touched.Questions[index] &&
                  formik.errors.Questions &&
                  formik.errors.Questions[index]?.question
                }
              />

              {renderQuestionFields(question, index)}

              {editMode === index && (
                <div className="d-flex flex-row gap-2">
                  <Button
                    className={`${classes["save-quiz-btn"]}`}
                    type="submit"
                    variant="contained"
                    sx={{ marginTop: 2, backgroundColor: "#070033" }}
                  >
                    Save
                  </Button>
                  <Button
                    className={`${classes["cancel-quiz-btn"]}`}
                    onClick={handleCancelEdit}
                    variant="outlined"
                    sx={{
                      marginTop: 2,
                      color: "#3d3189",
                      borderColor: "#3d3189",
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Box sx={{ marginTop: 2, marginBottom: 3 }}>
          <Button
            variant="contained"
            sx={{ marginTop: 2 }}
            onClick={handleAddQuestionTypeDialogOpen}
            disabled={totalCurrentQuestions >= quizdetail.TotalQuestion}
            className={`${classes["save-quiz-btn"]}`}
          >
            Add New Question
          </Button>
        </Box>
      </form>
      {/* <ToastContainer /> */}
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
          <Button onClick={addNewQuestion}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewQuizQuestions;
