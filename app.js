let fontSizesClass = ["bigger", "big", "normal", "small", "smaller"];

let score = 0;
let odds2 = 0.9;
let defaultBorderColor = "black";
let gridSize = 4;
let goal = 2048;
let alreadyWon = false;
let tileSize = 100;
let tileSizeSmallFactor = 0.5;
let smallScreen = 700;

function generateSpecialCss() {
  let styleSheet = document.createElement("style");
  let customCss = document.getElementById("custom-css");
  if (customCss) {
    customCss.parentElement.removeChild(customCss);
  }
  let gridGap = Math.floor(20 / gridSize);
  let gameBoardWidth = tileSize * gridSize + gridGap * (gridSize + 1);
  let gameBoardWidthSmall = tileSize * gridSize * tileSizeSmallFactor + gridGap * (gridSize + 1);
  styleSheet.id = "custom-css";
  styleSheet.innerHTML = `
    #game-board {
      width: ${gameBoardWidth}px;
      grid-template-columns: repeat(${gridSize}, 1fr);
      grid-gap: ${gridGap}px;
      border: ${gridGap}px solid #333;
    }
    #game-board .tile {
      width: ${tileSize}px;
      height: ${tileSize}px;
    }
    #game-board .tile .number {
      line-height: ${tileSize}px;
    }
    #game-board .tile .number.bigger{
      font-size: ${0.8 * tileSize}px;
    }
    #game-board .tile .number.big{
      font-size: ${0.8 * tileSize}px;
    }
    #game-board .tile .number.normal{
      font-size: ${0.6 * tileSize}px;
    }
    #game-board .tile .number.small{
      font-size: ${0.4 * tileSize}px;
    }
    #game-board .tile .number.smaller{
      font-size: ${0.35 * tileSize}px;
    }
    @media screen and (max-width: ${smallScreen}px){
      #game-board{
        width: ${gameBoardWidthSmall}px;
      }
      #game-board .tile{
        width: ${tileSize * tileSizeSmallFactor}px;
        height: ${tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number{
        line-height: ${tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number.bigger{
        font-size: ${0.8 * tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number.big{
        font-size: ${0.8 * tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number.normal{
        font-size: ${0.6 * tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number.small{
        font-size: ${0.4 * tileSize * tileSizeSmallFactor}px;
      }
      #game-board .tile .number.smaller{
        font-size: ${0.35 * tileSize * tileSizeSmallFactor}px;
      }
    }`;

  document.body.appendChild(styleSheet);
}

function createEmptyTiles() {
  let tiles = [];
  for (let i = 0; i < Math.pow(gridSize, 2); i++) {
    let x = i % gridSize;
    let y = Math.floor(i / gridSize);
    tiles.push({
      x: x,
      y: y,
      value: null
    });
  }
  return tiles;
}

function getEmptyTiles() {
  return tiles.filter(t => !t.value);
}

function flashBoardBorder(color, times, interval) {
  let board = document.getElementById("game-board");
  let count = 1;
  let flashId = setInterval(function() {
    if (board.style.borderColor === defaultBorderColor) {
      board.style.borderColor = color;
    } else {
      board.style.borderColor = defaultBorderColor;
    }

    if (count++ === times * 2) {
      clearInterval(flashId);
      board.style.borderColor = defaultBorderColor;
    }
  }, interval);
  board.style.borderColor = color;
}

function updateBoard() {
  let board = document.getElementById("game-board");
  board.innerHTML = "";
  for (let i = 0; i < tiles.length; i++) {
    let tile = getTileDOMObject(tiles[i]);
    board.appendChild(tile);
  }

  let scoreDOM = document.getElementById("score-value");
  scoreDOM.innerHTML = score;
}

function getTileDOMObject(tile) {
  let tileDiv = document.createElement("div");
  tileDiv.classList.add("tile");
  tileDiv.id = "tile-" + tile.x + "-" + tile.y;
  if (tile.value) {
    let numDiv = document.createElement("div");
    numDiv.classList.add("number");
    let power = Math.log(tile.value) / Math.log(2);
    let numLen = tile.value.toString().length;
    numDiv.classList.add("power" + power);
    numDiv.classList.add(fontSizesClass[numLen - 1]);
    numDiv.innerHTML = tile.value;
    tileDiv.appendChild(numDiv);
  }
  return tileDiv;
}

function addNewTile() {
  let emptyTiles = getEmptyTiles();
  let r = randomElement(emptyTiles);
  if (Math.random() < odds2) {
    r.value = 2;
  } else {
    r.value = 4;
  }

  updateBoard();

  if (noPossibleMove()) {
    gameOver();
    return null;
  }
}

function noPossibleMove() {
  if (tiles.some(t => t.value === null)) {
    return false;
  }
  for (let i = 0; i < tiles.length; i++) {
    let neighbors = getNeighbors(tiles[i]);
    console.log(neighbors);
    if (neighbors.some(t => t.value === tiles[i].value)) {
      return false;
    }
  }
  return true;
}

function getNeighbors(tile) {
  let result = [];
  if (tile.y > 0) {
    result.push(getTile(tile.x, tile.y - 1));
  }
  if (tile.x > 0) {
    result.push(getTile(tile.x - 1, tile.y));
  }
  if (tile.y < Math.sqrt(tiles.length) - 1) {
    result.push(getTile(tile.x, tile.y + 1));
  }
  if (tile.x < Math.sqrt(tiles.length) - 1) {
    result.push(getTile(tile.x + 1, tile.y));
  }
  return result;
}

