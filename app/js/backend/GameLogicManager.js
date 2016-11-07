var GameLogicManager = function(level) {
    this.renderGridOld = [];// what was rendered last update loop
    this.renderGrid = [];   // what gets displayed
    this.battleGrid = [];   // friend and foe interactions
    this.defenseGrid = [];  // defense towers only
    this.ghostGrid = [];    // ghost only
    this.factionGrid = [];  // only friend and enemy zone; STATIC

    this.timer = null;
    this.level = null;
    this.canvas = null;
    this.currentUnit = null;

    this.paused = true; // game logic starts paused

    this.gridHeight; //TODO: how to initialize grids?
    this.gridWidth;

    // cell types
    this.BLANK = 0;
    this.VOID = 1;
    this.FRIEND_ZONE = 2;
    this.ENEMY_ZONE = 3;
    this.FRIEND = 4;
    this.OBJECTIVE = 5;
    this.ENEMY = 6;
    this.GHOST = 7;

    // cell colors
    var FRIEND_ZONE_COLOR = 0xffffff;
    var ENEMY_ZONE_COLOR = 0x696969;
    var FRIEND_COLOR = 0xc9a0dc;
    var OBJECTIVE_COLOR = 0x773795;
    var ENEMY_COLOR = 0x94b21c;
    var GHOST_COLOR = 0xa0d1dc;
    this.colors = [null, null, FRIEND_ZONE_COLOR, ENEMY_ZONE_COLOR,
                   FRIEND_COLOR, OBJECTIVE_COLOR, ENEMY_COLOR, GHOST_COLOR];

    // cell location types
    this.TOP_LEFT = 0;
    this.TOP_RIGHT = 1;
    this.BOTTOM_LEFT = 2;
    this.BOTTOM_RIGHT = 3;
    this.TOP = 4;
    this.BOTTOM = 5;
    this.LEFT = 6;
    this.RIGHT = 7;
    this.CENTER = 8;

    // don't call DOM things here, it won't work since constructors are called
    // before page loads
    //
    // do it in each screen's init() method
    //this.canvas = new PixiCanvas($('#gameplay-canvas'), 'medium');

    this.cellLookup;
    this.allowedShapes;
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
    this.topLeftArray           = new Array( 1, 0,  1,  1,  0,  1);
    cellLookup[this.TOP_LEFT]   = new CellType(3, this.topLeftArray);

    // TOP RIGHT
    this.topRightArray           = new Array(-1, 0, -1,  1,  0,  1);
    cellLookup[this.TOP_RIGHT]   = new CellType(3, this.topRightArray);

    // BOTTOM LEFT
    this.bottomLeftArray         = new Array( 1, 0,  1, -1, 0, -1);
    cellLookup[this.BOTTOM_LEFT] = new CellType(3, this.bottomLeftArray);

    // BOTTOM RIGHT
    this.bottomRightArray        = new Array(-1, 0, -1, -1, 0, -1);
    cellLookup[this.BOTTOM_RIGHT]= new CellType(3, this.bottomRightArray);

    // TOP
    this.topArray                = new Array(-1, 0, -1, 1, 0, 1, 1, 1, 1, 0);
    cellLookup[this.TOP]         = new CellType(5, this.topArray);

    // BOTTOM
    this.bottomArray             = new Array(-1, 0, -1, -1, 0, -1, 1, -1, 1, 0);
    cellLookup[this.BOTTOM]      = new CellType(5, this.bottomArray);

    // LEFT
    this.leftArray               = new Array(0, -1, 1, -1, 1, 0, 1, 1, 0, 1);
    cellLookup[this.LEFT]        = new CellType(5, this.leftArray);

    // RIGHT
    this.rightArray              = new Array(0, -1, -1, -1, -1, 0, -1, 1, 0, 1);
    cellLookup[this.RIGHT]       = new CellType(5, this.rightArray);

    // CENTER
    this.centerArray             = new Array(-1, -1, -1, 0, -1, 1, 0, 1, 1, 1, 1, 0, 1, -1, 0, -1);
    cellLookup[this.CENTER]      = new CellType(8, this.centerArray);
}

