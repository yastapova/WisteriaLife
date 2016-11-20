/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function (id, level) {
    this.level = level;
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
    $('#tower_num').on("change", function() {
    $('.output').val(" x" + this.value);
    }).trigger("change");
    $('#blockade_num').on("change", function() {
    $('.output').val(" x" + this.value);
    }).trigger("change");
};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
