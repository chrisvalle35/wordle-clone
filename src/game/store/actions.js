import * as types from "./types";

export const setGuess = (guess) => (dispatch) => {
  console.log("guess");
  console.log(guess);
  dispatch({
    type: types.SET_GUESS,
    payload: {
      guess,
      // currentGuess
      // guessCounter: 0,
      // guesses: [],
      // currentGuess: "",
    },
  });
  // dispatch(resetGuess())
};
