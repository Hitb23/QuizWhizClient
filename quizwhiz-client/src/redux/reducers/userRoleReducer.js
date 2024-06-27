export const userRoleReducer = (state="", action) => {
  if(action.type=='SET_USER_ROLE'){
    return {...state, userRole: action.payload};
  }
  else {
    return state;
  }
}