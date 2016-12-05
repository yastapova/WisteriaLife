/*
 * EditorOverlayScreen.js
 * EditorOverlay object
 */
var Screen = require('./Screen');

/*
 * Construct a EditorOverlayScreen with given id
 *
 */

var EditorOverlayScreen = function (id, level) {
    Screen.call(this, id, true, level);
};

inherits(EditorOverlayScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

EditorOverlayScreen.prototype.init = function() {
    console.log("Editor Overlay screen init called");

    this.gameManager = require('GameManager');
    // this.gameLogicManager = this.gameManager.gameLogicManager;
    // this.gameLogicManager.paused = true;

    $('#editor-play').on('click', function () {
        var gameplayScreen = require('GameplayScreen');

        this.gameManager.screenManager.hideScreen(this);

        // if (this.gameManager.gameLogicManager.paused) {
        //     this.gameManager.gameLogicManager.start();

        //     $(gameplayScreen).find('#playpause').attr('data-level', this.level);
        //     $(gameplayScreen).find('#playpause').find('i').removeClass('play').removeClass('mdi-play');
        //     $(gameplayScreen).find('#playpause').find('i').addClass('pause').addClass('mdi-pause');
        //     $(gameplayScreen).find('#playpause').attr('href', '/pause');
        //     return false;
        // }

        // Pause handled by GameplayScreen

    }.bind(this));

};

module.exports = EditorOverlayScreen;
