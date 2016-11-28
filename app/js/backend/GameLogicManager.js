'use strict';

/**
 * Construct a GameLogicManager object for the given level.
 * @param {Level} level Level object
 */
var GameLogicManager = function(level) {
    this.renderGridOld = [];// what was rendered last update loop
    this.renderGrid = [];   // what gets displayed
    this.battleGrid = [];   // friend and foe interactions
    this.battleGridNew = [];// updated battle grid
    this.defenseGrid = [];  // defense towers only
    this.ghostGrid = [];    // ghost only
    this.factionGrid = [];  // only friend and enemy zones; does not change

    this.level = null;      // level to manage logic for
    this.canvas = null;     // PixiCanvas object to render grid
    this.currentUnit = null;// unit currently selected on the menu
    this.defensesLeft = 0;  // number of defense cells remaining

    this.paused = true;     // game logic starts paused

    this.gridHeight;        // height of canvas (in cells)
    this.gridWidth;         // width of canvas (in cells)

    // game timers - IDs needed to stop timer later on
    this.gameLoopTimer = 0; // once per frame
    this.secondTimer = 0;   // once per second

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

    this.cellLookup;        // used to determine cell neighbors
    this.initCellLookup();
}

/**
 * This function returns a JavaScript object, which is kind of like
 * a C struct in that it only has data. There are 9 different types of
 * cells in the grid, and so we use 9 CellType objects to store which
 * adjacent cells need to be checked when running the simulation.
 * @param {int} initNumNeighbors number of neighbors
 * @param {int[]} which cells should be checked
 */
function CellType(initNumNeighbors, initCellValues) {
    this.numNeighbors = initNumNeighbors;
    this.cellValues = initCellValues;
}

/**
 * This function initizlies the 9 CellType objects that serve
 * as a lookup table for when we are running the simulation so
 * that we know which neighboring cells have to be examined for
 * determining the next frame's state for a given cell.
 */
GameLogicManager.prototype.initCellLookup = function()
{
    // WE'LL PUT ALL THE VALUES IN HERE
    this.cellLookup = new Array();

    // TOP LEFT
    this.topLeftArray                 = new Array( 1, 0,  1,  1,  0,  1);
    this.cellLookup[this.TOP_LEFT]    = new CellType(3, this.topLeftArray);

    // TOP RIGHT
    this.topRightArray                = new Array(-1, 0, -1,  1,  0,  1);
    this.cellLookup[this.TOP_RIGHT]   = new CellType(3, this.topRightArray);

    // BOTTOM LEFT
    this.bottomLeftArray              = new Array( 1, 0,  1, -1, 0, -1);
    this.cellLookup[this.BOTTOM_LEFT] = new CellType(3, this.bottomLeftArray);

    // BOTTOM RIGHT
    this.bottomRightArray             = new Array(-1, 0, -1, -1, 0, -1);
    this.cellLookup[this.BOTTOM_RIGHT]= new CellType(3, this.bottomRightArray);

    // TOP
    this.topArray                     = new Array(-1, 0, -1, 1, 0, 1, 1, 1, 1, 0);
    this.cellLookup[this.TOP]         = new CellType(5, this.topArray);

    // BOTTOM
    this.bottomArray                  = new Array(-1, 0, -1, -1, 0, -1, 1, -1, 1, 0);
    this.cellLookup[this.BOTTOM]      = new CellType(5, this.bottomArray);

    // LEFT
    this.leftArray                    = new Array(0, -1, 1, -1, 1, 0, 1, 1, 0, 1);
    this.cellLookup[this.LEFT]        = new CellType(5, this.leftArray);

    // RIGHT
    this.rightArray                   = new Array(0, -1, -1, -1, -1, 0, -1, 1, 0, 1);
    this.cellLookup[this.RIGHT]       = new CellType(5, this.rightArray);

    // CENTER
    this.centerArray                  = new Array(-1, -1, -1, 0, -1, 1, 0, 1, 1, 1, 1, 0, 1, -1, 0, -1);
    this.cellLookup[this.CENTER]      = new CellType(8, this.centerArray);
}

