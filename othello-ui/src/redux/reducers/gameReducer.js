import { LOAD_GAMES_SUCCESS, LOAD_GAME_DETAILS_SUCCESS } from "../actions/actionTypes";
import initialState from './initialState';

export default function(state = initialState.games, action) {
  switch (action.type) {
    case LOAD_GAMES_SUCCESS:
      return action.games;
    case LOAD_GAME_DETAILS_SUCCESS:
      let oldValue = state.filter(game => game.id === action.id);
      if(oldValue.length === 1) {
        oldValue = Object.assign({}, action.game);
        oldValue.retrieveDate = new Date();
        const newArry = [...state.filter(game => game.id !== action.id),
          oldValue
        ];
        return newArry.sort((a,b) => {
          if(a.id < b.id)
            return -1;
          else if(a.id > b.id)
            return 1;
          else {
            return 0;
          }
        });
      } else {
        return state;
      }
    default:
      return state;
  }
}
