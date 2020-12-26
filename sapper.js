function fillField() {
    sizeY = grid.length;
    sizeX = grid[0].length;
    let field = document.getElementById('field');
    field.style.gridTemplate = `repeat(${sizeY}, 1fr) / repeat(${sizeX}, 1fr)`;
    field.style.width = `${sizeX * 22}px`;
    field.style.height = `${sizeY * 22}px`;
    for (let j = 0; j < sizeY; j++) {
        for (let i = 0; i < sizeX; i++) {
            field.appendChild(createCell(i, j));
        }
    }
}

function createCell(x, y) {
    let cell = document.createElement('button');
    cell.className = 'cell';
    cell.id = `cell-${y}-${x}`;
    cell.addEventListener('click', () => openCell(x, y, cell))
    cell.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        flagCell(x, y, cell);
        return false;
    }, false);
    return cell;
}

function openCell(x, y, cell = document.getElementById(`cell-${y}-${x}`)) {
    if (y >= grid.length || y < 0 || x >= grid[0].length || x < 0) { return; }
    let val = grid[y][x];
    if (cell.classList.contains('opened')) { return; }
    if (val == 'b') { cell.style.backgroundColor = 'red'; }
    else {
        cell.classList.add('opened');
        if (val != '0') { cell.innerHTML = val; }
        else {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i == 0 && j == 0) { continue; }
                    openCell(x + i, y + j);
                }
            }
        }
    }
}

function flagCell(x, y, cell = document.getElementById(`cell-${y}-${x}`)) {
    if (y >= grid.length || y < 0 || x >= grid[0].length || x < 0) { return; }
    cell.classList.contains('flag') ? cell.classList.remove('flag') : cell.classList.add('flag');
}

function fillGrid(sizeX, sizeY, bombsAmount = 0) {
    grid = [];
    fillWithZeros(grid, sizeX, sizeY);
    fillWithBombs(grid, bombsAmount);
}

function fillWithZeros(grid, sizeX, sizeY) {
    for (let j = 0; j < sizeY; j++) {
        let row = [];
        for (let i = 0; i < sizeX; i++) {
            row.push('0');
        }
        grid.push(row);
    }
}

function fillWithBombs(grid, bombsAmount) {
    let count = 0;
    while (count < bombsAmount) {
        let x = getRandomInt(0, grid[0].length);
        let y = getRandomInt(0, grid.length);
        if (grid[y][x] == 'b') { continue }
        grid[y][x] = 'b';
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i == 0 && j == 0) { continue; }
                if (y + i >= grid.length || y + i < 0 || x + j >= grid[0].length || x + j < 0) { continue; }
                if (grid[y + i][x + j] == 'b') { continue; }
                grid[y + i][x + j] = (parseInt(grid[y + i][x + j]) + 1).toString();
            }
        }
        count++;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function setupControls() {
    document.getElementById('cell-0-0').classList.add('selected');
    document.addEventListener('keypress', (event) => {
        lastCoords = { x: selected.x, y: selected.y };
        console.log(event.key);
        switch (event.key) {
            case 's':
                if (selected.y + 1 < grid.length) { selected.y++; }
                break;
            case 'w':
                if (selected.y - 1 >= 0) { selected.y--; }
                break;
            case 'd':
                if (selected.x + 1 < grid[0].length) { selected.x++; }
                break;
            case 'a':
                if (selected.x - 1 >= 0) { selected.x--; }
                break;
            case 'Enter':
                openCell(selected.x, selected.y);
                break;
            case ' ':
                flagCell(selected.x, selected.y);
                break;
        }
        newCoords = { x: selected.x, y: selected.y };
        if (lastCoords.x != newCoords.x || lastCoords.y != newCoords.y) {
            document.getElementById(`cell-${lastCoords.y}-${lastCoords.x}`).classList.remove('selected');
            document.getElementById(`cell-${newCoords.y}-${newCoords.x}`).classList.add('selected');
        }
    });
}

var grid = [['0', '0', '0'], ['0', '1', '1'], ['0', '1', 'b']];
var selected = { x: 0, y: 0 };

(function start() {
    let size = prompt("size (from 5 to 50)", '20');
    // todo: add check
    let difficulty = prompt("difficulty (from 0 to 10)", '5');
    difficulty = Math.pow(2, (difficulty / 5)) / 10;
    fillGrid(size, size, size * size * difficulty);
    fillField();
    setupControls();
})();

// 0 - 0.1
// 5 - 0.2
// 10 - 0.4

// f(x) = 2^(x/5)/10

// 0 1 2

// 10 - 20
// 20 - 80
// 30 - 200
// 40 - 
// 50 - 400
//