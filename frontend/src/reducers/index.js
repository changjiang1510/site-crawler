import { combineReducers } from "redux";
import actor from "./actor";
import crawler from "./crawler";
import filter from "./filter";

const rootReducer = combineReducers({
  actor,
  crawler,
  filter,
});

export default rootReducer;