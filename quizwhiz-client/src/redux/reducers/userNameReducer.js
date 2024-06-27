export const userNameReducer = (state="", action) => {
  if(action.type=='SET_USER_NAME'){
    return {...state, userName: action.payload};
  }
  else {
    return state;
  }
}