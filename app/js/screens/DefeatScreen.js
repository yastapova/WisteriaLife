/*
 * DefeatScreen.js
 * DefeatScreen object
 */
var screen = require('./Screen');

 /*
  * construct a DefeatScreen obj with given id
  */
var DefeatScreen = function(id) {
    Screen.call(this,id);
};

inherits(DefeatScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
DefeatScreen.prototype.init = function() {
    console.log("Defeat screen init called");

};

DefeatScreen.prototype.hide = function() {

};

module.exports = DefeatScreen;
