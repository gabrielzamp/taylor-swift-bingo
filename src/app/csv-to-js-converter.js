const fs = require("fs");
const path = require("path");

// Path to the CSV file and the output JS file
const csvFilePath = path.join(__dirname, "data.csv");
const outputJsFilePath = path.join(__dirname, "outputData.js");

// Custom parsing function to handle commas within quotes
function parseCsvLine(line) {
  const result = [];
  let currValue = "";
  let inQuotes = false;
  for (let char of line) {
    if (char === '"' && inQuotes) {
      inQuotes = false;
    } else if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === "," && !inQuotes) {
      result.push(currValue.trim());
      currValue = "";
    } else {
      currValue += char;
    }
  }
  result.push(currValue.trim()); // Push the last value
  return result;
}

function csvToJson(filePath) {
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  const lines = data.split("\n").filter((line) => line.trim()); // Exclude empty lines
  const result = lines.slice(1).map((line) => {
    const parsedLine = parseCsvLine(line);
    const bingoItem = parsedLine[0];
    const type = parsedLine[1];
    const musics = parsedLine[2]
      ? parsedLine[2]
          .split(",")
          .map((music) => music.trim().replace(/^"|"$/g, ""))
      : [];
    return {
      bingoItem,
      type,
      listOfMusics: musics,
    };
  });
  return result;
}

const jsonObjects = csvToJson(csvFilePath);

// Prepare the JS file content with the array of objects
const jsContent = `const data = ${JSON.stringify(
  jsonObjects,
  null,
  2
)};\n\nmodule.exports = data;`;

// Write the JS content to file
fs.writeFileSync(outputJsFilePath, jsContent, "utf-8");

console.log(
  `CSV has been converted to JS objects and saved to ${outputJsFilePath}`
);
