import * as types from './actionTypes';
import gameApi from '../api/mockGameApi';

import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

export function loadGameSuccess(games) {
  return {
    type: types.LOAD_GAMES_SUCCESS,
    games
  };
}

export function loadGameDetailsSuccess(id, gameDetails) {
  return {
    type: types.LOAD_GAME_DETAILS_SUCCESS,
    game: gameDetails,
    id
  }
}

export function loadGames() {
  return function(dispatch) {
    //could call ajax right here.
    dispatch(beginAjaxCall());

    return gameApi.getAllGames().then(games => {
      dispatch(loadGameSuccess(games));
    }).catch(err => {
      dispatch(ajaxCallError());
      throw(err);
    });
  };
}

export function loadGameDetails(id) {
  return function(dispatch) {
    //could call ajax right here.
    dispatch(beginAjaxCall());

    return gameApi.getGame(id).then(gameDetails => {
      dispatch(loadGameDetailsSuccess(id, gameDetails));
    }).catch(err => {
      dispatch(ajaxCallError());
      throw(err);
    });
  };
}