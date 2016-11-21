'use strict';

var LevelEditManager = function(levelSize) {
	this.size = levelSize;
	this.rows = 0;
	this.cols = 0;
	this.canvas = null;

	this.MESSAGE_TIME_DIFFERENCE = 4;
	this.messageMap = {}; // {time : String}
	this.defenses = null; // [{name : String, coordinates : {x : int, y : int}}]
	this.enemySpawns = {}; // {time : int, shapes :  [{name : String, coordinates : {x : int, y : int}}]}
	this.totalTime = 60;
	this.allowedShapes = null; // {name : quantity}

	this.factionGrid = [];	// enemy and friendly zones
	this.nonGhostGrid = [];
	this.renderGrid = [];   // what gets displayed
	this.renderGridOld = [];
    this.ghostGrid = [];    // ghost only

    this.selectedShape = null;
    this.selectedFaction = null;

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
    
    this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
                         this.renderGrid, this.renderGridOld, 
                         this.colors);

}

LevelEditManager.prototype.reset = function() {
	this.renderGrid = new Array(rows*cols);
	this.defenseGrid = new Array(rows*cols);
    this.ghostGrid = new Array(rows*cols);
    this.defenses = [];
    this.enemySpawns = [];
    this.totalTime = 60;
    this.allowedShapes = {};
    this.messageMap = {};
}

LevelEditManager.prototype.addMessage = function(time, msg) {
	this.messageMap[time] = msg;
}

LevelEditManager.prototype.changeTotalType = function(newTime) {
	this.totalTime = newTime;
}

LevelEditManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid) {
    if(shape === null) {
        if(this.currentUnit === null) {
            return;
        }
        else {
            shape = this.currentUnit;
        }
    }
    if(grid === null) {
        return;
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

    this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
                         this.renderGrid, this.renderGridOld, 
                         this.colors);
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

module.exports = LevelEditManager;