/**
 * Set the level and canvas being played. Initializes the grids
 * and pulls information in from the level. Places defense 
 * structures onto the grid.
 * @param {Level} level Level object
 * @param {PixiCanvas} canvas Canvas being used to render level
 */
GameLogicManager.prototype.setLevel = function (level, canvas) {
    this.level = level;
    this.canvas = canvas;
    this.gridWidth = this.canvas.size.width;
    this.gridHeight = this.canvas.size.height;
    this.currentUnit = null;

    // create a map of the allowed shapes and their quantities
    this.allowedShapesMap = {};
    var allowed = this.level.allowedShapes;
    if (!allowed) allowed = [];
    for(var i = 0; i < allowed.length; i++) {
        this.allowedShapesMap[allowed[i].shape] = allowed[i].quantity;
    }

    // initialize empty grids
    this.battleGrid = new Array(this.gridWidth * this.gridHeight);
    this.renderGridOld =  new Array(this.gridWidth * this.gridHeight);
    this.renderGrid = new Array(this.gridWidth * this.gridHeight);
    this.defenseGrid = new Array(this.gridWidth * this.gridHeight);
    this.ghostGrid = new Array(this.gridWidth * this.gridHeight);
    this.factionGrid = this.level.enemyZone.slice(0); // clone faction zones from level
    this.renderGrid = this.level.enemyZone.slice(0); // make render show faction zones
    // set all grids except faction and render to blank
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        this.renderGridOld[i] = this.BLANK;
        this.battleGrid[i] = this.BLANK;
        this.battleGridNew[i] = this.BLANK;
        this.defenseGrid[i] = this.BLANK;
        this.ghostGrid[i] = this.BLANK;
    }

    this.placeDefenses();
    // this.renderGridCells(this.gridHeight, this.gridWidth,
    //                      this.renderGrid, this.renderGridOld,
    //                      this.colors);
    this.renderGridCells();
}

/**
 * Starts the gameplay
 *
 * Starts timer
 */
GameLogicManager.prototype.start = function () {
    if (!this.level || !this.canvas)
        throw "Level and/or canvas not set! Game logic cannot start.";

    this.paused = false;

    // Game Loop Timer
    this.gameLoopTimer = setInterval(function () {
        if (!this.paused) {
            this.updateLoop();
            this.renderGridCells(this.gridHeight, this.gridWidth,
                         this.renderGrid, this.renderGridOld,
                         this.colors);
        }
    }.bind(this), 400);

    this.secondTimer = setInterval(function () {
        if (!this.paused) {
            this.checkMessage(); // check and display message if available
            var spawns = this.checkForSpawns();
            this.spawnEnemies(spawns);
        }
    }.bind(this), 1000);

    var gameManager = require('GameManager');
    gameManager.screenManager.timers.push(this.gameLoopTimer);
    gameManager.screenManager.timers.push(this.secondTimer);
}

/**
 * Check whether there is a message at a certain time. If so,
 * displays the message as a toast.
 */
GameLogicManager.prototype.checkMessage = function () {
    if (this.level.messageMap.has(this.level.time)) {
        Materialize.toast(
            this.level.messageMap.get(this.level.time),
            4000,
            'wisteria-toast'
        );
    }
};

/**
 * Runs one step of an update loop.
 * Runs the interactions of each cell and updates the render
 * grid.
 */
