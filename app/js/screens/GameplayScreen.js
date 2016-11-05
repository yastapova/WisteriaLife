var screen = require('./Screen');
var GameLogicManager = require('../backend/GameLogicManager');
var GameManager = require('../backend/GameManager');

var gameplayScreen = function(id, level) {
    this.level = level;
    this.gameLogicManager = new GameLogicManager(level);
    screen.call(this,id);
};

inherits(gameplayScreen, screen);

gameplayScreen.prototype.load = function() {

};

gameplayScreen.prototype.hide = function() {

};

gameplayScreen.prototype.displayMessage = function(){};

/**
 * Add a shape to the level's allowed shapesand increment its quantity by 1
 */
gameplayScreen.prototype.addShape = function(shape) {
    // get the powerups manager to execute the powerup callback
    var gameManager = GameManager.getGameManager();
    var powerup = gameManager.powerupManager.powerupsMap.get(shape);
    powerup.effect(this.level);
};

/**
 * Reduce the remaing time by a given amount. This can also affect enemy spawns if
 * they were scheduled to spawn within the time range that was removed.
 */
gameplayScreen.prototype.reduceTime = function() {
    // get the powerups manager to execute the powerup callback
};

/**
 * Delete the next enemy spawn.
 */
gameplayScreen.prototype.stopSpawn = function(num) {
    // get the powerups manager to execute the powerup callback
};

module.exports = gameplayScreen;
