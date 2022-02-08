import React, { useRef, useState, useEffect } from "react";
const WORDLIST = require("./WORDLIST.json");
const MAX_GUESSES = 6;
const MAX_WORD_LENGTH = 5;

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

function getRandomWord() {
  const randomWord = WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return randomWord;
}

function isWordInWordList(word) {
  const formattedWord = word.toLowerCase();
  const inWordListBool = WORDLIST.includes(formattedWord) ? true : false;
  console.log(inWordListBool);
  return inWordListBool;
}

function makeKeyboard() {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];
  const keyStyles = {
    height: "20px",
    width: "20px",
    backgroundColor: "gray",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {row1.map((char) => {
            return (
              <>
                <div className="key" style={keyStyles}>
                  {char}
                </div>
              </>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {row2.map((char) => {
            return (
              <>
                <div className="key" style={keyStyles}>
                  {char}
                </div>
              </>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {row3.map((char) => {
            return (
              <>
                <div className="key" style={keyStyles}>
                  {char}
                </div>
              </>
            );
          })}
        </div>

        {/* {[...row1, ...row2, ...row3].map((char) => {
          return (
            <div>
              <div className="key" style={keyStyles}>
                {char}
              </div>
            </div>
          );
        })} */}
      </div>
    </>
  );
}

export default function GameBoard() {
  const wordRef = useRef(getRandomWord());
  const word = wordRef.current;
  const characterLimit = 5;
  const maxGuesses = 6;

  const GAME_STATE = [
    ...Array.from({ length: MAX_GUESSES }).map((_blank, index) => {
      return {
        attemptNumber: index,
        guess: "",
        isSubmitted: false,
      };
    }),
  ];

  const keyboard = useRef();
  const [errorMsg, setErrorMsg] = useState("");

  const [input, setInput] = useState("hello");

  const [guessList, setGuessList] = useState(GAME_STATE);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isGameOver, setGameOver] = useState(false);
  const [isWinner, setWinner] = useState(false);
  // const [isMatchingChar, setIsMatchingChar] = useState("");
  // const [isContainingChar, setIsContainingChar] = useState("");
  // const [isUnusedChar, setIsUnusedChar] = useState("");

  function getBackgroundColor(char, isSubmitted, index, word) {
    // console.log(char, isSubmitted, index, word);
    if (isSubmitted === true && word[index] === char) {
      // return "green";
      return "#6aaa64";
    }
    if (isSubmitted === true && word.includes(char) === true) {
      // return "yellow";
      return "#b59f3b";
    } else if (isSubmitted === true) {
      // GRAY
      return "gray";
    } else {
      return "white";
    }
  }

  function createCharBox(char, rowIndex) {
    return Array.from({ length: MAX_WORD_LENGTH })
      .fill("")
      .map((_blank, charIndex) => {
        const printedChar = guessList?.[rowIndex]?.guess[charIndex];

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
                word
              )}`,
            }}
          >
            <span>{printedChar}</span>
          </div>
        );
      });
  }

  function createRow() {
    const charValue = "";
    return Array.from({ length: MAX_GUESSES })
      .fill("")
      .map((_blank, index) => {
        return (
          <div className="row" key={index}>
            {createCharBox(charValue, index)}
          </div>
        );
      });
  }

  function handleChange(changeInput) {
    if (isSubmitting === true) {
      setInput("");
      keyboard.current.setInput(""); // Triggers Input onchange
      setIsSubmitting(false);
    } else if (changeInput.length <= characterLimit) {
      setInput(changeInput);
      const newGuess = {
        attemptNumber: attemptCount,
        guess: changeInput,
        isSubmitted: false,
      };
      let newList = [...guessList];
      newList[attemptCount] = newGuess;
      setGuessList(newList);
    }
  }

  function onChange(eInput) {
    console.log("onchange", eInput);
    return handleChange(eInput);
  }

  function onEnterPressed() {
    // console.log("word: ", word);
    const isWord = isWordInWordList(input);
    console.log("isWord: ", isWord);
    console.log("input: ", input);

    if (isWord === false) {
      setErrorMsg("Word must be in list");
    } else if (input.length <= characterLimit) {
      // console.log("input.length", input.length);
      // console.log("characterLimit", characterLimit);
      const newGuess = {
        attemptNumber: attemptCount,
        guess: input,
        isSubmitted: true,
      };

      let newList = [...guessList];
      newList[attemptCount] = newGuess;
      setGuessList(newList);

      // console.log("isMatchingChar: ", isMatchingChar);
      // setIsMatchingChar(`${isMatchingChar} ${char} `);

      setInput("");
      keyboard.current.setInput(""); // Triggers Input onchange
      setAttemptCount(++attemptCount);
      setIsSubmitting(true);

      setInput(input);
      if (input === word) {
        setWinner(true);
      }
      if (attemptCount === maxGuesses) {
        setGameOver(true);
      }
    } else {
      setErrorMsg("Your word must be 5 characters");
    }
  }

  function onKeyPress(button) {
    console.log("key", button);
    setErrorMsg("");
    if (button === "{enter}") {
      return onEnterPressed();
    }
  }

  const handleKeyPress = (e) => {
    const numbersNotAllowedRegex = new RegExp("/^([^0-9]*)$/");
    const charsOnlyRegex = new RegExp("/^[a-zA-Z]+$/");
    const eventInput = e.key.replace(charsOnlyRegex);
    console.log("key: ", e.key);
    console.log("input: ", input);
    if (!eventInput) {
      console.log("no valid input");
    }
    if (eventInput === "Backspace") {
      console.log("trimming");
      setInput(eventInput.slice(0, eventInput.length - 1));
    } else if (eventInput === "Enter") {
      console.log("submitting", input);
      onEnterPressed();
    } else if (eventInput) {
      console.log("eventInput", eventInput);
      console.log("input", input);
      const newInput = input.concat(eventInput);
      setInput(newInput);
      // keyboard.current = keyboard.current.concat(eventInput);

      console.log("new input", newInput, input);

      const newGuess = {
        attemptNumber: attemptCount,
        guess: input,
        isSubmitted: false,
      };
      let newList = [...guessList];
      newList[attemptCount] = newGuess;
      setGuessList(newList);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      {isWinner === true ? (
        <Winner />
      ) : isGameOver === true ? (
        <GameOver />
      ) : (
        <>
          {word.current}
          {createRow()}
          {/* {makeKeyboard()} */}
          {errorMsg}
        </>
      )}
      <br />
      <br />
      Guesses: {JSON.stringify(guessList)}
      <br />
      Current Input {JSON.stringify(input)}
      <br />
      Attempt #: {attemptCount}
    </>
  );
}
