import { combineReducers } from "redux";
import { userRoleReducer } from "./userRoleReducer";
import { userNameReducer } from "./userNameReducer";
import { userEmailReducer } from "./userEmailReducer";

const reducers = combineReducers({
  userRole: userRoleReducer,
  userName: userNameReducer,
  userEmail: userEmailReducer,
});

export default reducers;