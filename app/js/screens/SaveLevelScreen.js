/*
 * SaveLevelScreen.js
 * SaveLevelScreen object
 */
var Screen = require('./Screen');

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
SaveLevelScreen.prototype.init = function() {
    console.log("Save levels screen init called");

};

SaveLevelScreen.prototype.hide = function() {

};

module.exports = SaveLevelScreen;
