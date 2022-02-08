import { useState } from "react";
export const WORDLIST = require("./WORDLIST.json");

export function getRandomWord() {
  const randomWord = WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
  return randomWord;
}

export function isWordInWordList(word) {
  const formattedWord = word.toLowerCase();
  const inWordListBool = WORDLIST.includes(formattedWord) ? true : false;
  return inWordListBool;
}

export function getBackgroundColor(
  char,
  isSubmitted,
  index,
  word,
  defaultColor = "lightgrey"
) {
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
    return defaultColor;
  }
}

export function getKeyColor(guessList, winningWord) {
  try {
    console.log("guessList", "winningWord");
    console.log(guessList, winningWord);
    //  Logic
    // for each guess
    // If guess char at index === winningWord at index
    // then green
    // If winningWord.contains guess char at index
    // then yellow
    // If winningWord DOES NOTcontains guess char at index
    // then dark gray
    // else light gray for unused chars
    // guessList.forEach((guess, index) => {
    //   if (winningWord[index] === guess[index]) {
    //     // return "green";
    //     return "#6aaa64";
    //   }
    // });
    // if (winningWord[charIndex] === formattedChar) {
    //   // return "green";
    //   return "#6aaa64";
    // }
    // if (winningWord.includes(formattedChar) === true) {
    //   // return "yellow";
    //   return "#b59f3b";
    // } else if (winningWord.includes(formattedChar) === false) {
    //   // GRAY
    return "gray";
    // }
  } catch (err) {
    console.error(err);
    return "gray";
  }
}

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
