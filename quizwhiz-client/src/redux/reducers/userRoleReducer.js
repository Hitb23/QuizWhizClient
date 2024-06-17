const userRoleReducer = (state="", action) => {
  if(action.type==="change"){
    return action.payload;
  }
  else {
    return state;
  }
}

export default userRoleReducer;