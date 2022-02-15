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
    // }, []);
  });

  function makeKeyboard() {
    const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const row3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"];
    return (
      <>
        {[row1, row2, row3].map((row, rowIndex) => {
          return (
            <>
              <div key={rowIndex} className="row">
                {row.map((char, charIndex) => {
                  const actionBtnClass =
                    char.toLowerCase() === "enter" || char === "DEL"
                      ? "actionBtn"
                      : "";
                  return (
                    <>
                      <div
                        key={charIndex}
                        style={{
                          backgroundColor: `${getKeyColor(
                            char,
                            WINNING_WORD,
                            usedCharSet,
                            matchedCharSet
                          )}`,
                        }}
                        className={`keychar ${actionBtnClass}`}
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
            className="guessGridBox noselect "
            key={charIndex}
            style={{
              backgroundColor: `${getBackgroundColor(
                printedChar,
                guessList?.[rowIndex]?.isSubmitted,
                charIndex,
                WINNING_WORD,
                "#111"
              )}`,
            }}
          >
            <span className="">{printedChar}</span>
          </div>
        );
      });
  }

  // function isNewInput() {
  //   // retu
  // set new css on new additional char to String
  // }

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

    if (currentAttempt.length !== MAX_WORD_LENGTH) {
      setErrorMsg("Use a longer word");
    } else if (isWord === false) {
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
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (currentAttempt === WINNING_WORD) {
        setWinner(true);
      }
      if (newAttemptCount === MAX_GUESSES) {
        setGameOver(true);
      }
    } else {
      setErrorMsg("Your word must be 5 characters");
    }
  }

  // function flipCard(charBox) {
  //   charBox.style = "";
  // }

  function setCurrentInputAttempt(char) {
    setErrorMsg("");

    const currentGuess = guessList[attemptCount].guess;
    const charsOnlyRegex = new RegExp(/[a-z]/);
    const letter = char.toLowerCase();

    if (!letter) {
      console.log("no valid input");
    } else if (letter === "«" || letter === "backspace" || letter === "del") {
      // console.log("trimming");
      // const currentGuess = guessList[attemptCount].guess;
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
    } else if (letter === "enter") {
      onEnterPressed();
    } else if (letter.length > 1) {
    } else if (currentGuess.length >= MAX_WORD_LENGTH) {
    } else if (charsOnlyRegex.test(letter)) {
      if (attemptCount < MAX_GUESSES) {
        // console.log("Setting: ", currentAttempt + letter);
        // const currentGuess = guessList[attemptCount].guess;
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
      wordRef.current = getWinningWord();
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
        <GameOver word={WINNING_WORD} />
      ) : (
        <>
          <div id="letterBox">{createRow()}</div>
          <div id="keyboard">{makeKeyboard()}</div>
          {errorMsg}
        </>
      )}
      <br />
      <Reset />
    </>
  );
}

function GameOver(winningWord) {
  const { word } = winningWord;
  return (
    <>
      <h1>YOU LOST GAME OVER!</h1>
      <div>
        <iframe
          src="https://giphy.com/embed/yatOmFJnu32lW"
          title="lose"
          width="480"
          height="460"
          frameBorder="0"
          class="giphy-embed"
          allowFullScreen
        ></iframe>
        <br />
        <span>The word was: {word}</span>
      </div>
    </>
  );
}
function Winner() {
  return (
    <>
      <div>
        <span>YOU WIN</span>
        <div>
          <iframe
            src="https://giphy.com/embed/kyLYXonQYYfwYDIeZl"
            title="celebrate"
            width="480"
            height="360"
            frameBorder="0"
            class="giphy-embed"
            allowFullScreen
          ></iframe>
          <p></p>
        </div>
      </div>
    </>
  );
}
