/*
 * GameData.js
 * Defines a GameData obj
 */

 /*
  * Construct a blank GameData obj
  */
var GameData = function() {
    this.wistbux = 0;
    this.powerupsMap = new Map();
    this.currentLevel = 0;
    this.customLevelsIds = [];
};

GameData.prototype.getCurrentLevel = function() {
	return this.currentLevel;
}

module.exports = GameData;
