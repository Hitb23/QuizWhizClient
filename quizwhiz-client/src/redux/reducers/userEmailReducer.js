export const userEmailReducer = (state="", action) => {
  if(action.type=='SET_USER_EMAIL'){
    return {...state, userEmail : action.payload};
  }
  else {
    return state;
  }
}