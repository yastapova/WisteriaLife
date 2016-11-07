var screen = require('./Screen');
var GameLogicManager = require('../backend/GameLogicManager');
var GameManager = require('../backend/GameManager');

var gameplayScreen = function(id, properties, level) {
    this.level = level;

    this.gameLogicManager = new GameLogicManager(level);

    screen.call(this,id);
};

inherits(gameplayScreen, screen);

gameplayScreen.prototype.init = function() {
    console.log("Gameplay screen init called");

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#gameplay-canvas'), 'medium');

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
};

gameplayScreen.prototype.hide = function() {

};

gameplayScreen.prototype.displayMessage = function(){};

/**
 * Apply the powerup on the level
 * @param powerup the name of the power up to use
 */
gameplayScreen.prototype.usePowerup = function(powerup) {
    // get the powerups manager to execute the powerup callback
    var gameManager = GameManager.getGameManager();
    var powerupObj = gameManager.powerupManager.powerupsMap.get(powerup);
    powerupObj.effect(this.level);
};

module.exports = gameplayScreen;
