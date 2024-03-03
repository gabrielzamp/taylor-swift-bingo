"use client";

import React, { useState, useEffect } from "react";
import data from "./outputData"; // Certifique-se de que o caminho esteja correto
import { Bebas_Neue, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

const getRandomElements = (arr, n) => {
  let result = [];
  let len = arr.length;
  let taken = new Array(len);
  if (n > len)
    throw new RangeError(
      "getRandomElements: more elements taken than available"
    );
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const Game = () => {
  const [selectedBingoItems, setSelectedBingoItems] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [guesses, setGuesses] = useState({});
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const bingoItems = getRandomElements(data, 9);
    setSelectedBingoItems(bingoItems);

    let songs = new Set();
    bingoItems.forEach((item) => {
      getRandomElements(
        item.listOfMusics,
        Math.min(2, item.listOfMusics.length)
      ).forEach((song) => songs.add(song));
    });

    const additionalSongs = getRandomElements(
      data
        .flatMap((item) => item.listOfMusics)
        .filter((song) => !songs.has(song)),
      41 - songs.size
    );
    additionalSongs.forEach((song) => songs.add(song));

    setSelectedSongs(shuffleArray([...songs]));
    setCurrentSongIndex(0);
    setGuesses({});
    setGameOver(false);
  };

  const handleGuess = (bingoItem) => {
    if (!guesses[bingoItem] && !gameOver) {
      const newGuesses = {
        ...guesses,
        [bingoItem]: selectedSongs[currentSongIndex],
      };
      setGuesses(newGuesses);

      if (Object.keys(newGuesses).length === selectedBingoItems.length) {
        setGameOver(true);
      } else {
        nextSongOrEndGame();
      }
    }
  };

  const handleSkip = () => {
    nextSongOrEndGame();
  };

  const nextSongOrEndGame = () => {
    if (
      currentSongIndex < selectedSongs.length - 1 &&
      Object.keys(guesses).length < selectedBingoItems.length
    ) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const calculateHits = () => {
    return selectedBingoItems.reduce((acc, item) => {
      if (
        guesses[item.bingoItem] &&
        item.listOfMusics.includes(guesses[item.bingoItem])
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  return (
    <div className="bg-[#381a5a] w-full text-white">
      <div
        className={`p-4 flex flex-col items-center bg-[#381a5a] ${bebas.className} w-full`}
      >
        <h1 className="py-3 mb-4 text-5xl font-bold text-center text-white">
          Taylor Swift Bingo Game
        </h1>
        {!gameOver ? (
          <>
            <div className="flex items-center justify-between w-full max-w-72 gap-3 px-4 py-3 mb-5 border border-white rounded-md bg-[#381a5a] ">
              <div>
                <p className="text-sm">Current song:</p>
                <p className="text-2xl">{selectedSongs[currentSongIndex]}</p>
              </div>
              <div>
                <button
                  className="w-full px-4 py-1 mb-1 text-xl text-white bg-blue-500 rounded hover:bg-blue-700"
                  onClick={handleSkip}
                >
                  Skip
                </button>
                <p>({selectedSongs.length - currentSongIndex} musics left)</p>
              </div>
            </div>

            <div className="grid items-center grid-cols-3 gap-1 md:grid-cols-3 md:gap-3">
              {selectedBingoItems.map((item) => (
                <div
                  className="w-full h-full aspect-1 aspect-square"
                  key={item.bingoItem}
                >
                  <button
                    className={`w-full h-full aspect-square tracking-wider text-lg uppercase font-bold px-2 py-2 ${
                      guesses[item.bingoItem]
                        ? "bg-[#ceff27] text-[#1E0E30]"
                        : "bg-blue-400 text-white"
                    }  rounded`}
                    onClick={() => handleGuess(item.bingoItem)}
                    disabled={!!guesses[item.bingoItem]}
                  >
                    {item.bingoItem}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="items-center mt-2 mb-3 text-5xl text-white">
              Game Over!
            </h2>
            <div className="flex flex-col items-center justify-center px-5 py-2 border border-white rounded-md">
              <p className="mt-3 text-xl">Here are your results:</p>
              <p className="self-center mt-2 text-3xl text-center">
                Points: {calculateHits()} of {selectedBingoItems.length} Points
              </p>
            </div>
            <ol>
              {selectedBingoItems.map((item) => (
                <li key={item.bingoItem} className="text-lg">
                  {item.bingoItem}:{" "}
                  {guesses[item.bingoItem]
                    ? guesses[item.bingoItem] +
                      " - " +
                      (item.listOfMusics.includes(guesses[item.bingoItem])
                        ? "Correct"
                        : "Incorrect")
                    : "Not Selected"}
                </li>
              ))}
            </ol>
            <button
              className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-700"
              onClick={initializeGame}
            >
              Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
