import * as yup from 'yup';
export const CREATE_QUIZ_VALIDATIONS ={
    quizTitle: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150,"Title must be at most 150 characters")
    .required("Title is required"),

    quizDescription: yup
    .string()
    .max(1000,"Description must be at most 1000 characters"),

    category: yup
    .number()
    .required("Category is required"),
   
    marksPerQuestion: yup
    .number()
    .required("Marks Per Question is required")
    .min(1, "Marks per question must be at least 1")
    .max(10, "Marks per question must be at most 10"),

  negativeMarksPerQuestion: yup
  .number().nullable()
  .min(1, "Marks per question must be at least 1")
  .max(10, "Marks per question must be at most 10"),


  winningAmount: yup
  .number().nullable()
  .min(1, "winningAmount must be at least 1 rs"),

  totalQuestions: yup
  .number()
  .required("Total Question is required")
  .min(1, "total Questions must be at least 1")
  .max(25, "total Questions must be at most 25"),


  difficulty: yup
  .number()
  .required("difficulty level is required"),

  scheduledDateTime: yup
  .date()
  .required("scheduledDateTime  is required") 
 
};

