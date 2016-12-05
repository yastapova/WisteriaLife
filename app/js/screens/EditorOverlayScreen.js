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
    
    $('#editor-play').on('click', function () {
        this.gameManager.screenManager.hideScreen(this);
    }.bind(this));

};

module.exports = EditorOverlayScreen;
