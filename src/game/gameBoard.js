import React, { useRef, useState, useEffect } from "react";
import {
  getWinningWord,
  isWordInWordList,
  getBackgroundColor,
  useLocalStorage,
  getKeyColor,
} from "./gameApi";

export default function GameBoard() {
  const wordRef = useRef(getWinningWord());
  const WINNING_WORD = wordRef.current;
  const MAX_GUESSES = 6;
  const MAX_WORD_LENGTH = 5;

  const GAME_STATE = [
    ...Array.from({ length: MAX_GUESSES }).map((_blank, index) => {
      return {
        attemptNumber: index,
        guess: "",
        isSubmitted: false,
      };
    }),
  ];

  const [errorMsg, setErrorMsg] = useState("");

  const [attemptCount, setAttemptCount] = useLocalStorage("attemptCount", 0);
  const [guessList, setGuessList] = useLocalStorage("GAME_STATE", GAME_STATE);
  const [isWinner, setWinner] = useLocalStorage("didWin", false);
  const [isGameOver, setGameOver] = useLocalStorage("didLose", false);
  const usedCharSet = new Set();
  const matchedCharSet = new Set();

  const chars = guessList
    .filter((guess) => guess.isSubmitted === true)
    .map((guess) => guess.guess.split(""));

  for (let i = 0; i <= attemptCount; i++) {
    chars.forEach((word) => {
      word.forEach((character, index) => {
        usedCharSet.add(character);

        if (WINNING_WORD[index] === character) {
          matchedCharSet.add(character);
        }
      });
    });
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function makeKeyboard() {
    const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const row3 = ["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"];
    return (
      <>
        {[row1, row2, row3].map((row, rowIndex) => {
          return (
            <>
              <div id="keyrow" key={rowIndex} className="row">
                {row.map((char, charIndex) => {
                  const keyStyles = {
                    padding: "15px",
                    margin: "2px",
                    border: "1px solid whitesmoke",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    backgroundColor: `${getKeyColor(
                      char,
                      WINNING_WORD,
                      usedCharSet,
                      matchedCharSet
                    )}`,
                  };

                  return (
                    <>
                      <div
                        key={charIndex}
                        className="key"
                        style={keyStyles}
                        onClick={() => setCurrentInputAttempt(char)}
                      >
                        {char}
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          );
        })}
      </>
    );
  }

  function createCharBox(rowIndex) {
    return Array.from({ length: MAX_WORD_LENGTH })
      .fill("")
      .map((_blank, charIndex) => {
        const printedChar = guessList[rowIndex].guess[charIndex];

        return (
          <div
            className="charBox"
            key={charIndex}
            style={{
              width: "50px",
              height: "50px",
              fontSize: "35px",
              lineHeight: "50px",
              fontWeight: "bold",
              // border: "1px solid #aaa",
              margin: "10px",
              backgroundColor: `${getBackgroundColor(
                printedChar,
                guessList?.[rowIndex]?.isSubmitted,
                charIndex,
                WINNING_WORD,
                "darkgray"
              )}`,
            }}
          >
            <span>{printedChar}</span>
          </div>
        );
      });
  }

  function createRow() {
    return Array.from({ length: MAX_GUESSES })
      .fill("")
      .map((_blank, index) => {
        return (
          <div className="row" key={index}>
            {createCharBox(index)}
          </div>
        );
      });
  }

  function onEnterPressed() {
    console.log("word: ", WINNING_WORD);
    const currentAttempt = guessList[attemptCount].guess;
    const isWord = isWordInWordList(currentAttempt);
    // console.log("isWord: ", isWord);
    // console.log("input: ", currentAttempt);

    if (isWord === false) {
      setErrorMsg("Word must be in list");
    } else if (currentAttempt.length <= MAX_WORD_LENGTH) {
      // console.log("input.length", input.length);
      // console.log("characterLimit", characterLimit);
      const newGuess = {
        attemptNumber: attemptCount,
        guess: currentAttempt,
        isSubmitted: true,
      };

      let newList = [...guessList];
      newList[attemptCount] = newGuess;
      setGuessList(newList);
      setAttemptCount(attemptCount + 1);

      if (currentAttempt === WINNING_WORD) {
        setWinner(true);
      }
      if (attemptCount === MAX_GUESSES) {
        setGameOver(true);
      }
    } else {
      setErrorMsg("Your word must be 5 characters");
    }
  }

  function setCurrentInputAttempt(char) {
    // console.log("keydown", WINNING_WORD);
    // console.log("raw key: ", char);
    const charsOnlyRegex = new RegExp(/[a-z]/);

    const letter = char.toLowerCase();
    // console.log(charsOnlyRegex.test(letter));

    if (!letter) {
      console.log("no valid input");
    }

    if (letter === "enter") {
      // console.log("submitting");
      onEnterPressed();
    } else if (letter === "backspace" || letter === "del") {
      // console.log("trimming");
      const currentGuess = guessList[attemptCount].guess;
      // console.log(currentGuess);
      const newAttempt = currentGuess.slice(0, currentGuess.length - 1);
      // console.log(newAttempt);

      const newGuess = {
        attemptNumber: attemptCount,
        guess: newAttempt,
        isSubmitted: false,
      };
      let newList = [...guessList];
      newList[attemptCount] = newGuess;
      // console.log("newList");
      // console.log(JSON.stringify(newList, null, 2));
      setGuessList(newList);
      // setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (letter === "shift") {
      console.log("shifty");
    } else if (charsOnlyRegex.test(letter)) {
      if (attemptCount < 5) {
        // console.log("Setting: ", currentAttempt + letter);
        const currentGuess = guessList[attemptCount].guess;
        // console.log("CURRENTGUESS", currentGuess);
        const newAttempt = currentGuess + letter;

        const newGuess = {
          attemptNumber: attemptCount,
          guess: newAttempt,
          isSubmitted: false,
        };
        // console.log("newGuess");
        // console.log(JSON.stringify(newGuess, null, 2));
        let newList = [...guessList];
        newList[attemptCount] = newGuess;
        // console.log("newList");
        // console.log(JSON.stringify(newList, null, 2));
        setGuessList(newList);
      }
    }
  }

  function handleKeyDown(e) {
    setCurrentInputAttempt(e.key);
  }

  function Reset() {
    function handleReset() {
      setAttemptCount(0);
      setGuessList(GAME_STATE);
      setWinner(false);
      setGameOver(false);
    }

    return (
      <>
        <button onClick={handleReset}>Reset</button>
      </>
    );
  }

  return (
    <>
      {isWinner === true ? (
        <Winner />
      ) : isGameOver === true ? (
        <GameOver />
      ) : (
        <>
          {WINNING_WORD.current}
          {createRow()}
          <div id="keyboard">{makeKeyboard()}</div>
          {errorMsg}
        </>
      )}
      <br />
      <Reset />
      {/* <br />
      Guesses: {JSON.stringify(guessList)}
      <br />
      Current Input {JSON.stringify(currentAttempt)}
      <br />
      Attempt #: {attemptCount} */}
    </>
  );
}

function GameOver() {
  return (
    <>
      <h1>GAME OVER</h1>
    </>
  );
}
function Winner() {
  return (
    <>
      <alert>YOU WIN</alert>
    </>
  );
}
