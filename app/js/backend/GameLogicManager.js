var GameLogicManager = function () {
    this.renderGridOld = [];// what was rendered last update loop
    this.renderGrid = [];   // what gets displayed
    this.battleGrid = [];   // friend and foe interactions
    this.defenseGrid = [];  // defense towers only
    this.ghostGrid = [];    // ghost only
    this.factionGrid = [];  // only friend and enemy zone; STATIC

    this.timer = null;
    this.level = null;
    this.canvas = null;

    this.paused = true; // game logic starts paused

    var gridHeight; //TODO: how to initialize grids?
    var gridWidth;

    // cell types
    var BLANK = -2;
    var VOID = -1;
    var FRIEND_ZONE = 0;
    var ENEMY_ZONE = 1;

    // cell types
    var BLANK = -2;
    var VOID = -1;
    var FRIEND_ZONE = 0;
    var ENEMY_ZONE = 1;
    var FRIEND = 2;
    var OBJECTIVE = 3;
    var ENEMY = 4;
    var GHOST = 5;

    // cell colors
    var FRIEND_ZONE_COLOR = 0xffffff;
    var ENEMY_ZONE_COLOR = 0x696969;
    var FRIEND_COLOR = 0xc9a0dc;
    var OBJECTIVE_COLOR = 0x773795;
    var ENEMY_COLOR = 0x94b21c;
    var GHOST_COLOR = 0xa0d1dc;

    // cell location types
    var TOP_LEFT = 0;
    var TOP_RIGHT = 1;
    var BOTTOM_LEFT = 2;
    var BOTTOM_RIGHT = 3;
    var TOP = 4;
    var BOTTOM = 5;
    var LEFT = 6;
    var RIGHT = 7;
    var CENTER = 8;

    // don't call DOM things here, it won't work since constructors are called
    // before page loads
    //
    // do it in each screen's init() method
    //var canvas = new PixiCanvas($('#gameplay-canvas'), 'medium');

    var cellLookup;
    var allowedShapes;
}

/*
 * This function returns a JavaScript object, which is kind of like
 * a C struct in that it only has data. There are 9 different types of
 * cells in the grid, and so we use 9 CellType objects to store which
 * adjacent cells need to be checked when running the simulation.
 */
function CellType(initNumNeighbors, initCellValues) {
    this.numNeighbors = initNumNeighbors;
    this.cellValues = initCellValues;
}

/*
 * This function initizlies the 9 CellType objects that serve
 * as a lookup table for when we are running the simulation so
 * that we know which neighboring cells have to be examined for
 * determining the next frame's state for a given cell.
 */
GameLogicManager.prototype.initCellLookup = function()
{
    // WE'LL PUT ALL THE VALUES IN HERE
    cellLookup = new Array();

    // TOP LEFT
    var topLeftArray        = new Array( 1, 0,  1,  1,  0,  1);
    cellLookup[TOP_LEFT]    = new CellType(3, topLeftArray);

    // TOP RIGHT
    var topRightArray       = new Array(-1, 0, -1,  1,  0,  1);
    cellLookup[TOP_RIGHT]   = new CellType(3, topRightArray);

    // BOTTOM LEFT
    var bottomLeftArray     = new Array( 1, 0,  1, -1, 0, -1);
    cellLookup[BOTTOM_LEFT] = new CellType(3, bottomLeftArray);

    // BOTTOM RIGHT
    var bottomRightArray    = new Array(-1, 0, -1, -1, 0, -1);
    cellLookup[BOTTOM_RIGHT]= new CellType(3, bottomRightArray);

    // TOP
    var topArray            = new Array(-1, 0, -1, 1, 0, 1, 1, 1, 1, 0);
    cellLookup[TOP]         = new CellType(5, topArray);

    // BOTTOM
    var bottomArray         = new Array(-1, 0, -1, -1, 0, -1, 1, -1, 1, 0);
    cellLookup[BOTTOM]      = new CellType(5, bottomArray);

    // LEFT
    var leftArray           = new Array(0, -1, 1, -1, 1, 0, 1, 1, 0, 1);
    cellLookup[LEFT]        = new CellType(5, leftArray);

    // RIGHT
    var rightArray          = new Array(0, -1, -1, -1, -1, 0, -1, 1, 0, 1);
    cellLookup[RIGHT]       = new CellType(5, rightArray);

    // CENTER
    var centerArray         = new Array(-1, -1, -1, 0, -1, 1, 0, 1, 1, 1, 1, 0, 1, -1, 0, -1);
    cellLookup[CENTER]      = new CellType(8, centerArray);
}

// Initialize all shapes and fill the menu.
GameLogicManager.prototype.initShapes = function() {
    allowedShapes = this.level.allowedShapes;
}

/**
 * Set the level and canvas being played
 *
 * Places defense structures onto the grid
 * @param {Level} level Level object
 * @param {PixiCanvas} canvas Canvas being used to render level
 */
GameLogicManager.prototype.setLevel = function (level, canvas) {
    this.level = level;
    this.canvas = canvas;
}

/**
 * Starts the gameplay
 *
 * Starts timer
 */
GameLogicManager.prototype.start = function () {
    if (!this.level || !this.canvas)
        throw "Level and/or canvas not set! Game logic cannot start.";

    // decrease timer by 1 per second
    setInterval(function () {
        this.timer--;
    }.bind(this), 1000);
}

