import { combineReducers } from "redux";
import * as types from "./types";

const initialGameState = {
  word: "",
  guessCounter: 0,
  guesses: [],
  currentGuess: "",
};

const gameReducer = (state = initialGameState, { type, payload }) => {
  // const { guess } = payload;
  switch (type) {
    case types.SET_GUESS:
      return {
        word: "",
        guessCounter: state.guessCounter + 1,
        guesses: Object.assign(...state.guesses, payload.guess),
        // guesses: [...state.guesses, payload.guess],
        currentGuess: "",
      };
    default:
      return state;
  }
};

// COMBINED REDUCERS
const reducers = {
  game: gameReducer,
};

export default combineReducers(reducers);
