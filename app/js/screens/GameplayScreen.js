
var screen = require('Screen');

var GameLogicManager = require('GameLogicManager');

var gameplayScreen = function(id, level) {
    this.level = level;
    this.gameLogicManager = new GameLogicManager();
    screen.call(this,id);
};

inherits(gameplayScreen, screen);

gameplayScreen.prototype.load = function() {

};

gameplayScreen.prototype.hide = function() {

};

gameplayScreen.prototype.addShape = function(shape) {

};

/**
 * Reduce the remaing time by a given amount. This can also affect enemy spawns if
 * they were scheduled to spawn within the time range that was removed.
 */
gameplayScreen.prototype.reduceTime = function() {
    // get the powerups manager to execute the powerup callback
};

gameplayScreen.prototype.stopSpawn = function(num) {
    // get the powerups manager to execute the powerup callback
};

module.exports = gameplayScreen;
