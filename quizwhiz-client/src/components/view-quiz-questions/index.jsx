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
  Button, // Added Button import
  Radio, RadioGroup, FormControlLabel
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

const ViewQuizQuestions = ({ currentQuizLink ,closeEditDialog}) => {
  const [questions, setQuestions] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editing, setEditing] = useState(false);

  const initialValues = {
    Questions: [], // Initialize Questions array
  };

  const validationSchema = Yup.object().shape({
    Questions: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        Options: Yup.array()
          .of(
            Yup.object().shape({
              OptionText: Yup.string().required("Option is required"),
              IsAnswer: Yup.boolean(),
            })
          )
          .test(
            "at-least-one-checked",
            "At least one option must be marked as correct",
            (options) => options.some((option) => option.IsAnswer)
          ),
        Answers: Yup.string().when("Options", {
          is: (options) => !options.some((option) => option.IsAnswer === true),
          then: () => Yup.string().required("Correct answer is required"),
        }),
      })
    ),
  });
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
    const sentData = {
      QuestionId: questionData.questionId,
      QuestionText: questionData.question,
      Options:
        questionData.questionTypeId === 1
          ? getUpdatedOptions(questionData.Options, questionData.Answers)
          : questionData.questionTypeId === 2
          ? questionData.Options
          : [],
      IsTrue:
        questionData.questionTypeId === 3 && questionData.Answers
          ? questionData.Answers
          : "", // For true false
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
    closeEditDialog();
  }

  useEffect(() => {
    fetchQuizDetails();
  }, [currentQuizLink]);

  const fetchQuizDetails = async () => {
    try {
      const response = await getQuizDetailsByLink(currentQuizLink);
      if (response && response.data) {
        const result = await getQuizQuestions(currentQuizLink);
        setQuestions(result.data);

        // Initialize form values for all questions
        const initialFormValues = result.data.map((question) => ({
          questionId: question.QuestionId,
          questionTypeId: question.QuestionTypeId,
          question: question.QuestionText,
          Options: question.Options
            ? question.Options.map((option) => ({
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
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditMode(index);
    setEditing(true);
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

  const renderQuestionFields = (question, index) => {
    switch (question.QuestionTypeId) {
      case 1:
        return (
          <RadioGroup
            name={`Questions[${index}].Answers`}
            value={formik.values.Questions[index]?.Answers || ""}
            onChange={(event) => handleRadioChange(index, event)}
          >
            {formik.values.Questions[index]?.Options.map((option, optIndex) => (
              <Box key={optIndex} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label={`Option ${optIndex + 1}`}
                  name={`Questions[${index}].Options[${optIndex}].OptionText`}
                  value={option?.OptionText || ""}
                  onChange={(event) => handleOptionChange(index, optIndex, event)}
                  disabled={editMode !== index}
                  margin="normal"
                  error={
                    formik.touched.Questions &&
                    formik.touched.Questions[index]?.Options &&
                    formik.errors.Questions &&
                    formik.errors.Questions[index]?.Options &&
                    Boolean(
                      formik.errors.Questions[index]?.Options[optIndex]?.OptionText
                    )
                  }
                  helperText={
                    formik.touched.Questions &&
                    formik.touched.Questions[index]?.Options &&
                    formik.errors.Questions &&
                    formik.errors.Questions[index]?.Options[optIndex]?.OptionText
                  }
                />
                <FormControlLabel
                  value={option?.OptionText || ""}
                  control={<Radio />}
                  label=""
                  disabled={editMode !== index}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{margin:"1px"}}
                />
              </Box>
            ))}
          </RadioGroup>
        );
      case 2:
        return (
          <>
            <FormControl fullWidth margin="normal">
              {formik.values.Questions[index]?.Options.map(
                (option, optIndex) => (
                  <Box key={optIndex} display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      label={`Option ${optIndex + 1}`}
                      name={`Questions[${index}].Options[${optIndex}].OptionText`}
                      value={option?.OptionText || ""}
                      onBlur={() => {
                        console.log(formik);
                      }}
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
                        formik.errors.Questions[index]?.Options[optIndex]
                          ?.OptionText
                      }
                    />
                    <Checkbox
                      name={`Questions[${index}].Options[${optIndex}].IsAnswer`}
                      checked={option?.IsAnswer || false}
                      onChange={formik.handleChange} // Ensure handleChange is used for checkboxes
                      disabled={editMode !== index}
                      onBlur={formik.handleBlur}
                    />
                  </Box>
                )
              )}
              {formik.touched.Questions &&
                formik.touched.Questions[index]?.Answers &&
                formik.errors.Questions &&
                formik.errors.Questions[index]?.Answers && (
                  <Typography variant="caption" color="error">
                    {formik.errors.Questions[index]?.Answers}
                  </Typography>
                )}
            </FormControl>
          </>
        );
      case 3:
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>Correct Answer</InputLabel>
            <Select
              name={`Questions[${index}].Answers`}
              value={formik.values.Questions[index]?.Answers || ""}
              onChange={formik.handleChange}
              disabled={editMode !== index}
              label="Correct Answer"
            >
              <MenuItem value="True">True</MenuItem>
              <MenuItem value="False">False</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.Questions &&
                formik.errors.Questions &&
                formik.errors.Questions[index]?.Answers}
            </FormHelperText>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">
                      Question {index + 1} (
                      {questionTypeEnum[question.QuestionTypeId]})
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => handleEditClick(index)}
                        disabled={editing && editMode !== index}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(index)}
                        disabled={editing && editMode !== index}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <form onSubmit={formik.handleSubmit}>
                    <TextField
                      fullWidth
                      label="Question"
                      name={`Questions[${index}].question`}
                      value={formik.values.Questions[index]?.question || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={editMode !== index}
                      margin="normal"
                      error={
                        formik.touched.Questions &&
                        formik.touched.Questions[index]?.question &&
                        Boolean(
                          formik.errors.Questions &&
                            formik.errors.Questions[index]?.question
                        )
                      }
                      helperText={
                        formik.touched.Questions &&
                        formik.touched.Questions[index]?.question &&
                        formik.errors.Questions &&
                        formik.errors.Questions[index]?.question
                      }
                    />
                    {renderQuestionFields(question, index)}
                    {editMode === index && (
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No questions available.</Typography>
        )}
      </Grid>
     
    </Container>
  );
};

export default ViewQuizQuestions;