// Initialize all shapes and fill the menu.
GameLogicManager.prototype.initShapes = function() {
    this.allowedShapes = this.level.allowedShapes;
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
    // TODO check time; end game if zero

    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * this.gridWidth) + j;
            var battleCell = this.battleGrid[index];
            var defenseCell = this.defenseGrid[index];
            var ghostCell = this.ghostGrid[index];

            // CASES
            switch(battleCell) {
                case this.BLANK:
                    // decide if to reproduce
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.reproduce(index, neighbors);
                    break;
                case this.FRIEND:
                    // decide if to die
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.die(index, FRIEND, neighbors);
                    break;
                case this.ENEMY:
                    // decide if to die
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.die(index, ENEMY, neighbors);
                    break;
                default:
                    // nothing
                    break;
            }
            switch(defenseCell) {
                case this.OBJECTIVE:
                    if(battleCell === this.ENEMY)
                        this.defenseGrid[index] = this.BLANK;
                    break;
                default:
                    // nothing
                    break;
            }

            battleCell = this.battleGrid[index];
            defenseCell = this.defenseGrid[index];
            if(ghostCell !== -2)
                this.renderGrid[index] = this.GHOST;
            else if(battleCell !== -2)
                this.renderGrid[index] = battleCell;
            else if(defenseCell !== -2)
                this.renderGrid[index] = defenseCell;
            else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }
}

GameLogicManager.prototype.renderGrid = function() {
    // go through all the boxes in render grid
    // compare to old render grid
    // call pixi only if new render grid is different from old
    // switch old render grid to new

    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * this.gridWidth) + j;
            var renderCell = this.renderGrid[index];

            if(renderCell !== this.renderGridOld[index])
                canvas.setCell(j, i, this.colors[renderCell]);
        }
    }

    this.renderGridOld = this.renderGrid;
}

GameLogicManager.prototype.reproduce = function(index, neighbors) {
    var friends = neighbors["friends"];
    var enemies = neighbors["enemies"];
    var total = friends + enemies;
    if(total === 3) {
        var newType = this.BLANK;
        if(enemies > friends)
            newType = this.ENEMY;
        else
            newType = this.FRIEND;
        this.battleGrid[index] = newType;
    }
}

GameLogicManager.prototype.die = function(index, current, neighbors) {
    var total = neighbors["friends"] + neighbors["enemies"];
    if(total < 2 || total > 3) {
        this.battleGrid[index] = this.BLANK;
    }
    else {
        // currently do nothing; leave as is
        // potentially later change this to
        // get infected or cured based on majority
    }
}

GameLogicManager.prototype.calcNumNeighbors = function(row, col) {
    var numEnemies = 0;
    var numFriends = 0;

    // DEPENDING ON THE TYPE OF CELL IT IS WE'LL CHECK
    // DIFFERENT ADJACENT CELLS
    var cellType = this.determineCellType(row, col);
    var cellsToCheck = this.cellLookup[cellType];
    for(var counter = 0; counter < (cellsToCheck.numNeighbors * 2); counter+=2)
    {
        var neighborCol = col + cellsToCheck.cellValues[counter];
        var neighborRow = row + cellsToCheck.cellValues[counter+1];
        var index = (neighborRow * this.gridWidth) + neighborCol;
        var neighborValue = this.battleGrid[index];
        // MODIFIED TO ACCOUNT FOR NEW CELL VALUES
        if(neighborValue === this.FRIEND)
        {
            numFriends += 1;
        }
        else if(neighborValue === this.ENEMY)
        {
            numEnemies += 1;
        }
    }
    return {
        "friends" : numFriends,
        "enemies" : numEnemies
    };
}

