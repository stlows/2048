let fontSizesClass = ["bigger", "big", "normal", "small", "smaller"];

let score = 0;
let odds2 = 0.9;
let defaultBorderColor = "black";

function createEmptyTiles(n) {
  let tiles = [];
  for (let i = 0; i < Math.pow(n, 2); i++) {
    let x = i % 4;
    let y = Math.floor(i / 4);
    tiles.push({
      x: x,
      y: y,
      value: Math.pow(2, i + 1) // */ null
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
  let emptyTiles = getEmptyTiles(tiles);
  if (emptyTiles.length === 0) {
    gameOver();
    return null;
  }
  let r = randomElement(emptyTiles);
  if (Math.random() < odds2) {
    r.value = 2;
  } else {
    r.value = 4;
  }
  updateBoard();
}

function gameOver() {
  let board = document.getElementById("game-board");
  let overlap = document.createElement("div");
  overlap.innerHTML = "Yeah!";
  board.appendChild(overlap);
}

function move(e) {
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
  tiles = createEmptyTiles(4);
  addNewTile();
  addNewTile();
  updateBoard();
}

//newGame();

// let tiles = [{ x: 0, y: 0, value: null }, { x: 1, y: 0, value: 4 }, { x: 2, y: 0, value: 2 }, { x: 3, y: 0, value: 2 }];
// console.log(tiles.map(x => x.value));
// crush(tiles);
// shift(tiles);
// crush(tiles);
// console.log(tiles.map(x => x.value));

// console.log("----");
// tiles = [{ x: 0, y: 0, value: null }, { x: 1, y: 0, value: null }, { x: 2, y: 0, value: null }, { x: 3, y: 0, value: null }];
// console.log(tiles.map(x => x.value));
// crush(tiles);
// shift(tiles);
// crush(tiles);
// console.log(tiles.map(x => x.value));

// console.log("----");
// tiles = [{ x: 0, y: 0, value: 2 }, { x: 1, y: 0, value: 2 }, { x: 2, y: 0, value: 2 }, { x: 3, y: 0, value: 2 }];
// console.log(tiles.map(x => x.value));
// crush(tiles);
// shift(tiles);
// crush(tiles);
// console.log(tiles.map(x => x.value));

// console.log("----");
// tiles = [{ x: 0, y: 0, value: 2 }, { x: 1, y: 0, value: null }, { x: 2, y: 0, value: 2 }, { x: 3, y: 0, value: 2 }];
// console.log(tiles.map(x => x.value));
// crush(tiles);
// shift(tiles);
// crush(tiles);
// console.log(tiles.map(x => x.value));

// console.log("----");
// tiles = [{ x: 0, y: 0, value: 2 }, { x: 1, y: 0, value: null }, { x: 2, y: 0, value: 2 }, { x: 3, y: 0, value: 2 }];
// console.log(tiles.map(x => x.value));
// crush(tiles);
// shift(tiles);
// crush(tiles);
// console.log(tiles.map(x => x.value));
