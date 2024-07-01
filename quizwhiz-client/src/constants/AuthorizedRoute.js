const AuthorizedRoute = ({ roles, userRole }) => {
  if (roles?.includes(userRole)) {
    return true;
  } else {
    return false;
  }
};

export default AuthorizedRoute;
