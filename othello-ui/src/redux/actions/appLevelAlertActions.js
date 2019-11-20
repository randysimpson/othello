import * as types from './actionTypes';

export function loadAppLevelAlert(alert) {
  return {
    type: types.APP_LEVEL_ALERT_SHOW,
    alert
  };
}

export function createAlert(level, message) {
  return function(dispatch) {
    //could call ajax right here.
    dispatch(loadAppLevelAlert({
      level,
      message
    }));
  };
}