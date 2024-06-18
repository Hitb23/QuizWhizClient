export const userEmailReducer = (state="", action) => {
  if(action.type=='SET_USER_EMAIL'){
    return action.payload;
  }
  else {
    return state;
  }
}