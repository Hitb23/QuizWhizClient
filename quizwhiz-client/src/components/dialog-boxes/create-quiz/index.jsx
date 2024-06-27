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
import { useState } from "react";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CREATE_QUIZ_VALIDATIONS } from "../../../validations/createQuizValidation";
import { Formik, Form, Field } from "formik";
import { styled } from "@mui/material/styles";
import { Style } from "@mui/icons-material";
import AddQuestions from "../add-questions";
import Typography from '@mui/material/Typography';

export default function CreateQuizModal() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = yup.object().shape(CREATE_QUIZ_VALIDATIONS);
  const handleSubmit = (values) => {
    console.log(values);
  };
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Quiz
      </Button>
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
            minMarks: null,
            difficulty: "",
            scheduledDateTime: null,
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
              <DialogTitle id="alert-dialog-title" className="text-center">
                {"Create new Quiz"}
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
                  <Grid item xs={8}>
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
                        <MenuItem value="10">Ten</MenuItem>
                        <MenuItem value="20">Twenty</MenuItem>
                        <MenuItem value="30">Thirty</MenuItem>
                      </Field>
                      {touched.category && errors.category && (
                        <span className="text-danger "style={{fontSize: "12px"}}>{errors.category}</span>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
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
                        <MenuItem value="10">Ten</MenuItem>
                        <MenuItem value="20">Twenty</MenuItem>
                        <MenuItem value="30">Thirty</MenuItem>
                      </Field>
                      {touched.difficulty && errors.difficulty && (
                        <span className="text-danger "style={{fontSize: "12px"}}>{errors.difficulty}</span>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
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
                      helperText={
                        touched.totalQuestions ? errors.totalQuestions : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                      helperText={
                        touched.marksPerQuestion ? errors.marksPerQuestion : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Negative Marks per Question"
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
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Total Marks"
                      type="number"
                      name="totalMarks"
                      value={values.totalMarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.totalMarks && Boolean(errors.totalMarks)}
                      helperText={touched.totalMarks ? errors.totalMarks : ""}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="normal"
                      label="Minimum Marks For Qualify"
                      name="minMarks"
                      type="number"
                      value={values.minMarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.minMarks && Boolean(errors.minMarks)}
                      helperText={touched.minMarks ? errors.minMarks : ""}
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  type="submit"
                >
                  Create
                </Button>
                <AddQuestions />
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
}
