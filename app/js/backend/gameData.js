/* 
 * gameData.js
 * Defines a gameData obj 
 */

 /*
  * Construct a blank gameData obj
  */
var gameData = function() {
	this.wistbux = 0;
    this.powerupsMap = new Map();
	this.currentLevel = 0;
	this.customLevelsIds = [];
};
