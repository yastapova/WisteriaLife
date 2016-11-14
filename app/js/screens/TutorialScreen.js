/*
 * TutorialScreen.js
 * TutorialScreen object
 */
var Screen = require('./Screen');

/*
 * Construct a TutorialScren with given id
 *
 */

var TutorialScreen = function (id, properties) {
    this.properties = properties;
    Screen.call(this, id, true);
};

inherits(TutorialScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

TutorialScreen.prototype.init = function() {
    console.log("Tutorial screen init called");

    $('#tutorial-play').on('click', function () {
    	console.log("clicked button");
        var gameManager = require('GameManager');
        var gameplayScreen = require('GameplayScreen');
        gameManager.screenManager.hideScreen(this);
       	gameManager.gameLogicManager.start();
        // $(gameplayScreen).attr('href', 'pause');
        // $(gameplayScreen).find('i').removeClass('play').removeClass('mdi-play');
        // $(gameplayScreen).find('i').addClass('pause').addClass('mdi-pause');
    }.bind(this));

};

TutorialScreen.prototype.hide = function() {

};

TutorialScreen.prototype.replay = function() {

};

module.exports = TutorialScreen;
