'use strict';

/**
 * Constructs a LevelEditManager object for a level.
 * @param {String} levelSize Not used
 */
var LevelEditManager = function(levelSize) {
	this.canvas = null;        // PixiCanvas that renders everything

	this.MESSAGE_TIME_DIFFERENCE = 4; // minimum time between messages
	this.messages = new Map();      // {time : String}
	this.defenses = [];        // [{name : String, coordinates : {x : int, y : int}}]
	this.enemySpawns = new Map();     // {time : int, shapes : [{name : String, coordinates : {x : int, y : int}}]}
	this.totalTime = 60;       // default total level time
	this.currentTime = 60;      // default current time
	this.allowedShapes = null; // {name : quantity}
    this.shapeLookupMap = {};

	this.factionGrid = [];     // enemy and friendly zones
	this.nonGhostGrid = [];    // everything underneath ghost
	this.renderGrid = [];      // what gets displayed
	this.renderGridOld = [];   // what was rendered last time
    this.ghostGrid = [];       // ghost only

    this.selectedUnit = null; // which shape is selected to place
    this.selectedFaction = 0;  // which faction is selected to place

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

/**
 * Sets the level that the edit manager corresponds to and
 * initializes many variables.
 * @param {Level} level Level object
 * @param {PixiCanvas} canvas Canvas responsible for rendering
 */
LevelEditManager.prototype.setLevel = function (level, canvas) {
    this.level = level;
    this.canvas = canvas;
    this.gridWidth = this.canvas.size.width;
    this.gridHeight = this.canvas.size.height;

    this.messages = this.level.messages;
    if(this.messages === undefined)
        this.messages = new Map();

    this.defenses = this.level.defenseStructures; // TODO: clone
    if(this.defenses === undefined)
    	this.defenses = []; // if empty, just make it an empty array

    // make a map of allowed shapes and their quantities
    this.allowedShapes = {};
    var allowed = this.level.allowedShapes;
    if (!allowed) allowed = [];
    for(var i = 0; i < allowed.length; i++) {
        this.allowedShapes[allowed[i].shape] = allowed[i].quantity;
    }
    // initialize grids
    this.renderGridOld = new Array(this.gridWidth * this.gridHeight);
    this.renderGrid = this.level.enemyZone.slice(0);
    this.ghostGrid = new Array(this.gridWidth * this.gridHeight);
    this.nonGhostGrid = new Array(this.gridWidth * this.gridHeight);
    this.factionGrid = this.level.enemyZone.slice(0);
    this.enemySpawns = this.level.enemySpawns; // TODO: clone
    if(this.enemySpawns === undefined){
        this.enemySpawns = new Map();
    }
    for(var i = 0; i < this.gridHeight*this.gridWidth; i++)
    {
        this.ghostGrid[i] = this.BLANK;
    	this.nonGhostGrid[i] = this.BLANK;
    }

    // this.canvas.renderGridCells(this.gridHeight, this.gridWidth,
    //                      		this.renderGrid, this.renderGridOld,
    //                      		this.colors);
    // this.selectedFaction = this.OBJECTIVE;
	this.placeDefenses(this.level.defenseStructures, false);
    // this.selectedFaction = this.BLANK;
    this.renderGridCells();

}

/**
 * Adds a message to the level at the given time.
 * @param {String} msg Message to display
 * @param {int} [time] Time that the message will display
 * @return {Boolean} whether or not it was successful
 */
LevelEditManager.prototype.addMessage = function(msg, time) {
	if (time === undefined)
		time = this.currentTime;

    if(msg === '' || msg === undefined || msg === null) {
        if(this.messages.has(time)) {
            delete this.messages.delete(time);
            Materialize.toast(
                'Message deleted.',
                4000,
                'wisteria-toast'
            );
            return false; // false to keep the dialog open
        }
        return false;
    }

    if(msg.length > 100) {
        Materialize.toast(
            'Messages are limited to 100 characters. (Yours: '+msg.length+')',
            2000,
            'wisteria-error-toast'
        );
        return false;
    }

	// if message already exists at that location, update it
	if (this.messages.has(time)) {
		this.messages.set(time, msg);

		Materialize.toast(
	        'Updated message.',
	        4000,
	        'wisteria-toast'
	    );

		return true;
	}

    for(var i = time; i < time + 5; i++) {
        if(i < this.totalTime + 1 && this.messages.has(i)) {
            Materialize.toast(
                'Cannot place message less than 5 seconds before/after another.',
                4000,
                'wisteria-error-toast'
            );
            return false;
        }
    }

    for(var i = time; i > time - 5; i--) {
        if(i > 0 && this.messages.has(i)) {
            Materialize.toast(
                'Cannot place message less than 5 seconds before/after another.',
                4000,
                'wisteria-error-toast'
            );
            return false;
        }
    }
	this.messages.set(time, msg);
    Materialize.toast(
        'Placed message.',
        4000,
        'wisteria-toast'
    );
	return true;
}

/**
 * Change the total level time. If the new time is less than
 * the old time, then it removes everything after the new time.
 * @param {int} newTime New total level time (seconds)
 */
LevelEditManager.prototype.changeTotalTime = function(newTime) {
	if(newTime < this.totalTime && newTime >= 30) {
		this.deleteAfter(newTime);
	}
	if(newTime <= 300 && newTime >= 30) {
		this.totalTime = newTime;
        if(newTime <= this.currentTime) {
            this.changeCurrentTime(newTime);
        }
        Materialize.toast(
            'Total time changed.',
            4000,
            'wisteria-toast'
        );
    }
    else {
        Materialize.toast(
            'New time entered must be between 30 and 300 seconds.',
            4000,
            'wisteria-error-toast'
        );
    }
}

LevelEditManager.prototype.changeCurrentTime = function(newTime) {
    this.currentTime = newTime - 0; // convert to int
    this.renderGridOld = new Array(this.gridWidth * this.gridHeight);
    this.renderGrid = this.factionGrid.slice(0);
    this.ghostGrid = new Array(this.gridWidth * this.gridHeight);
    this.nonGhostGrid = new Array(this.gridWidth * this.gridHeight);
    for(var i = 0; i < this.gridHeight*this.gridWidth; i++)
    {
        this.ghostGrid[i] = this.BLANK;
        this.nonGhostGrid[i] = this.BLANK;
    }

	// save current selections
	var selectedUnit = this.selectedUnit;
	var selectedFaction = this.selectedFaction;

    this.placeDefenses(this.defenses, false);
    var spawns = this.checkForSpawns();

    this.spawnEnemies(spawns, false);
    this.addExistingSpawnsToLookupMap(spawns);

    this.renderGridCells();

	// restore current selections
	this.selectedUnit = selectedUnit;
	this.selectedFaction = selectedFaction;
}

/**
 * Deletes all messages and enemy spawns after a certain time.
 * @param {int} newTime Time after which to delete (seconds)
 */
LevelEditManager.prototype.deleteAfter = function(newTime) {
	for(var i = newTime+1; i < this.currentTime+1; i++) {
        if(this.messages.has(i))
            this.messages.delete(i);
    }
	for(var i = newTime+1; i < this.currentTime+1; i++) {
		if(this.enemySpawns.has(i))
			this.enemySpawns.delete(i);
	}
}

LevelEditManager.prototype.forceChangeUnit = function() {
    if(this.selectedUnit === undefined)
        return;
    if(this.selectedUnit === "void" || this.selectedUnit.name === "void") {
        var gameManager = require('GameManager');
        this.selectedUnit = gameManager.shapeManager.getShape("archernw");
    }
}
LevelEditManager.prototype.forceChangeFaction = function() {
    if(this.selectedFaction === this.BLANK) {
        this.selectedFaction = this.OBJECTIVE;
    }
}

/**
 * Checks if there are enemies that should spawn at this time.
 * @return {[{name : String, coordinates : {x : int, y : int}}, ...]}
 *       List of spawns at a given time
 */
LevelEditManager.prototype.checkForSpawns = function() {
    var spawns = this.enemySpawns.get(this.currentTime);
    return spawns;
}

/**
 * Places each enemy spawn on the grid.
 * @param {[{name : String, coordinates : {x : int, y : int}}, ...]}
 *       spawns List of spawns at a given time
 */
LevelEditManager.prototype.spawnEnemies = function(spawns, addToMaps) {
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
        this.placeShape(coords.y, coords.x, this.ENEMY, shape, null, addToMaps);
    }
}

