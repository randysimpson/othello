import { combineReducers } from "redux";
import ajaxCallsInProgress from './ajaxStatusReducer';
import games from './gameReducer';
import appLevelAlert from './appLevelAlertReducer';

export default combineReducers({ ajaxCallsInProgress, games, appLevelAlert });
