export const changeUserRole = (role) => {
  return (dispatch) => {
    dispatch({
      type: 'change',
      payload: role
    })
  }
}