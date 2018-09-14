import { combineReducers } from "redux";
import actor from "./actor";
import crawler from "./crawler";

const rootReducer = combineReducers({
  actor,
  crawler
});

export default rootReducer;