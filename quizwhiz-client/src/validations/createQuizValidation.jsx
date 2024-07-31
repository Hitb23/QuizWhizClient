import * as yup from "yup";
export const CREATE_QUIZ_VALIDATIONS = {
  quizTitle: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters")
    .trim()
    .required("Title is required"),

  quizDescription: yup
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .required("Description is required"),

  category: yup.number().required("Category is required"),

  marksPerQuestion: yup
    .number()
    .required("Marks Per Question is required")
    .min(1, "Marks per question must be at least 1")
    .max(10, "Marks per question must be at most 10"),

  totalQuestions: yup
    .number()
    .required("Total Question is required")
    .min(1, "Total questions must be at least 1")
    .max(25, "Total questions must be at most 25"),

  difficulty: yup.number().required("Difficulty level is required"),

  scheduledDateTime: yup.date().required("Scheduled date and time is required"),

  totalMarks: yup.number().nullable(),

  winningAmount: yup
    .number()
    .required("Winning Amount is required")
    .min(1, "Minimum amount should be 1")
    .max(1000000, "Maximum amount should be 10,00,000"),
};
