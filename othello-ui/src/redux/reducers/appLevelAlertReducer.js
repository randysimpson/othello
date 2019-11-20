import * as types from "../actions/actionTypes";
import initialState from './initialState';

export default function appLevelAlertReducer(state = initialState.appLevelAlert, action) {
  if(action.type === types.APP_LEVEL_ALERT_SHOW) {
    return action.appLevelAlert;
  } else if(action.type === types.APP_LEVEL_ALERT_HIDE) {
    return {};
  }

  return state;
}
