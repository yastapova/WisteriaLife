/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var screen = require('./Screen');

 /*
  * construct a SaveLevelScreen obj with given id
  */
var SaveLevelScreen = function(id) {
    Screen.call(this,id);
};

inherits(SaveLevelScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
SaveLevelScreen.prototype.load = function() {

};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