/**
 * Places a shape on a specified grid.
 * @param {int} clickRow Row to place the shape
 * @param {int} clickCol Column to place the shape
 * @param {int} faction What faction to make the placed shape
 * @param {Shape} shape The shape to place
 * @param {int[]} grid Grid to place the shape on
 */
LevelEditManager.prototype.placeShape = function(clickRow, clickCol, faction, shape, grid, addToMaps) {
    // if no shape is specified, check if one is selected
    if(shape === null || shape === undefined) {
        if(this.selectedUnit === null || this.selectedUnit === undefined) {
            return;
        }
        else {
            shape = this.selectedUnit;
        }
    }
    if(this.selectedFaction === undefined) {
        Materialize.toast(
            "No faction selected! Select a faction from the Factions sidebar.",
            2000,
            'wisteria-error-toast'
        );
        return;
    }
    if(this.selectedFaction === this.BLANK &&
       this.selectedUnit !== undefined &&
       this.selectedUnit.name === "void" &&
       faction !== this.GHOST)
    {
        faction = this.BLANK;
    }
    if(addToMaps === undefined && faction !== this.GHOST)
        addToMaps = true;

    if(this.selectedFaction === this.BLANK &&
       faction === this.BLANK)
    {
        if(addToMaps && this.selectedUnit.name !== "void") {
            Materialize.toast(
                "No faction selected! Select a faction from the Factions sidebar.",
                2000,
                'wisteria-error-toast'
            );
            return;
        }
        var y = clickRow;  // y coordinate
        var x = clickCol;  // x coordinate
        var deletedShape = this.deleteUnit(x, y);
        shape = deletedShape;
        if(shape === undefined)
            return;
        else
            shape = shape.shape;
        clickRow = deletedShape.coordinates.y;
        clickCol = deletedShape.coordinates.x;
    }

    // if no grid is specified, use the nonGhostGrid
    if(grid === null) {
    	if(this.nonGhostGrid === null) {
    		return;
    	}
    	else {
    		grid = this.nonGhostGrid;
    	}
    }

    // get the pixels of the shape
    var pixels = shape.pixelsArray;

    // decide which zone it's allowed to be placed in
    var zone = this.BLANK;
    // friendly units and objectives only in friend zone
    if(faction === this.FRIEND || faction === this.OBJECTIVE)
        zone = this.FRIEND_ZONE;
    // enemies only in the enemy zone
    else if(faction === this.ENEMY) {
        if(this.totalTime - this.currentTime < 3) {
            Materialize.toast(
                'Enemy spawns allowed only after 3 seconds.',
                2000,
                'wisteria-error-toast'
            );
            return;
        }
        var current_spawns = this.checkForSpawns();
        if(current_spawns !== undefined && current_spawns.length >= 5) {
            Materialize.toast(
                'Only 5 enemy spawns allowed per time slot.',
                2000,
                'wisteria-error-toast'
            );
            return;
        }
        zone = this.ENEMY_ZONE;
    }
    // zones can be anywhere
    else if(faction === this.ENEMY_ZONE || faction === this.FRIEND_ZONE) {
        zone = this.BLANK;
        grid = this.factionGrid;
    }
    // everything else can be anywhere
    else
    	zone = this.BLANK;

    // make sure that we're trying to place the shape in the proper zone
    if(zone !== this.BLANK &&
       this.getGridCell(this.factionGrid, clickRow, clickCol) !== zone) {
	   Materialize.toast(
	        'Invalid zone for placement!',
	        2000,
	        'wisteria-error-toast'
   	    );
        return;
    }

    var y = clickRow;  // y coordinate
    var x = clickCol;  // x coordinate
    var pixelMap = {};
    // place each pixel of the shape
    for (var i = 0; i < pixels.length; i += 2)
    {
        var col = clickCol + pixels[i+1];
        var row = clickRow + pixels[i];

        pixelMap[col + " " + row] = {"x" : clickCol, "y" : clickRow};

        this.setGridCell(grid, row, col, faction);
        this.setGridCell(this.renderGrid, row, col, faction);
    }

    // add an enemy unit to the proper list
    if(addToMaps) {
        var name = shape.name;         // name of the shape to add
        if(faction === this.ENEMY) {
            // add to enemy list
        	// var currentSpawns = this.enemySpawns[this.currentTime];
        	if(this.enemySpawns.get(this.currentTime) === undefined) {
        		// new array
        		this.enemySpawns.set(this.currentTime, [{"name" : name,
    	    									 	   "coordinates" : {"x" : x,
    	    												 	        "y" : y}}]);
        	}
        	else {
                // add to array
        		this.enemySpawns.get(this.currentTime).push({"name" : name,
    	    									 	        "coordinates" : {"x" : x,
    	    												 	             "y" : y}});
        	}
            this.addToLookupMap(pixelMap);
            // var currentLookup = this.shapeLookupMap[this.currentTime];
            // if(currentLookup === undefined) {
            //     // map
            //     this.shapeLookupMap[this.currentTime] = pixelMap;
            // }
            // else {
            //     // add to map
            //     var pixelMapKeys = Object.keys(pixelMap);
            //     for(var i = 0; i < pixelMapKeys.length; i++) {
            //         var key = pixelMapKeys[i];
            //         this.shapeLookupMap[this.currentTime][key] = pixelMap[key];
            //     }
            // }
        }
        else if(faction === this.OBJECTIVE) {
        	// add to defenses list
        	this.defenses.push({"name" : name,
    						 	"coordinates" : {"x" : x,
    									 	     "y" : y}});
            this.addToLookupMap(pixelMap);
            // var currentLookup = this.shapeLookupMap[this.currentTime];
            // if(currentLookup === undefined) {
            //     // map
            //     this.shapeLookupMap[this.currentTime] = pixelMap;
            // }
            // else {
            //     // add to map
            //     var pixelMapKeys = Object.keys(pixelMap);
            //     for(var i = 0; i < pixelMapKeys.length; i++) {
            //         var key = pixelMapKeys[i];
            //         this.shapeLookupMap[this.currentTime][key] = pixelMap[key];
            //     }
            // }
        }
        else if(faction === this.ENEMY_ZONE) {
        	this.setGridCell(this.factionGrid, y, x, this.ENEMY_ZONE);
        }
        else if(faction === this.FRIEND_ZONE) {
        	this.setGridCell(this.factionGrid, y, x, this.FRIEND_ZONE);
        }
    }

	this.renderGridCells();
}