GameLogicManager.prototype.updateLoop = function() {
    // TODO check time; end game if zero

    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // calculate the array index of this cell
            var index = (i * this.gridWidth) + j;
            // get the cell status of each important grid
            var battleCell = this.battleGrid[index];
            var defenseCell = this.defenseGrid[index];
            var ghostCell = this.ghostGrid[index];

            // cases
            switch(battleCell) {
                case this.BLANK:
                    // decide if to reproduce
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.reproduce(index, neighbors);
                    break;
                case this.FRIEND:
                    // decide if to die
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.die(index, neighbors);
                    break;
                case this.ENEMY:
                    // decide if to die
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.die(index, neighbors);
                    break;
                default:
                    // nothing
                    break;
            }
            switch(defenseCell) {
                case this.OBJECTIVE:
                    // if an enemy is on top of this, destroy it
                    if(battleCell === this.ENEMY) {
                        this.defenseGrid[index] = this.BLANK;
                        this.defensesLeft--;
                    }
                    break;
                default:
                    // nothing
                    break;
            }

            // get updated statuses
            battleCell = this.battleGridNew[index];
            defenseCell = this.defenseGrid[index];

            // update render grid
            if(ghostCell !== this.BLANK)
                this.renderGrid[index] = this.GHOST;
            else if(battleCell !== this.BLANK)
                this.renderGrid[index] = battleCell;
            else if(defenseCell !== this.BLANK)
                this.renderGrid[index] = defenseCell;
            else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }

    // update the battleGrid to the new one
    this.battleGrid = this.battleGridNew.slice(0);
    this.battleGridNew = this.battleGridNew.slice(0);
}

/**
 * Renders the grid cells of the game using PixiCanvas.
 */
GameLogicManager.prototype.renderGridCells = function() {
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // calculate array index of this cell
            var index = (i * this.gridWidth) + j;
            // get its status in renderGrid
            var renderCell = this.renderGrid[index];
            // did it change since the previous update?
            if(renderCell !== this.renderGridOld[index]) {
                // if yes, change it
                this.canvas.setCell(j, i, this.colors[renderCell]);
            }
        }
    }

    // update the old render grid to the new one
    this.renderGridOld = this.renderGrid;
    this.renderGrid = this.renderGrid.slice(0);

    this.canvas.render();
}

/**
 * Spawns a new cell in a blank spot if necessary.
 * @param {int} index Index of the cell in the grids
 * @param {String : int, String : int} neighbors How many 
 *       of each type of neighbor the cell has
 */
GameLogicManager.prototype.reproduce = function(index, neighbors) {
    var friends = neighbors["friends"]; // number of friends
    var enemies = neighbors["enemies"]; // number of enemies
    var total = friends + enemies;
    // if there are exactly 3 neighbors, spawn
    if(total === 3) {
        var newType = this.BLANK;
        // color the new spawn with the color of the majority
        if(enemies > friends)
            newType = this.ENEMY;
        else
            newType = this.FRIEND;
        // add the new cell to the grid
        this.battleGridNew[index] = newType;
    }
}

/**
 * A cell dies if necessary.
 * @param {int} index Index of the cell in the grids
 * @param {String : int, String : int} neighbors How many 
 *       of each type of neighbor the cell has
 */
GameLogicManager.prototype.die = function(index, neighbors) {
    var total = neighbors["friends"] + neighbors["enemies"];
    // if less than 2 or more than 3 neighbors, the cell dies
    if(total < 2 || total > 3) {
        this.battleGridNew[index] = this.BLANK;
    }
    else {
        // currently do nothing; leave as is
        // potentially later change this to
        // get infected or cured based on majority
    }
}

/**
 * Counts how many neighbors the cell has of each type.
 * @param {int} row Row in the grid of this cell
 * @param {int} col Column in the grid of this cell
 * @return {String : int, String : int} number of friend and enemy neighbors
 */
