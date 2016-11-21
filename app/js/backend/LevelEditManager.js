'use strict';

var LevelEditManager = function(levelSize) {
	this.size = levelSize;
	this.rows = 0;
	this.cols = 0;
	this.MESSAGE_TIME_DIFFERENCE = 4;
	this.messageMap = {}; // {time : String}
	this.defenses = []; // [{name : String, coordinates : {x : int, y : int}}]
	this.enemySpawns = {}; // {time : int, shapes :  [{name : String, coordinates : {x : int, y : int}}]}
	this.totalTime = 60;
	this.allowedShapes = {}; // {name : quantity}

	this.factionGrid = [];	// enemy and friendly zones
	this.renderGrid = [];   // what gets displayed
    this.ghostGrid = [];    // ghost only

    this.selectedShape;
    this.selectedFaction;
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

LevelEditManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid) {
    if(this.paused && faction !== this.OBJECTIVE)
        return;
    if(shape === null) {
        if(this.currentUnit === null) {
            return;
        }
        else {
            shape = this.currentUnit;
            if(faction !== this.GHOST) {
                var val = this.allowedShapesMap[shape.name];
                if(val > 0) {
                    this.allowedShapesMap[shape.name]--;
                }
                else {
                    return;
                }
            }
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

    this.canvas.renderGridCells(this.gridHeight, this.gridWidth, 
                         this.renderGrid, this.renderGridOld, 
                         this.colors);
}