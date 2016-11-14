/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function (id, properties) {
    this.properties = properties;
    Screen.call(this, id, true);
};

inherits(SaveLevelScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
SaveLevelScreen.prototype.init = function() {
    console.log("Save levels screen init called");

    $('#save-cancel-button').on('click', function () {
        var gameManager = require('GameManager');
        gameManager.screenManager.hideScreen(this);
    }.bind(this));

};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