LevelEditManager.prototype.addExistingSpawnsToLookupMap = function(spawns) {
    var pixelMap = {};
    if(spawns === undefined)
        return;
    var gameManager = require('GameManager');

    for(var j = 0; j < spawns.length; j++) {
    // place each pixel of the shape
        var shape = gameManager.shapeManager.getShape(spawns[i].name);
        for (var i = 0; i < pixels.length; i += 2)
        {
            var col = clickCol + pixels[i+1];
            var row = clickRow + pixels[i];

            pixelMap[col + " " + row] = {"x" : clickCol, "y" : clickRow};
        }
    }
}

LevelEditManager.prototype.addToLookupMap = function(pixelMap) {
    var currentLookup = this.shapeLookupMap[this.currentTime];
    if(currentLookup === undefined) {
        // map
        this.shapeLookupMap[this.currentTime] = pixelMap;
    }
    else {
        // add to map
        var pixelMapKeys = Object.keys(pixelMap);
        for(var i = 0; i < pixelMapKeys.length; i++) {
            var key = pixelMapKeys[i];
            this.shapeLookupMap[this.currentTime][key] = pixelMap[key];
        }
    }
}

LevelEditManager.prototype.deleteUnit = function(x, y) {
    var timeSliceMap = this.shapeLookupMap[this.currentTime];
    if(timeSliceMap === undefined)
        return;
    var coords = timeSliceMap[x + " " + y];
    if(coords === undefined)
        return;

    var spawns = this.enemySpawns[this.currentTime];
    var i;
    var shape;
    if(spawns !== undefined) {
        for(i = 0; i < spawns.length; i++) {
            if(JSON.stringify(spawns[i].coordinates) === JSON.stringify(coords)) {
                shape = spawns.splice(i,1)[0];
                coords = shape.coordinates;
                break;
            }
        }
    }
    if(shape === undefined) {
        var spawns = this.defenses;
        if(spawns !== undefined) {
            for(i = 0; i < spawns.length; i++) {
                if(JSON.stringify(spawns[i].coordinates) === JSON.stringify(coords)) {
                    shape = spawns.splice(i,1)[0];
                    coords = shape.coordinates;
                    break;
                }
            }
        }
    }

    if(shape === undefined)
        return undefined;

    var gameManager = require('GameManager');
    shape = gameManager.shapeManager.getShape(shape.name);

    return {"shape" : shape, "coordinates" : coords};
}

