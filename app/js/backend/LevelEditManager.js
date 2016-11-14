'use strict';

var LevelEditManager = function() {
	this.MESSAGE_TIME_DIFFERENCE = 4;
	this.messageMap = {}; // time : String
	this.defenses = []; // [{name : String, coordinates : {x : int, y : int}}]
	
}