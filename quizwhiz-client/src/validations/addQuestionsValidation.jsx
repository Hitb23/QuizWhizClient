import * as Yup from "yup";
export const ADD_QUESTIONS_VALIDATIONS ={

    questions: Yup.array().of(
        Yup.object().shape({
          question: Yup.string()
            .required("Question is required")
            .max(700, "Question must be at most 700 characters"),
          answerOptions: Yup.array().when("type", {
            is: (type) => type === "MCQ" || type === "MSQ",
            then: () =>
              Yup.array()
                .of(Yup.string().required("Answer option is required"))
                .length(4, "Must have exactly 4 options"),
          }),
          correctAnswers : Yup.array().when("type", {
            is:(type) =>  type === "TITA" ||type === "TF"||type ==="MCQ" ,
            then: ()=>
            Yup.array() .of( Yup.string()  .required('Correct answer is required') .max(100, 'Correct answer cannot be longer than 100 characters') )
            .length(1, 'One correct answer is required'),
            otherwise: ()=> Yup.array().required("correct answer is required").min(1,"atleast one correct answer is required")                 
          })
        })
      )
 
};

