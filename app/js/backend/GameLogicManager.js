'use strict';

var GameLogicManager = function(level) {
    this.renderGridOld = [];// what was rendered last update loop
    this.renderGrid = [];   // what gets displayed
    this.battleGrid = [];   // friend and foe interactions
    this.battleGridNew = [];// updated battle grid
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

    // game timers - IDs needed to stop timer later on
    this.gameLoopTimer = 0; // once per frame
    this.secondTimer = 0; // once per second

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
    this.initCellLookup();
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
    this.cellLookup = new Array();

    // TOP LEFT
    this.topLeftArray           = new Array( 1, 0,  1,  1,  0,  1);
    this.cellLookup[this.TOP_LEFT]   = new CellType(3, this.topLeftArray);

    // TOP RIGHT
    this.topRightArray           = new Array(-1, 0, -1,  1,  0,  1);
    this.cellLookup[this.TOP_RIGHT]   = new CellType(3, this.topRightArray);

    // BOTTOM LEFT
    this.bottomLeftArray         = new Array( 1, 0,  1, -1, 0, -1);
    this.cellLookup[this.BOTTOM_LEFT] = new CellType(3, this.bottomLeftArray);

    // BOTTOM RIGHT
    this.bottomRightArray        = new Array(-1, 0, -1, -1, 0, -1);
    this.cellLookup[this.BOTTOM_RIGHT]= new CellType(3, this.bottomRightArray);

    // TOP
    this.topArray                = new Array(-1, 0, -1, 1, 0, 1, 1, 1, 1, 0);
    this.cellLookup[this.TOP]         = new CellType(5, this.topArray);

    // BOTTOM
    this.bottomArray             = new Array(-1, 0, -1, -1, 0, -1, 1, -1, 1, 0);
    this.cellLookup[this.BOTTOM]      = new CellType(5, this.bottomArray);

    // LEFT
    this.leftArray               = new Array(0, -1, 1, -1, 1, 0, 1, 1, 0, 1);
    this.cellLookup[this.LEFT]        = new CellType(5, this.leftArray);

    // RIGHT
    this.rightArray              = new Array(0, -1, -1, -1, -1, 0, -1, 1, 0, 1);
    this.cellLookup[this.RIGHT]       = new CellType(5, this.rightArray);

    // CENTER
    this.centerArray             = new Array(-1, -1, -1, 0, -1, 1, 0, 1, 1, 1, 1, 0, 1, -1, 0, -1);
    this.cellLookup[this.CENTER]      = new CellType(8, this.centerArray);
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
    this.gridWidth = this.canvas.size.width;
    this.gridHeight = this.canvas.size.height;
    this.currentUnit = null;

    this.battleGrid = new Array(this.gridWidth * this.gridHeight);
    this.renderGridOld =  new Array(this.gridWidth * this.gridHeight);
    this.renderGrid = new Array(this.gridWidth * this.gridHeight);
    this.defenseGrid = new Array(this.gridWidth * this.gridHeight);
    this.ghostGrid = new Array(this.gridWidth * this.gridHeight);
    // this.factionGrid = new Array(this.gridWidth * this.gridHeight);
    this.factionGrid = this.level.enemyZone;
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        this.renderGrid[i] = this.BLANK;
        this.renderGridOld[i] = this.BLANK;
        this.battleGrid[i] = this.BLANK;
        this.battleGridNew[i] = this.BLANK;
        this.defenseGrid[i] = this.BLANK;
        this.ghostGrid[i] = this.BLANK;
        // this.factionGrid[i] = this.FRIEND_ZONE;
    }
    this.renderGrid = this.level.enemyZone;
    this.placeDefenses();
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
            this.renderGridCells();
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

GameLogicManager.prototype.checkMessage = function () {
    if (this.level.messageMap.has(this.level.time)) {
        Materialize.toast(
            this.level.messageMap.get(this.level.time),
            4000,
            'wisteria-toast'
        );
    }
};

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
                    this.die(index, this.FRIEND, neighbors);
                    break;
                case this.ENEMY:
                    // decide if to die
                    var neighbors = this.calcNumNeighbors(i, j);
                    this.die(index, this.ENEMY, neighbors);
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

            battleCell = this.battleGridNew[index];
            defenseCell = this.defenseGrid[index];
            if(ghostCell !== this.BLANK)
                this.renderGrid[index] = this.GHOST;
            else if(battleCell !== this.BLANK)
                this.renderGrid[index] = battleCell;
            else if(defenseCell !== this.BLANK)
                this.renderGrid[index] = defenseCell;
            // else if(this.renderGrid[index] !== this.BLANK)
            //     // do nothing; keep this cell
            //     continue;
            else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }
    this.battleGrid = this.battleGridNew.slice(0);
    this.battleGridNew = this.battleGridNew.slice(0);
}

