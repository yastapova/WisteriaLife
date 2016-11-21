'use strict';

var LevelEditManager = function(levelSize) {
	this.size = levelSize;
	this.rows = 0;
	this.cols = 0;
	this.MESSAGE_TIME_DIFFERENCE = 4;
	this.messageMap = {}; // {time : String}
	this.defenses = []; // [{name : String, coordinates : {x : int, y : int}}]
	this.factionGrid = new Array(rows*cols);
	this.enemySpawns = {}; // {time : int, shapes :  [{name : String, coordinates : {x : int, y : int}}]}
	this.totalTime = 0;
	this.allowedShapes = {}; // {name : quantity}
}