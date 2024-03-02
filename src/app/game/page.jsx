"use client"
import React, { useState, useEffect } from 'react';
import data from './outputData'; // Certifique-se de que o caminho esteja correto

function App() {
  const [selectedBingoItems, setSelectedBingoItems] = useState([]);
  const [currentSong, setCurrentSong] = useState('');
  const [guesses, setGuesses] = useState({});
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeGame = () => {
    const bingoItems = shuffleArray([...data]).slice(0, 4); // Seleciona 4 itens de bingo aleatoriamente
    setSelectedBingoItems(bingoItems);
    setGuesses({});
    setGameOver(false);
    nextSong();
  };

  const nextSong = () => {
    const allSongs = shuffleArray(data.flatMap(item => item.listOfMusics));
    setCurrentSong(allSongs.find(song => !Object.values(guesses).map(guess => guess.song).includes(song)));
  };

  const handleGuess = (bingoItem) => {
    if (Object.keys(guesses).length < selectedBingoItems.length && !Object.values(guesses).map(guess => guess.song).includes(currentSong)) {
      const isCorrect = selectedBingoItems.find(item => item.bingoItem === bingoItem).listOfMusics.includes(currentSong);
      setGuesses(prev => ({
        ...prev,
        [bingoItem]: { song: currentSong, isCorrect }
      }));

      if (Object.keys(guesses).length === selectedBingoItems.length - 1) {
        setGameOver(true);
      } else {
        nextSong();
      }
    }
  };

  const handleSkip = () => {
    nextSong();
  };

  return (
    <div className="p-4" >
      <h1 className='text-3xl font-bold mb-4'>Taylor Swift Bingo Game</h1>
      {!gameOver ? (
        <>
        <div>
          <div className="flex flex-col pb-4">

            <p className='text-sm mb-2  italic'>Current Song:</p>

            <div className='flex gap-2'>
              <h2 className='font-bold text-2xl'>{currentSong}</h2>
              <button className="px-2 py-1 bg-gray-100 text-black rounded-md" onClick={handleSkip}>Skip</button>
            </div>

          </div>

          <div className='grid grid-cols-2 gap-4'>
            {selectedBingoItems.map(item => (
              <button className='bg-blue-400  py-2' key={item.bingoItem} onClick={() => handleGuess(item.bingoItem)} disabled={Object.keys(guesses).includes(item.bingoItem)}>
                {item.bingoItem}
              </button>
            ))}
          </div>
          </div>
        </>
      ) : (
        <>
          <h2>Game Over! Here are your results:</h2>
          {selectedBingoItems.map(item => (
            <div key={item.bingoItem}>
              {item.bingoItem}: {guesses[item.bingoItem] ? `${guesses[item.bingoItem].song} - ${guesses[item.bingoItem].isCorrect ? 'Correct' : 'Incorrect'}` : 'Skipped'}
            </div>
          ))}
          <button onClick={initializeGame}>Play Again</button>
        </>
      )}
    </div>
  );
}

export default App;
