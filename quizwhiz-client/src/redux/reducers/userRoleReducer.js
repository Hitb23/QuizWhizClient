export const userRoleReducer = (state="", action) => {
  if(action.type=='SET_USER_ROLE'){
    return action.payload;
  }
  else {
    return state;
  }
}