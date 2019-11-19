import { combineReducers } from "redux";
import ajaxCallsInProgress from './ajaxStatusReducer';
import games from './gameReducer';

export default combineReducers({ ajaxCallsInProgress, games });