'use strict';

var LevelEditManager = function(levelSize) {
	this.size = levelSize;
	this.rows = 0;
	this.cols = 0;
	this.canvas = null;

	this.MESSAGE_TIME_DIFFERENCE = 4;
	this.messageMap = {}; // {time : String}
	this.defenses = []; // [{name : String, coordinates : {x : int, y : int}}]
	this.enemySpawns = {}; // {time : int, shapes :  [{name : String, coordinates : {x : int, y : int}}]}
	this.totalTime = 60;
	this.currentTime = 0;
	this.allowedShapes = null; // {name : quantity}

	this.factionGrid = [];	// enemy and friendly zones
	this.nonGhostGrid = [];
	this.renderGrid = [];   // what gets displayed
	this.renderGridOld = [];
    this.ghostGrid = [];    // ghost only

    this.selectedShape = null;
    this.selectedFaction = 0;

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
}

LevelEditManager.prototype.setLevel = function (level, canvas) {
    this.level = level;
    this.canvas = canvas;
    this.gridWidth = this.canvas.size.width;
    this.gridHeight = this.canvas.size.height;
    this.defenses = this.level.defenseStructures;
    this.allowedShapes = {};
    var allowed = this.level.allowedShapes;
    if (!allowed) allowed = [];
    for(var i = 0; i < allowed.length; i++) {
        this.allowedShapes[allowed[i].shape] = allowed[i].quantity;
    }
    this.renderGridOld = new Array(this.gridWidth * this.gridHeight)
    this.renderGrid = this.level.enemyZone.slice(0);
    this.nonGhostGrid = this.renderGrid.slice(0);
    this.factionGrid = this.level.enemyZone.slice(0);
    
    // this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
    //                      		this.renderGrid, this.renderGridOld, 
    //                      		this.colors);
	this.renderGridCells();

}

LevelEditManager.prototype.reset = function() {
	this.renderGrid = new Array(rows*cols);
	this.defenseGrid = new Array(rows*cols);
    this.ghostGrid = new Array(rows*cols);
    this.nonGhostGrid = new Array(rows*cols);
    this.defenses = [];
    this.enemySpawns = [];
    this.totalTime = 60;
    this.allowedShapes = {};
    this.messageMap = {};
}

LevelEditManager.prototype.addMessage = function(time, msg) {
	this.messageMap[time] = msg;
}

LevelEditManager.prototype.changeTotalTime = function(newTime) {
	if(newTime < this.totalTime && newTime > 30) {
		this.deleteAfter(newTime);
	}
	if(newTime <= 400)
		this.totalTime = newTime;
}

LevelEditManager.prototype.deleteAfter = function(newTime) {
	var msgs = Object.keys(this.messageMap);
	var spawns = Object.keys(this.enemySpawns);
	for(var i = 0; i < msgs.length; i++) {
		if(msgs[i] > newTime)
			delete this.messageMap[msgs[i]];
	}
	for(var i = 0; i < spawns.length; i++) {
		if(spawns[i] > newTime)
			delete this.enemySpawns[spawns[i]];
	}
}

LevelEditManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid) {
    if(shape === null || shape === undefined) {
        if(this.selectedUnit === null || this.selectedUnit === undefined) {
            return;
        }
        else {
            shape = this.selectedUnit;
        }
    }
    if(grid === null) {
    	if(this.nonGhostGrid === null) {
    		return;
    	}
    	else {
    		grid = this.nonGhostGrid;
    	}
    }
    var pixels = shape.pixelsArray;

    var zone = this.BLANK;
    if(faction === this.FRIEND || faction === this.OBJECTIVE)
        zone = this.FRIEND_ZONE;
    else if(faction === this.ENEMY)
        zone = this.ENEMY_ZONE;
    else if(faction === this.ENEMY_ZONE || faction === this.FRIEND_ZONE)
        zone = this.BLANK;
    else
    	zone = this.BLANK;

    if(zone !== this.BLANK &&
       this.getGridCell(this.factionGrid, clickRow, clickCol) !== zone) {
        return;
    }

    for (var i = 0; i < pixels.length; i += 2)
    {
        var col = clickCol + pixels[i+1];
        var row = clickRow + pixels[i];
        // VERIFY THAT THIS CELL CAN BE PLACED ON
        this.setGridCell(grid, row, col, faction);
        this.setGridCell(this.renderGrid, row, col, faction);
    }
    var name = shape.name;
	var y = clickRow + pixels[0];
	var x = clickCol + pixels[1];
    if(faction === this.ENEMY) {
    	// add to enemy spawn map
    	var currentSpawns = this.enemySpawns[this.currentTime];
    	this.enemySpawns[this.currentTime].push({"name" : name,
    									 	"coords" : {"x" : x,
    												 	"y" : y}});
    }
    else if(faction === this.OBJECTIVE) {
    	// add to defenses list
    	this.defenses.push({"name" : name,
						 	"coords" : {"x" : x,
									 	"y" : y}});
    }
    else if(faction === this.ENEMY_ZONE) {
    	this.setGridCell(this.factionGrid, y, x, this.ENEMY_ZONE);
    }
    else if(faction === this.FRIEND_ZONE) {
    	this.setGridCell(this.factionGrid, y, x, this.FRIEND_ZONE);
    }

    // this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
    //                      		this.renderGrid, this.renderGridOld, 
    //                      		this.colors);
	this.renderGridCells();
}

LevelEditManager.prototype.placeDefenses = function() {
    var defenses = this.level.defenseStructures;
    if(typeof defenses === "undefined")
        return;
    var gameManager = require('GameManager');

    for(var i = 0; i < defenses.length; i++) {
        var shape = defenses[i].name;
        var coords = defenses[i].coordinates;
        shape = gameManager.shapeManager.getShape(shape);
        this.placeShape(coords.y, coords.x, this.OBJECTIVE,
                        shape, this.nonGhostGrid);
    }
}

LevelEditManager.prototype.clearGrid = function(grid) {
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        grid[i] = this.BLANK;
    }

    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * this.gridWidth) + j;
            var ghostCell = this.ghostGrid[index];

            if(ghostCell !== this.BLANK)
                this.renderGrid[index] = this.GHOST;
            else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }

    // this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
    //                      		this.renderGrid, this.renderGridOld, 
    //                      		this.colors);
	this.renderGridCells();
}

LevelEditManager.prototype.isValidCell = function(row, col) {
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

/*
 * Accessor method for getting the cell value in the grid at
 * location (row, col).
 */
LevelEditManager.prototype.getGridCell = function(grid, row, col) {
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
LevelEditManager.prototype.setGridCell = function(grid, row, col, value) {
    // IGNORE IF IT'S OUTSIDE THE GRID
    if(!this.isValidCell(row, col))
    {
        return;
    }
    var index = (row * this.gridWidth) + col;
    grid[index] = value;
}

LevelEditManager.prototype.renderGridCells = function() {
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

module.exports = LevelEditManager;