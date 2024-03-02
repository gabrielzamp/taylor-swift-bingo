"use client"

import React, { useState, useEffect } from 'react';
import data from './outputData'; // Adjust the import path as needed

function App() {
  const [currentMusic, setCurrentMusic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBingoItems, setSelectedBingoItems] = useState([]);
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Shuffle array function
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Initialize game
  const initializeGame = () => {
    // Select 4 random bingo items
    const bingoItems = shuffleArray([...data]).slice(0, 4);
    setSelectedBingoItems(bingoItems);

    // Collect musics from selected bingo items, ensure uniqueness
    let musicsFromBingoItems = bingoItems.flatMap(item => item.listOfMusics);
    let allMusics = shuffleArray(data.flatMap(item => item.listOfMusics));
    const uniqueMusics = [...new Set([...musicsFromBingoItems, ...allMusics])].slice(0, 15);

    setSelectedMusics(uniqueMusics);
    setCurrentIndex(0);
    setCurrentMusic(uniqueMusics[0]);
    setGuesses([]);
    setGameOver(false);
  };

  // Handle guess
  const handleGuess = (guess) => {
    setGuesses([...guesses, { music: currentMusic, guess }]);
    if (currentIndex < selectedMusics.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentMusic(selectedMusics[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      setGameOver(true);
    }
  };

  // Skip music
  const handleSkip = () => {
    if (currentIndex < selectedMusics.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentMusic(selectedMusics[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      setGameOver(true);
    }
  };

  // Calculate results
  const calculateResults = () => {
    return guesses.filter(guess => {
      const item = data.find(item => item.listOfMusics.includes(guess.music));
      return item && item.bingoItem === guess.guess;
    }).length;
  };

  // Start game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="p-5">
      <h1 className='text-2xl font-bold mb-5'>Taylor Swift Bingo Game</h1>
      {gameOver ? (
        <>
          <h2>Game Over! You got {calculateResults()} out of {selectedMusics.length} correct.</h2>
          <button onClick={initializeGame}>Play Again</button>
        </>
      ) : (
        <>
          <div className='flex-col gap-4'>
            <div className='flex gap-2 mb-5 items-center'>
              <h2>Current Music: {currentMusic}</h2>
              <button className='bg-gray-200 text-black px-4' onClick={handleSkip}>Skip</button>
            </div>
            <div className='grid grid-cols-2 gap-2'>
            {selectedBingoItems.map((item, index) => (
              <button className='bg-blue-400' key={index} onClick={() => handleGuess(item.bingoItem)}>
                {item.bingoItem}
              </button>
            ))}
            </div>
          </div>
        
        </>
      )}
    </div>
  );
}

export default App;
