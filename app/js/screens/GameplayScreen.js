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

    // play pause button event
    var self = this;
    $('#playpause').click(function () {
        if (self.gameLogicManager.paused) {
            self.gameLogicManager.start(); // resume button is on pause screen

            $(this).attr('href', 'pause');
            $(this).find('i').removeClass('play').removeClass('mdi-play');
            $(this).find('i').addClass('pause').addClass('mdi-pause');

            return false; // prevent event bubbling
        } else
            self.gameLogicManager.pause();
    });

    // update timer once per second
    this.timeDisplay = $('#timer-display')
    this.timer = setInterval(function () {
        if (!this.gameLogicManager.paused) {
            this.level.time--;
            if (this.level.time == 0) {
                this.gameLogicManager.pause();
                this.gameManager.screenManager.switchScreens('victory');
            }
        }
        this.setTimeDisplay(this.level.time);

    }.bind(this), 1000);

    // update current shape
    $('#units li a').on('click', function () {
        self.gameLogicManager.currentUnit =
            self.gameManager.shapeManager.getShape(
                $(this).attr('data-unit')
            );
    });
};

/**
 * Set Time display
 * Calculates m:ss format of seconds
 * @param {int} seconds Time in seconds
 */
GamePlayScreen.prototype.setTimeDisplay = function (seconds) {

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.timeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
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