GameLogicManager.prototype.renderGridCells = function() {
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * this.gridWidth) + j;
            var renderCell = this.renderGrid[index];
            if(renderCell !== this.renderGridOld[index]) {
                this.canvas.setCell(j, i, this.colors[renderCell]);
            }
        }
    }

    this.renderGridOld = this.renderGrid;
    this.renderGrid = this.renderGrid.slice(0);

    this.canvas.render();
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
        this.battleGridNew[index] = newType;
    }
}

GameLogicManager.prototype.die = function(index, current, neighbors) {
    var total = neighbors["friends"] + neighbors["enemies"];
    if(total < 2 || total > 3) {
        this.battleGridNew[index] = this.BLANK;
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

GameLogicManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid) {
    if(this.paused && faction !== this.OBJECTIVE)
        return;
    if(shape === null) {
        if(this.currentUnit === null) {
            return;
        }
        else {
            shape = this.currentUnit;
        }
    }
    var battle = false;
    if(grid === null) {
        grid = this.battleGrid;
        battle = true;
    }
    var pixels = shape.pixelsArray;

    var zone = this.BLANK;
    if(faction === this.FRIEND || faction === this.OBJECTIVE)
        zone = this.FRIEND_ZONE;
    else if(faction === this.ENEMY)
        zone = this.ENEMY_ZONE;
    else
        zone = this.FRIEND_ZONE;

    if(this.getGridCell(this.factionGrid, clickRow, clickCol) !== zone) {
        return;
    }

    for (var i = 0; i < pixels.length; i += 2)
    {
        var col = clickCol + pixels[i+1];
        var row = clickRow + pixels[i];
        // VERIFY THAT THIS CELL CAN BE PLACED ON
        if(this.getGridCell(this.battleGrid, row, col) !== this.VOID)
        {
            this.setGridCell(grid, row, col, faction);
            if(battle)
                this.setGridCell(this.battleGridNew, row, col, faction);
            this.setGridCell(this.renderGrid, row, col, faction);
        }
    }

    this.renderGridCells();
}

GameLogicManager.prototype.placeDefenses = function() {
    var defenses = this.level.defenseStructures;
    if(typeof defenses === "undefined")
        return;
    var gameManager = require('GameManager');

    for(var i = 0; i < defenses.length; i++) {
        var shape = defenses[i].name;
        var coords = defenses[i].coordinates;
        shape = gameManager.shapeManager.getShape(shape);
        this.placeShape(coords.y, coords.x, this.OBJECTIVE,
                        shape, this.defenseGrid);
    }
}

GameLogicManager.prototype.checkForSpawns = function() {
    var time = this.level.time;
    var spawns = this.level.enemySpawnsMap.get(time);
    return spawns;
}

GameLogicManager.prototype.spawnEnemies = function(spawns) {
    if(typeof spawns === "undefined")
        return;
    var gameManager = require('GameManager');

    for(var i = 0; i < spawns.length; i++) {
        var mob = spawns[i];
        var shape = mob.name;
        var coords = mob.coordinates;
        shape = gameManager.shapeManager.getShape(shape);
        this.placeShape(coords.y, coords.x, this.ENEMY, shape, null);
    }
}

GameLogicManager.prototype.isValidCell = function(row, col) {
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
    this.paused = true;
}

GameLogicManager.prototype.resume = function() {
    this.paused = false;
}

GameLogicManager.prototype.reset = function() {
    // RESET ALL THE DATA STRUCTURES TOO
    this.battleGrid = new Array(this.gridWidth * this.gridHeight);
    this.battleGridNew = new Array(this.gridWidth * this.gridHeight);
    this.renderGridOld =  new Array(this.gridWidth * this.gridHeight);
    this.renderGrid = new Array(this.gridWidth * this.gridHeight);
    this.defenseGrid = new Array(this.gridWidth * this.gridHeight);
    this.ghostGrid = new Array(this.gridWidth * this.gridHeight);
    this.factionGrid = new Array(this.gridWidth * this.gridHeight);
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        this.renderGrid[i] = this.BLANK;
        this.renderGridOld[i] = this.BLANK;
        this.battleGrid[i] = this.BLANK;
        this.battleGridNew[i] = this.BLANK;
        this.defenseGrid[i] = this.BLANK;
        this.ghostGrid[i] = this.BLANK;
        this.factionGrid[i] = this.FRIEND_ZONE;
    }

    this.paused = true;
    this.currentUnit = null;

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
    this.renderGridCells();
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
