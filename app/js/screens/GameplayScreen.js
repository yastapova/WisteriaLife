var Screen = require('./Screen');
var GameLogicManager = require('../backend/GameLogicManager');
var gameManager = require('../backend/GameManager');

/**
 * Gameplay Screen
 * @param {String} id          Screen name id ("gameplay")
 * @param {[type]} levelNumber Level number
 */
var GamePlayScreen = function (id, levelNumber) {
    this.levelNumber = levelNumber;

    this.gameManager = require('GameManager');
    this.gameLogicManager = this.gameManager.gameLogicManager;

    Screen.call(this, id, false, levelNumber);
};


inherits(GamePlayScreen, Screen);

/**
 * Callback function for setting level from LevelManager loadLevel
 * @param {Level} level Level object
 */
GamePlayScreen.prototype.setLevel = function (level) {

    this.level = level;
    this.totalTime = this.level.time;

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#gameplay-canvas'), this.level.grid);

    this.gameLogicManager.setLevel(level, canvas);
    var allowed = Object.keys(this.gameLogicManager.allowedShapesMap);

    $('#unit-select-menu select').append((function () {
        var shapes = [];
        for(var i = 0; i < allowed.length; i++)
        {
            shapes.push('<option value=\'' + allowed[i] +
                        '\' data-icon=\'/img/powerups/' + allowed[i] + '.png\'>' +
                        allowed[i] +
                        this.gameLogicManager.allowedShapesMap[allowed[i]] +
                        '</option>');
        }
        return shapes;
    }.bind(this))());
    $('select').material_select();
}

/**
 * Setup game logic manager with level and canvas
 *
 * Setup all events
 */
GamePlayScreen.prototype.init = function () {
    console.log("Gameplay screen init called");

    this.gameManager.screenManager.switchScreens('tutorial');

    $('select').material_select();

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    // load level, set level callback function
    this.gameManager.levelManager.loadLevel(this.levelNumber, this.setLevel.bind(this));

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

    // cheat button event
    $('#cheat').click(function () {
        if (self.gameLogicManager.paused)
            self.gameLogicManager.start();
        this.level.time = 0;
    }.bind(this));

    // update timer once per second
    this.timeDisplay = $('#timer-display');
    this.timeBar = $('#time-bar');

    this.timer = setInterval(function () {
        if (!this.gameLogicManager.paused) {
            this.level.time--;

            if (this.level.time < 0)
                this.level.time = 0;

            if (this.level.time == 0) {
                this.gameLogicManager.pause();
                if (this.gameLogicManager.isDead())
                    this.gameManager.screenManager.switchScreens('defeat');
                else
                    this.gameManager.screenManager.switchScreens('victory');
            }
            if (this.gameLogicManager.isDead()) {
                this.gameLogicManager.pause();
                this.gameManager.screenManager.switchScreens('defeat');
            }
        }
        this.setTimeDisplay(this.level.time);

    }.bind(this), 1000);

    // push timer
    this.gameManager.screenManager.timers.push(this.timer);

    // update current shape
    $('#unit-select-menu select').change(function () {
        self.gameLogicManager.currentUnit =
            self.gameManager.shapeManager.getShape(
                $(this).val()
            );
    });
};

/**
 * Set Time display
 * Calculates m:ss format of seconds
 * @param {int} seconds Time in seconds
 */
GamePlayScreen.prototype.setTimeDisplay = function (seconds) {

    var percent = seconds / this.totalTime * 100;

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.timeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);

    this.timeBar.width(percent + "%");

    if (percent < 20)
        this.timeBar.css('background-color', '#b21c1c');
};

GamePlayScreen.prototype.hide = function() {

};

GamePlayScreen.prototype.displayMessage = function () {

};

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
