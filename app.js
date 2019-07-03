let colors = [
  "#f2f2f2",
  "#ede9d3",
  "#e3dbb1",
  "#e3cfb1",
  "#dbb8a7",
  "#d6a1ae",
  "#d194ca",
  "#b394d1",
  "#8881d6",
  "#7eb1d9",
  "#7bdbdb",
  "#73d196",
  "#74c767",
  "#9aba63",
  "#aec24c",
  "#c9c120"
];
let fontSizes = [80, 80, 60, 40, 35];

function getEmptyTiles(n) {
  let tiles = [];
  for (let i = 1; i <= Math.pow(n, 2); i++) {
    tiles.push({
      x: Math.floor(i / 4),
      y: i % 4,
      value: Math.pow(2, i)
    });
  }
  return tiles;
}

function update_board(tiles) {
  let board = document.getElementById("game-board");
  board.innerHTML = "";
  for (let i = 0; i < tiles.length; i++) {
    let tile = getTileDOMObject(tiles[i]);
    board.appendChild(tile);
  }
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
    numDiv.style.backgroundColor = colors[power - 1];
    numDiv.style.fontSize = fontSizes[numLen - 1] + "px";
    numDiv.innerHTML = tile.value;
    tileDiv.appendChild(numDiv);
  }
  return tileDiv;
}

function get_tile(tiles, x, y) {
  return tiles.find(t => t.x === x && t.y === y);
}

let tiles = getEmptyTiles(4);
update_board(tiles);
console.log(tiles);