GameLogicManager.prototype.placeShape = function(clickRow, clickCol, pixels, faction) {
    var zone = this.BLANK;
    if(faction === this.FRIEND || faction === this.OBJECTIVE)
        zone = this.FRIEND_ZONE;
    else if(faction === this.ENEMY)
        zone = this.ENEMY_ZONE;
    else
        zone = this.FRIEND_ZONE;

    for (var i = 0; i < pixels.length; i += 2)
    {
        var col = clickCol + pixels[i];
        var row = clickRow + pixels[i+1];
        // VERIFY THAT THIS CELL CAN BE PLACED ON
        if(this.getGridCell(this.factionGrid, row, col) === zone &&
           this.getGridCell(this.battleGrid, row, col) !== this.VOID)
        {
            this.setGridCell(this.battleGrid, row, col, faction);
            this.setGridCell(this.renderGrid, row, col, faction);
        }
    }

    this.renderGrid();
}

GameLogicManager.prototype.isValidCell = function() {
    // IS IT OUTSIDE THE GRID?
    if(    (row < 0) ||
            (col < 0) ||
            (row >= this.gridHeight) ||
            (col >= this.gridWidth))
    {
        return false;
    }
    // IT'S INSIDE THE GRID
    else
    {
        return true;
    }
}

GameLogicManager.prototype.pause = function() {
    this.pause = true;
}

GameLogicManager.prototype.resume = function() {
    this.pause = false;
}

GameLogicManager.prototype.reset = function() {
    // RESET ALL THE DATA STRUCTURES TOO
    this.battleGrid = new Array();
    this.renderGridOld =  new Array();
    this.renderGrid = new Array();
    this.defenseGrid = new Array();
    this.ghostGrid = new Array();
    this.factionGrid = new Array();

    this.paused = true;

    // INIT THE CELLS IN THE GRID
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            this.setGridCell(this.battleGrid, i, j, this.level.grid[i][j]);
            this.setGridCell(this.renderGrid, i, j, this.level.grid[i][j]);
        }
    }

    // RENDER THE CLEARED SCREEN
    this.renderGrid();
}

/*
 * Accessor method for getting the cell value in the grid at
 * location (row, col).
 */
GameLogicManager.prototype.getGridCell = function(grid, row, col) {
    // IGNORE IF IT'S OUTSIDE THE GRID
    if (!this.isValidCell(row, col))
    {
        return -1;
    }
    var index = (row * this.gridWidth) + col;
    return grid[index];
}

/*
 * Mutator method for setting the cell value in the grid at
 * location (row, col).
 */
GameLogicManager.prototype.setGridCell = function(grid, row, col, value) {
    // IGNORE IF IT'S OUTSIDE THE GRID
    if(!this.isValidCell(row, col))
    {
        return;
    }
    var index = (row * this.gridWidth) + col;
    grid[index] = value;
}

/*
 * A cell's type determines which adjacent cells need to be tested
 * during each frame of the simulation. This method tests the cell
 * at (row, col), and returns the constant representing which of
 * the 9 different types of cells it is.
 */
GameLogicManager.prototype.determineCellType = function(row, col) {
    if ((row === 0) && (col === 0))                                           return this.TOP_LEFT;
    else if ((row === 0) && (col === (this.gridWidth-1)))                     return this.TOP_RIGHT;
    else if ((row === (this.gridHeight-1)) && (col === 0))                    return this.BOTTOM_LEFT;
    else if ((row === (this.gridHeight-1)) && (col === (this.gridHeight-1)))  return this.BOTTOM_RIGHT;
    else if (row === 0)                                                       return this.TOP;
    else if (col === 0)                                                       return this.LEFT;
    else if (row === (this.gridHeight-1))                                     return this.RIGHT;
    else if (col === (this.gridWidth-1))                                      return this.BOTTOM;
    else                                                                      return this.CENTER;
}

module.exports = GameLogicManager;