/**
 * Place any defenses on the list of the level.
 */
LevelEditManager.prototype.placeDefenses = function(defenses, addToMaps) {
    // check if there are existing defenses
    if(typeof defenses === "undefined")
        return;
    var gameManager = require('GameManager');

    this.selectedFaction = this.OBJECTIVE;

    // place each one on the nonGhostGrid
    for(var i = 0; i < defenses.length; i++) {
        var shape = defenses[i].name;
        var coords = defenses[i].coordinates;
        shape = gameManager.shapeManager.getShape(shape);
        this.selectedUnit = shape;
        this.placeShape(coords.y, coords.x, this.OBJECTIVE,
                        shape, this.nonGhostGrid, addToMaps);
    }
    this.selectedUnit = undefined;
    this.selectedFaction = this.BLANK;
}

/**
 * Clear the ghostGrid and update the renderGrid.
 */
LevelEditManager.prototype.clearGhostGrid = function() {
    // clear ghostGrid
    for(var i = 0; i < (this.gridWidth*this.gridHeight); i++) {
        this.ghostGrid[i] = this.BLANK;
    }

    // update the renderGrid like an update loop but without interactions
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // calculate the index in the grid arrays
            var index = (i * this.gridWidth) + j;
            // get cell statuses
            var ghostCell = this.ghostGrid[index];
            var underCell = this.nonGhostGrid[index];

            if(ghostCell !== this.BLANK)
                this.renderGrid[index] = this.GHOST;
            else if(underCell !== this.BLANK)
            	this.renderGrid[index] = underCell;
       		else
                this.renderGrid[index] = this.factionGrid[index];
        }
    }

    // this.canvas.renderGridCells(this.gridHeight, this.gridWidth,
    //                      		this.renderGrid, this.renderGridOld,
    //                      		this.colors);
	this.renderGridCells();
}

