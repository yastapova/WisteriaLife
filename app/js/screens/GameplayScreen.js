var Screen = require('./Screen');
var GameLogicManager = require('../backend/GameLogicManager');
var gameManager = require('../backend/GameManager');

var GamePlayScreen = function (id, properties) {
    this.level = null;

    this.gameManager = require('GameManager');
    this.gameLogicManager = this.gameManager.gameLogicManager;

    Screen.call(this, id);
};


inherits(GamePlayScreen, Screen);

/**
 * Callback function for setting level from LevelManager loadLevel
 * @param {Level} level Level object
 */
GamePlayScreen.prototype.setLevel = function (level) {
    this.level = level;

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#gameplay-canvas'), 'medium');

    this.gameLogicManager.setLevel(level, canvas);
}

/**
 * Setup game logic manager with level and canvas
 *
 * Setup all events
 */
GamePlayScreen.prototype.init = function () {
    console.log("Gameplay screen init called");


    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    // load level, set level callback function
    this.gameManager.levelManager.loadLevel(1, this.setLevel.bind(this));

    $('#playpause').click(function () {
        if (this.gameLogicManager.paused)
            this.gameLogicManager.play(); // resume button is on pause screen
        else
            this.gameLogicManager.pause();
    });

    this.timeDisplay = $('#timer-display')
    this.timer = setInterval(function () {
        if (!this.gameLogicManager.paused)
            this.level.time--;
        this.timeDisplay.text(this.level.time);
    }.bind(this), 1000);
};

GamePlayScreen.prototype.hide = function() {

};

GamePlayScreen.prototype.displayMessage = function(){};

/**
 * Apply the powerup on the level
 * @param powerup the name of the power up to use
 */
GamePlayScreen.prototype.usePowerup = function(powerup) {
    // get the powerups manager to execute the powerup callback
    var powerupObj = gameManager.powerupManager.powerupsMap.get(powerup);
    powerupObj.effect(this.level);
};

module.exports = GamePlayScreen;
