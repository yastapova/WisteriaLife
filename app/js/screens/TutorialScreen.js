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

    $('#tutorial-play').on('click', function () {
        var gameManager = require('../backend/GameManager');
        var gameplayScreen = require('GameplayScreen');

        gameManager.screenManager.hideScreen(this);

        if (gameManager.gameLogicManager.paused) {
            gameManager.gameLogicManager.start();

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
