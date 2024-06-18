export const changeUserRole = (role) => {
  return ((dispatch) => {
    dispatch({
      type: "SET_USER_ROLE",
      payload: role
    })
  });
};

export const changeUserName = (username) => {
  return ((dispatch) => {
    dispatch({
      type: "SET_USER_NAME",
      payload: username
    })
  });
};

export const changeUserEmail = (email) => {
  return ((dispatch) => {
    dispatch({
      type: "SET_USER_EMAIL",
      payload: email
    })
  });
};