function getTile(x, y) {
  return tiles.find(t => t.x === x && t.y === y);
}

function gameOver() {
  popup("You lost...<br>You scored " + score + " points.");
}

function popup(msg) {
  let board = document.getElementById("game-board");
  let currentPopup = document.getElementById("popup");
  if (currentPopup) {
    currentPopup.parentElement.removeChild(currentPopup);
  }
  let overlap = document.createElement("div");
  overlap.classList.add("overlap");
  overlap.id = "popup";
  let overlapContent = document.createElement("div");
  overlapContent.classList.add("overlap-content");
  overlap.appendChild(overlapContent);
  overlapContent.innerHTML = msg + "<p>Press any arrow to continue.</p>";
  board.appendChild(overlap);
}

function move(e) {
  if (noPossibleMove()) {
    newGame();
    return;
  }
  let validMove = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].some(s => s === e.key);
  let somethingMoved = false;
  if (validMove) {
    for (let i = 0; i < Math.sqrt(tiles.length); i++) {
      let row = getRow(e.key, i);
      let rowCopy = getRowCopy(row);
      moveRow(row);
      somethingMoved = somethingMoved || !isSameTiles(row, rowCopy);
    }
    if (somethingMoved) {
      updateBoard();
      addNewTile();
      if (tiles.some(t => t.value === goal) && !alreadyWon) {
        popup("<p>You won !</p>");
        alreadyWon = true;
      }
    } else {
      flashBoardBorder("red", 3, 70);
    }
  }
}

function getRowCopy(row) {
  let result = [];
  for (let i = 0; i < row.length; i++) {
    result.push({
      x: row[i].x,
      y: row[i].y,
      value: row[i].value
    });
  }
  return result;
}

function isSameTiles(tiles1, tiles2) {
  if (tiles1.length !== tiles2.length) {
    return false;
  }
  for (let i = 0; i < tiles1.length; i++) {
    if (!isSameTile(tiles1[i], tiles2[i])) {
      return false;
    }
  }
  return true;
}

function isSameTile(tile1, tile2) {
  return tile1.x === tile2.x && tile1.y === tile2.y && tile1.value === tile2.value;
}

function getRow(key, i) {
  let toReturn = [];

  if (key === "ArrowLeft" || key === "ArrowRight") {
    toReturn = tiles.filter(t => t.y === i);
  } else if (key === "ArrowUp" || key === "ArrowDown") {
    toReturn = tiles.filter(t => t.x === i);
  }

  if (key === "ArrowRight" || key === "ArrowDown") {
    toReturn.reverse();
  }

  return toReturn;
}

function moveRow(tiles) {
  crush(tiles);
  shift(tiles);
  crush(tiles);
}

function fusionTiles(tile1, tile2, targetTile) {
  if (tile1.value && tile1.value === tile2.value) {
    let sum = tile1.value * 2;
    tile1.value = null;
    tile2.value = null;
    targetTile.value = sum;
    score += sum;
  }
}

function moveTile(tile, targetTile) {
  if (targetTile === tile) {
    return;
  }
  targetTile.value = tile.value;
  tile.value = null;
}

function crush(tiles) {
  let t = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].value) {
      moveTile(tiles[i], tiles[t]);
      t++;
    }
  }
}

function shift(tiles) {
  let i = 0;
  while (i < tiles.length - 1 && tiles[i].value) {
    if (tiles[i].value === tiles[i + 1].value) {
      fusionTiles(tiles[i], tiles[i + 1], tiles[i]);
      i += 2;
    } else {
      i++;
    }
  }
}

function randomElement(a) {
  var randomIndex = Math.floor(Math.random() * a.length);

  return a[randomIndex];
}

function newGame() {
  generateSpecialCss();
  tiles = createEmptyTiles(gridSize);
  score = 0;
  addNewTile();
  addNewTile();
  updateBoard();
}
function btnChangeSize() {
  popup(
    "<p>Enter size (2 and 8):</p><input type='number' id='newGridSize' value='4' min='2' max='8' /><br><button onclick='changeSize()' class='btn'>Go</button>"
  );
}
function changeSize() {
  let newGridSize = document.getElementById("newGridSize").value;
  if ([2, 3, 4, 5, 6, 7, 8].every(i => i !== newGridSize)) {
    popup("Incorect size.<br>Try again...");
    return;
  }
  gridSize = parseInt(newGridSize);
  newGame();
}

function saveGame() {
  let encodedPowers = tiles.map(t => (t.value ? (Math.log(t.value) / Math.log(2)).toString(16) : 0)).join("");
  popup("<p>Copy this code and load a game using it later:</p><p class='code'>" + encodedPowers + "</p><p>Score will be lost.</p>");
}

function btnLoadGame() {
  popup("<p>Enter code:</p><input type='text' id='encodedPowers' /><br><button onclick='loadGame()' class='btn'>Go</button>");
}

function loadGame() {
  let encodedPowers = document.getElementById("encodedPowers").value;
  if ([4, 9, 16, 25, 36, 49, 64].every(i => i !== encodedPowers.length)) {
    popup("Incorect code.<br>Try again...");
    return;
  }
  let newTiles = encodedPowers.split("").map(s => (s === "0" ? null : Math.pow(2, parseInt(s, 16))));
  tiles = createEmptyTiles(gridSize);
  score = 0;
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].value = newTiles[i];
  }
  updateBoard();
}
