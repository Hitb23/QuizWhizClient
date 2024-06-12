import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    email: '',
    password: '',
  },
  errors: {
    email: null,
    password: null
  },
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: formReducer,
});

export default store;