GameLogicManager.prototype.calcNumNeighbors = function(row, col) {
    var numEnemies = 0;
    var numFriends = 0;

    // what type of cell location is this?
    var cellType = this.determineCellType(row, col);
    // determine which cells to check depending on the type
    var cellsToCheck = this.cellLookup[cellType];
    // check each of the adjacent cells
    for(var counter = 0; counter < (cellsToCheck.numNeighbors * 2); counter+=2)
    {
        var neighborCol = col + cellsToCheck.cellValues[counter];
        var neighborRow = row + cellsToCheck.cellValues[counter+1];
        var index = (neighborRow * this.gridWidth) + neighborCol;
        var neighborValue = this.battleGrid[index];
        // add to friend count or enemy count
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

/**
 * Place a shape on a specified grid.
 * @param {int} clickRow Row clicked on the grid
 * @param {int} clickcol Column clicked on the grid
 * @param {int} faction Cell life type to place the shape as
 * @param {Shape} shape Shape to place (if null, uses current selected unit)
 * @param {int[]} grid Grid to place it on (if null, uses battleGrid)
 */
GameLogicManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid) {
    // does not do anything if game is paused
    if(this.paused && faction !== this.OBJECTIVE)
        return;
    // checks to make sure a shape is chosen
    if(shape === null) {
        if(this.currentUnit === null) {
            // no shape to place
            return;
        }
        else {
            shape = this.currentUnit;
        }
    }
    // checks if this is a battleGrid placement
    var battle = false;
    if(grid === null) {
        grid = this.battleGrid;
        battle = true;
    }
    // gets the pixel array from the shape
    var pixels = shape.pixelsArray;

    // determines zone that the shape can be placed in
    var zone = this.BLANK;
    // wisteria units and defense objectives can only be
    // placed in the friend zone
    if(faction === this.FRIEND || faction === this.OBJECTIVE)
        zone = this.FRIEND_ZONE;
    // enemies can only spawn in the enemy zone
    else if(faction === this.ENEMY)
        zone = this.ENEMY_ZONE;
    // otherwise, just assume friend zone
    else
        zone = this.FRIEND_ZONE;

    // make sure the shape is being placed in the correct zone
    if(this.getGridCell(this.factionGrid, clickRow, clickCol) !== zone) {
        return;
    }
    // can't place on a void cell
    var col = clickCol + pixels[1];
    var row = clickRow + pixels[0];
    if(this.getGridCell(this.battleGrid, row, col) === this.VOID) {
        return;
    }
    // decrement the shape from the allowed units count if needed
    if(faction === this.FRIEND) {
        var val = this.allowedShapesMap[shape.name];
        if(val > 0) {
            this.allowedShapesMap[shape.name]--;
        }
        else {
            return;
        }
    }

    // place each pixel of the shape
    for (var i = 0; i < pixels.length; i += 2)
    {
        var col = clickCol + pixels[i+1];
        var row = clickRow + pixels[i];

        // verify that this cell can be placed on
        if(this.getGridCell(this.battleGrid, row, col) !== this.VOID)
        {
            // set the cell on the chosen grid
            this.setGridCell(grid, row, col, faction);
            // if it's a battle, set it on the new battleGrid too
            if(battle)
                this.setGridCell(this.battleGridNew, row, col, faction);
            // also set it on the renderGrid
            this.setGridCell(this.renderGrid, row, col, faction);
        }
    }

    this.renderGridCells(this.gridHeight, this.gridWidth,
                         this.renderGrid, this.renderGridOld,
                         this.colors);
}

/**
 * Place all defense structures based on the level data.
 */
GameLogicManager.prototype.placeDefenses = function() {
    this.defensesLeft = 0; // reset defenses remaining
    var defenses = this.level.defenseStructures;
    // make sure there are defenses
    if(typeof defenses === "undefined")
        return;
    var gameManager = require('GameManager');

    // place each defense structure
    for(var i = 0; i < defenses.length; i++) {
        var shape = defenses[i].name;
        var coords = defenses[i].coordinates;
        shape = gameManager.shapeManager.getShape(shape);
        this.placeShape(coords.y, coords.x, this.OBJECTIVE,
                        shape, this.defenseGrid);
        shape = shape.pixelsArray;
        this.defensesLeft += shape.length/2;
    }
}

/**
 * Checks if there are enemies that should spawn at this time.
 * @return {[{name : String, coordinates : {x : int, y : int}}, ...]}
 *       List of spawns at a given time
 */
GameLogicManager.prototype.checkForSpawns = function() {
    var time = this.level.time;
    var spawns = this.level.enemySpawnsMap.get(time);
    return spawns;
}

/**
 * Places each enemy spawn on the grid.
 * @param {[{name : String, coordinates : {x : int, y : int}}, ...]}
 *       spawns List of spawns at a given time
 */
GameLogicManager.prototype.spawnEnemies = function(spawns) {
    if(typeof spawns === "undefined")
        return;
    var gameManager = require('GameManager');

    // place each spawn
    for(var i = 0; i < spawns.length; i++) {
        var mob = spawns[i];
        var shape = mob.name;
        var coords = mob.coordinates;
        // get the shape to place
        shape = gameManager.shapeManager.getShape(shape);
        this.placeShape(coords.y, coords.x, this.ENEMY, shape, null);
    }
}

/**
 * Check if all defense structures have been destroyed.
 * @return true if defensesLeft is < 1
 */
GameLogicManager.prototype.isDead = function() {
    return !(this.defensesLeft > 0);
}

/**
 * Checks if the given row and column correspond to a valid cell.
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @return true if valid; false otherwise
 */
GameLogicManager.prototype.isValidCell = function(row, col) {
    // is it outside the grid?
    if(    (row < 0) ||
            (col < 0) ||
            (row >= this.gridHeight) ||
            (col >= this.gridWidth))
    {
        return false;
    }
    // it's inside the grid
    else
    {
        return true;
    }
}

/**
 * Pause the game.
 */
GameLogicManager.prototype.pause = function() {
    this.paused = true;
}

/**
 * Unpause the game.
 */
GameLogicManager.prototype.resume = function() {
    this.paused = false;
}

/**
 * Clears the ghostGrid.
 */
GameLogicManager.prototype.clearGhostGrid = function() {
    // clear ghostGrid
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        this.ghostGrid[i] = this.BLANK;
    }

    // update renderGrid like an update loop but without the game logic
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // calculate index of current cell
            var index = (i * this.gridWidth) + j;
            // get status of this cell on various grids
            var defenseCell = this.defenseGrid[index];
            var ghostCell = this.ghostGrid[index];
            var battleCell = this.battleGridNew[index];

            // update the renderGrid cell
            if(ghostCell !== this.BLANK)
                this.renderGrid[index] = this.GHOST;
            else if(battleCell !== this.BLANK)
                this.renderGrid[index] = battleCell;
            else if(defenseCell !== this.BLANK)
                this.renderGrid[index] = defenseCell;
            else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }

    this.renderGridCells();
}

/**
 * Accessor method for getting the cell value in the grid at
 * location (row, col).
 * @param {int[]} grid Which grid to check
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @return {int} Cell life type in the given cell
 */
GameLogicManager.prototype.getGridCell = function(grid, row, col) {
    // ignore if it's outside the grid
    if (!this.isValidCell(row, col))
    {
        return -1;
    }
    var index = (row * this.gridWidth) + col;
    return grid[index];
}

/**
 * Mutator method for setting the cell value in the grid at
 * location (row, col).
 * @param {int[]} grid Which grid to change
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @param {int} value Value to change to
 */
GameLogicManager.prototype.setGridCell = function(grid, row, col, value) {
    // ignore if it's outside the grid
    if(!this.isValidCell(row, col))
    {
        return;
    }
    var index = (row * this.gridWidth) + col;
    grid[index] = value;
}

/**
 * A cell's type determines which adjacent cells need to be tested
 * during each frame of the simulation. This method tests the cell
 * at (row, col), and returns the constant representing which of
 * the 9 different types of cells it is.
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @returns {int} Location type of the cell
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
