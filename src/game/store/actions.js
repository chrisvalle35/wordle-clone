import * as types from "./types";

export const setGuess = (guess) => (dispatch) => {
  dispatch({
    type: types.SET_GUESS,
    payload: {
      guess,
    },
  });
};
