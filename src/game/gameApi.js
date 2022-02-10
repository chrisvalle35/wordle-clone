import { useState } from "react";
const WORDLIST = require("./WORD_LIST.json");
const WINNING_WORDS = require("./WINNING_WORDS.json");
export function getWinningWord() {
  return WINNING_WORDS[Math.floor(Math.random() * WINNING_WORDS.length)];
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

export function getKeyColor(
  keyboardEntry,
  winningWord,
  usedCharSet,
  matchedCharSet
) {
  const formattedChar = keyboardEntry.toLowerCase();
  if (usedCharSet.has(formattedChar)) {
    if (matchedCharSet.has(formattedChar)) {
      // Matching Char -> Green
      return "#6aaa64";
    } else if (
      usedCharSet.has(formattedChar) &&
      winningWord.includes(formattedChar)
    ) {
      // Containing Char -> Yellow
      return "#b59f3b";
    } else {
      // Losing Gray
      return "#3a3a3c";
    }
  } else {
    // Unused Chars
    return "#818384";
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
