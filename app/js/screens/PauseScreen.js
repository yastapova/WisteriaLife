/*
 * PauseScreen.js
 * PauseScreen object
 */
var Screen = require('./Screen');

/*
 * Construct a PauseScreen with given id
 *
 */

var PauseScreen = function (id, level) {
    Screen.call(this, id, true, level);
    this.level = level;
};

inherits(PauseScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

PauseScreen.prototype.init = function() {
    console.log("Pause screen init called");

    $('#resume-button').on('click', function () {
        var gameManager = require('GameManager');
        gameManager.gameLogicManager.resume();
        gameManager.screenManager.hideScreen(this);
    }.bind(this));

    $('#help-button').on('click', function () {
        var gameManager = require('GameManager');
        gameManager.screenManager.hideScreen(this);
        gameManager.screenManager.switchScreens('tutorial', this.level);
    }.bind(this));


    if (!$.isNumeric(this.level)) {

        $('#level-back-button').attr('href', '#!');
        $('#level-back-button').removeAttr('data-region');
        $('#level-back-button').on('click', function() {
            history.go(-2);
        });

        $('#level-next-button')
            .attr('href', '/private-custom-levels')
            .attr('data-level', '');
    }
    else if($.isNumeric(this.level)) {
        var region = 0;
        if(this.level < 11) {
            region = 1;
        }
        else if(10 < this.level < 21) {
            region = 2;
        }
        else if(20 < this.level < 31) {
            region = 3;
        }
        else {
            region = 4;
        }
        $('#level-back-button')
            .attr('data-region', region);
    }

};

PauseScreen.prototype.replay = function() {

};

module.exports = PauseScreen;