/**
 * Check if the given row and column coordinates correspond
 * to a valid cell.
 * @param {int} row Row on the canvas
 * @param {int} col Column on the canvas
 * @return true if valid; false otherwise
 */
LevelEditManager.prototype.isValidCell = function(row, col) {
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
 * Accessor method for getting the cell value in the grid at
 * location (row, col).
 * @param {int[]} grid Which grid to check
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @return {int} Cell life type in the given cell
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

/**
 * Mutator method for setting the cell value in the grid at
 * location (row, col).
 * @param {int[]} grid Which grid to change
 * @param {int} row Row in the grid
 * @param {int} col Column in the grid
 * @param {int} value Value to change to
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

/**
 * Renders the grid cells of the game using PixiCanvas.
 */
LevelEditManager.prototype.renderGridCells = function() {
    for(var i = 0; i < this.gridHeight; i++)
    {
        for(var j = 0; j < this.gridWidth; j++)
        {
            // calculate index of this cell in the grid arrays
            var index = (i * this.gridWidth) + j;
            // get status of this cell
            var renderCell = this.renderGrid[index];
            // check if it has been updated since last render
            if(renderCell !== this.renderGridOld[index]) {
                // if yes, render it again
                this.canvas.setCell(j, i, this.colors[renderCell]);
            }
        }
    }

    // set old renderGrid to this new renderGrid
    this.renderGridOld = this.renderGrid;
    this.renderGrid = this.renderGrid.slice(0);

    this.canvas.render();
}

module.exports = LevelEditManager;
