/*
 * TutorialScreen.js
 * TutorialScreen object
 */
var Screen = require('./Screen');

/*
 * Construct a TutorialScren with given id
 *
 */

var TutorialScreen = function (id, level) {
    this.level = level;
    Screen.call(this, id, true, level);
};

inherits(TutorialScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

TutorialScreen.prototype.init = function() {
    console.log("Tutorial screen init called");

    this.gameManager = require('GameManager');
    this.gameLogicManager = this.gameManager.gameLogicManager;
    this.gameLogicManager.paused = true;

    $('#tutorial-play').on('click', function () {
        var gameplayScreen = require('GameplayScreen');

        this.gameManager.screenManager.hideScreen(this);

        if (this.gameManager.gameLogicManager.paused) {
            this.gameManager.gameLogicManager.start();

            $(gameplayScreen).find('#playpause').attr('data-level', this.level);
            $(gameplayScreen).find('#playpause').find('i').removeClass('play').removeClass('mdi-play');
            $(gameplayScreen).find('#playpause').find('i').addClass('pause').addClass('mdi-pause');
            $(gameplayScreen).find('#playpause').attr('href', '/pause');
            return false;
        }

        // Pause handled by GameplayScreen

    }.bind(this));

};

TutorialScreen.prototype.hide = function() {

};

module.exports = TutorialScreen;
