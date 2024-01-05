var rows = 4;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;

window.onload = function () {
    initializeBoard();
    initializePieces();
};

function initializeBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = createTile("blank.png");
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            document.getElementById("board").append(tile);
        }
    }
}

function initializePieces() {
    let pieces = [];
    for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString());
    }
    pieces.reverse();
    shuffleArray(pieces);

    for (let i = 0; i < pieces.length; i++) {
        let tile = createTile(pieces[i] + ".png");
        document.getElementById("pieces").append(tile);
    }
}

function createTile(src) {
    let tile = document.createElement("img");
    tile.src = src;
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("dragenter", dragEnter);
    tile.addEventListener("dragleave", dragLeave);
    tile.addEventListener("drop", dragDrop);
    tile.addEventListener("dragend", dragEnd);
    return tile;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    if (currTile !== this) {
        otherTile = this;
        dragEnd();
    }
}

function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }

    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;

    if (isGameCompleted()) {
        saveCompletionToMongoDB(turns);
        alert("Congratulations! You've completed the game in " + turns + " turns.");
    }
}

function isGameCompleted() {
    if (allTilesMatch()) {
        return true;
    }
    return false;
}

function allTilesMatch() {
    let boardTiles = document.getElementById("board").getElementsByTagName("img");
    for (let i = 0; i < boardTiles.length; i++) {
        if (!boardTiles[i].src.endsWith(i + 1 + ".png")) {
            return false;
        }
    }
    return true;
}

function saveCompletionToMongoDB(turns) {
    fetch("http://localhost:3000/saveCompletion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ turns }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error('Error in fetch:', error);
        });
}
