var GameLogicManager = function(level) {
    this.renderGrid = [];
    this.updateGrid = [];
    this.defenseGrid = [];
    this.ghostGrid = [];
    this.timer = undefined;
    this.level = level;

    // cell types
    var VOID = -1;
    var FRIEND_ZONE = 0;
    var ENEMY_ZONE = 1;
    var FRIEND = 2;
    var OBJECTIVE = 3;
    var ENEMY = 4;
    var GHOST = 5;

    // cell colors
    var FRIEND_ZONE_COLOR = "#ffffff";
    var ENEMY_ZONE_COLOR = "696969";
    var FRIEND_COLOR = "#c9a0dc";
    var OBJECTIVE_COLOR = "#773795";
    var ENEMY_COLOR = "#94b21c";
    var GHOST_COLOR = "A0D1DC";

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

    var canvas = new PixiCanvas($('#gameplay-canvas'), 'medium');

    var cellLookup;
    var allowedShapes;
}

/*
 * This function returns a JavaScript object, which is kind of like
 * a C struct in that it only has data. There are 9 different types of
 * cells in the grid, and so we use 9 CellType objects to store which
 * adjacent cells need to be checked when running the simulation.
 */
function CellType(initNumNeighbors, initCellValues)
{
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


GameLogicManager.prototype.start = function(level) {

}

GameLogicManager.prototype.updateLoop = function() {

}

GameLogicManager.prototype.updateGrid = function() {

}

GameLogicManager.prototype.reproduce = function() {

}

GameLogicManager.prototype.calcNumNeighbors = function(row, col) {

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

}

GameLogicManager.prototype.resume = function() {

}

GameLogicManager.prototype.reset = function() {
    // RESET ALL THE DATA STRUCTURES TOO
    updateGrid = new Array();
    renderGrid = new Array();
    defenseGrid = new Array();
    ghostGrid = new Array();
    
    // INIT THE CELLS IN THE GRID
    for (var i = 0; i < gridHeight; i++)
        {
            for (var j = 0; j < gridWidth; j++)
                {
                    setGridCell(updateGrid, i, j, this.level.grid[i][j]); 
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
