const data = require("./outputData");

function getRandomElements(arr, n) {
  let result = [];
  let len = arr.length;
  let taken = new Array(len);
  if (n > len) {
    console.warn(
      `Warning: Requested ${n} elements, but only ${len} available.`
    );
    n = len; // Adjust n to the length of the array to avoid errors
  }
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function createBingoGame(data) {
  if (data.length < 4) {
    console.error(
      "Error: Not enough bingo items to select 4. Check your data."
    );
    return;
  }

  const selectedBingoItems = getRandomElements(data, 4);
  let selectedMusics = new Set();

  selectedBingoItems.forEach((item) => {
    const numMusicsToSelect = item.listOfMusics.length >= 1 ? 1 : 0; // Select 1 if at least 1 music is available
    const musics = getRandomElements(item.listOfMusics, numMusicsToSelect);
    musics.forEach((music) => selectedMusics.add(music));
  });

  const allMusics = data.reduce((acc, item) => {
    item.listOfMusics.forEach((music) => acc.add(music));
    return acc;
  }, new Set());

  while (selectedMusics.size < 15 && allMusics.size > selectedMusics.size) {
    const remainingMusics = Array.from(allMusics).filter(
      (music) => !selectedMusics.has(music)
    );
    selectedMusics.add(getRandomElements(remainingMusics, 1)[0]);
  }

  // Shuffle the selected musics before output
  const shuffledSelectedMusics = shuffleArray(Array.from(selectedMusics));

  console.log(
    "Selected Bingo Items:",
    selectedBingoItems.map((item) => item.bingoItem)
  );
  console.log("Selected Musics:", shuffledSelectedMusics);
}

createBingoGame(data);
