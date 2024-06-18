export const userNameReducer = (state="", action) => {
  if(action.type=='SET_USER_NAME'){
    return action.payload;
  }
  else {
    return state;
  }
}