GameLogicManager.prototype.updateLoop = function() {
    // check time; end game if zero

    for (var i = 0; i < gridHeight; i++)
    {
        for (var j = 0; j < gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * gridWidth) + j;
            var battleCell = battleGrid[index];
            var defenseCell = defenseGrid[index];
            var ghostCell = ghostGrid[index];

            // CASES
            switch(battleCell) {
                case BLANK:
                    // decide if to reproduce
                    var neighbors = calcNumNeighbors(i, j);
                    break;
                case FRIEND:
                    // decide if to die
                    var neighbors = calcNumNeighbors(i, j);
                    break;
                case ENEMY:
                    // decide if to die
                    var neighbors = calcNumNeighbors(i, j);
                    break;
                default:
                    // nothing
                    break;
            }
            switch(defenseCell) {
                case OBJECTIVE:
                    if(battleCell === ENEMY)
                        defenseGrid[index] = BLANK;
                    break;
                default:
                    // nothing
                    break;
            }

            battleCell = battleGrid[index];
            defenseCell = defenseGrid[index];
            if(ghostCell !== -2)
                renderGrid[index] = GHOST;
            else if(battleCell !== -2)
                renderGrid[index] = battleCell;
            else if(defenseCell !== -2)
                renderGrid[index] = defenseCell;
            else
                renderGrid[index] = factionGrid[index];
        }
    }
}

GameLogicManager.prototype.updateGrid = function() {
    // go through all the boxes in render grid
    // compare to old render grid
    // call pixi only if new render grid is different from old
    // switch old render grid to new
}

GameLogicManager.prototype.reproduce = function() {

}

GameLogicManager.prototype.calcNumNeighbors = function(row, col) {
    var numEnemies = 0;
    var numFriends = 0;

    // DEPENDING ON THE TYPE OF CELL IT IS WE'LL CHECK
    // DIFFERENT ADJACENT CELLS
    var cellType = determineCellType(row, col);
    var cellsToCheck = cellLookup[cellType];
    for(var counter = 0; counter < (cellsToCheck.numNeighbors * 2); counter+=2)
        {
            var neighborCol = col + cellsToCheck.cellValues[counter];
            var neighborRow = row + cellsToCheck.cellValues[counter+1];
            var index = (neighborRow * gridWidth) + neighborCol;
            var neighborValue = updateGrid[index];
            // MODIFIED TO ACCOUNT FOR NEW CELL VALUES
            if(neighborValue === FRIEND)
            {
                numFriends += 1;
            }
            else if(neighborValue === ENEMY)
            {
                numEnemies += 1;
            }
        }
    return {
        "friends" : numFriends,
        "enemies" : numEnemies
    };
}

GameLogicManager.prototype.placeShape = function(shape) {

}

GameLogicManager.prototype.isValidCell = function() {
    // IS IT OUTSIDE THE GRID?
    if (    (row < 0) ||
            (col < 0) ||
            (row >= gridHeight) ||
            (col >= gridWidth))
    {
        return false;
    }
    // IT'S INSIDE THE GRID
    else
    {
        return true;
    }
}

GameLogicManager.prototype.getRelativeCoords = function() {

}

GameLogicManager.prototype.pause = function() {
    this.pause = true;
}

GameLogicManager.prototype.resume = function() {
    this.pause = false;
}

GameLogicManager.prototype.reset = function() {
    // RESET ALL THE DATA STRUCTURES TOO
    battleGrid = new Array();
    renderGrid = new Array();
    defenseGrid = new Array();
    ghostGrid = new Array();

    // INIT THE CELLS IN THE GRID
    for (var i = 0; i < gridHeight; i++)
        {
            for (var j = 0; j < gridWidth; j++)
                {
                    setGridCell(battleGrid, i, j, this.level.grid[i][j]);
                    setGridCell(renderGrid, i, j, this.level.grid[i][j]);
                }
        }

    // RENDER THE CLEARED SCREEN
    renderGame();
}

/*
 * Accessor method for getting the cell value in the grid at
 * location (row, col).
 */
GameLogicManager.prototype.getGridCell = function(grid, row, col) {
    // IGNORE IF IT'S OUTSIDE THE GRID
    if (!isValidCell(row, col))
        {
            return -1;
        }
    var index = (row * gridWidth) + col;
    return grid[index];
}

/*
 * Mutator method for setting the cell value in the grid at
 * location (row, col).
 */
GameLogicManager.prototype.setGridCell = function(grid, row, col, value) {
    // IGNORE IF IT'S OUTSIDE THE GRID
    if (!isValidCell(row, col))
    {
        return;
    }
    var index = (row * gridWidth) + col;
    grid[index] = value;
}

/*
 * A cell's type determines which adjacent cells need to be tested
 * during each frame of the simulation. This method tests the cell
 * at (row, col), and returns the constant representing which of
 * the 9 different types of cells it is.
 */
GameLogicManager.prototype.determineCellType = function(row, col) {
    if ((row === 0) && (col === 0))                                 return TOP_LEFT;
    else if ((row === 0) && (col === (gridWidth-1)))                return TOP_RIGHT;
    else if ((row === (gridHeight-1)) && (col === 0))               return BOTTOM_LEFT;
    else if ((row === (gridHeight-1)) && (col === (gridHeight-1)))  return BOTTOM_RIGHT;
    else if (row === 0)                                             return TOP;
    else if (col === 0)                                             return LEFT;
    else if (row === (gridHeight-1))                                return RIGHT;
    else if (col === (gridWidth-1))                                 return BOTTOM;
    else                                                            return CENTER;
}

module.exports = GameLogicManager;
