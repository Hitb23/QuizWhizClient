import { combineReducers } from "redux";
import userRoleReducer from "./userRoleReducer";

const reducers = combineReducers({
  userRole: userRoleReducer
});

export default reducers;